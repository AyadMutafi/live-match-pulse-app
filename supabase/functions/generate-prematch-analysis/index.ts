import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Input validation schema
const inputSchema = z.object({
  matchId: z.string().uuid({ message: 'Invalid match ID format' }),
});

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Validate input
    let validatedInput;
    try {
      const body = await req.json();
      validatedInput = inputSchema.parse(body);
    } catch (validationError) {
      console.error('Validation error:', validationError);
      return new Response(
        JSON.stringify({ error: 'Invalid input parameters' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { matchId } = validatedInput;

    // Fetch match details
    const { data: match, error: matchError } = await supabase
      .from('matches')
      .select(`
        *,
        home_team:teams!matches_home_team_id_fkey(name, league, country),
        away_team:teams!matches_away_team_id_fkey(name, league, country)
      `)
      .eq('id', matchId)
      .single();

    if (matchError) {
      console.error('Match fetch error:', matchError);
      return new Response(
        JSON.stringify({ error: 'Match not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fetch recent matches for both teams (last 5)
    const [homeTeamMatches, awayTeamMatches] = await Promise.all([
      supabase.from('matches')
        .select('*')
        .or(`home_team_id.eq.${match.home_team_id},away_team_id.eq.${match.home_team_id}`)
        .order('match_date', { ascending: false })
        .limit(5),
      supabase.from('matches')
        .select('*')
        .or(`home_team_id.eq.${match.away_team_id},away_team_id.eq.${match.away_team_id}`)
        .order('match_date', { ascending: false })
        .limit(5)
    ]);

    // Call Lovable AI for deep analysis
    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: 'You are a professional football analyst providing deep tactical insights. Analyze teams based on recent form, tactical approaches, and provide expert-level predictions.'
          },
          {
            role: 'user',
            content: `Analyze this upcoming match: ${match.home_team.name} vs ${match.away_team.name} in ${match.competition}.

Home team recent form: ${JSON.stringify(homeTeamMatches.data?.slice(0, 5))}
Away team recent form: ${JSON.stringify(awayTeamMatches.data?.slice(0, 5))}

Provide a detailed analysis including:
1. Overall form rating (0-100) for each team
2. Key tactical strengths and weaknesses
3. Predicted formation and style of play
4. Expert insights and predictions
5. Key player analysis (mention 2-3 players per team)

Format as JSON with this structure:
{
  "homeTeam": {
    "overallForm": number,
    "tactics": { "formation": "4-3-3", "style": "High pressing", "effectiveness": 85 },
    "strengths": ["Strong midfield", "Fast counter-attacks"],
    "weaknesses": ["Weak defense", "Poor set pieces"],
    "keyPlayers": [
      { "name": "Player Name", "position": "ST", "formRating": 85, "keyStrengths": ["Finishing"], "concerns": ["Fitness"] }
    ],
    "expertOpinions": [
      { "source": "AI Analysis", "quote": "Strong attacking threat", "sentiment": "positive" }
    ]
  },
  "awayTeam": { ... same structure ... },
  "matchPrediction": "Analysis summary"
}`
          }
        ]
      })
    });

    if (!aiResponse.ok) {
      console.error('AI API error:', aiResponse.status);
      return new Response(
        JSON.stringify({ error: 'Failed to generate analysis' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const aiData = await aiResponse.json();
    const analysisText = aiData.choices[0].message.content;
    
    // Parse JSON from AI response
    let analysis;
    try {
      const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
      analysis = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
    } catch (e) {
      console.error('Failed to parse AI response:', e);
      analysis = null;
    }

    return new Response(
      JSON.stringify({
        matchId,
        homeTeam: match.home_team.name,
        awayTeam: match.away_team.name,
        competition: match.competition,
        matchDate: match.match_date,
        analysis: analysis || {
          homeTeam: {
            overallForm: 75,
            tactics: { formation: "4-3-3", style: "Possession-based", effectiveness: 75 },
            strengths: ["Technical ability", "Ball retention"],
            weaknesses: ["Defensive vulnerability"],
            keyPlayers: [],
            expertOpinions: []
          },
          awayTeam: {
            overallForm: 70,
            tactics: { formation: "4-4-2", style: "Counter-attacking", effectiveness: 70 },
            strengths: ["Pace on the break"],
            weaknesses: ["Limited possession"],
            keyPlayers: [],
            expertOpinions: []
          }
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

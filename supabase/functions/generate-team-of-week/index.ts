import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Input validation schema with date range limit
const inputSchema = z.object({
  weekStart: z.string().regex(/^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?)?$/, { message: 'Invalid date format for weekStart' }),
  weekEnd: z.string().regex(/^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?)?$/, { message: 'Invalid date format for weekEnd' }),
  competition: z.string().max(100).optional(),
}).refine(data => {
  const start = new Date(data.weekStart);
  const end = new Date(data.weekEnd);
  const daysDiff = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
  return daysDiff <= 30 && daysDiff >= 0;
}, { message: 'Date range must be between 0 and 30 days' });

Deno.serve(async (req) => {
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
        JSON.stringify({ error: 'Invalid input parameters. Ensure valid date formats and range within 30 days.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { weekStart, weekEnd, competition } = validatedInput;

    // Fetch matches for the week and competition
    let query = supabase
      .from('matches')
      .select(`
        *,
        home_team:teams!matches_home_team_id_fkey(id, name, league, country),
        away_team:teams!matches_away_team_id_fkey(id, name, league, country)
      `)
      .gte('match_date', weekStart)
      .lte('match_date', weekEnd)
      .eq('status', 'finished');
    
    // Filter by competition if provided
    if (competition) {
      query = query.eq('competition', competition);
    }
    
    const { data: matches, error: matchError } = await query.order('match_date', { ascending: true });

    if (matchError) {
      console.error('Match fetch error:', matchError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch matches' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!matches || matches.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No finished matches found for this week' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fetch sentiment data for these matches
    const matchIds = matches.map(m => m.id);
    const teamIds = [...new Set(matches.flatMap(m => [m.home_team_id, m.away_team_id]))];
    
    const { data: sentimentData, error: sentimentError } = await supabase
      .from('social_posts')
      .select('match_id, team_id, sentiment_score, emotions, content')
      .in('match_id', matchIds);

    if (sentimentError) {
      console.error('Sentiment fetch error:', sentimentError);
    }

    // Fetch match emotions data (aggregated sentiment per team)
    const { data: matchEmotions, error: emotionsError } = await supabase
      .from('match_emotions')
      .select('match_id, team_id, emotion_distribution, total_posts, avg_sentiment, peak_moments')
      .in('match_id', matchIds);

    if (emotionsError) {
      console.error('Match emotions fetch error:', emotionsError);
    }

    // Fetch fan reactions for more granular sentiment
    const { data: fanReactions, error: reactionsError } = await supabase
      .from('fan_reactions')
      .select('match_id, team_id, player_id, reaction_type, emoji, intensity, content')
      .in('match_id', matchIds);

    if (reactionsError) {
      console.error('Fan reactions fetch error:', reactionsError);
    }

    // Build detailed sentiment analysis per team
    const teamSentimentAnalysis = teamIds.map(teamId => {
      const teamPosts = sentimentData?.filter(s => s.team_id === teamId) || [];
      const teamEmotions = matchEmotions?.filter(e => e.team_id === teamId) || [];
      const teamReactions = fanReactions?.filter(r => r.team_id === teamId) || [];
      
      const avgSentiment = teamPosts.length > 0
        ? teamPosts.reduce((sum, s) => sum + (s.sentiment_score || 0), 0) / teamPosts.length
        : 0;
      
      const totalEngagement = teamEmotions.reduce((sum, e) => sum + (e.total_posts || 0), 0);
      const positiveReactions = teamReactions.filter(r => 
        ['celebration', 'excitement', 'joy', 'love'].includes(r.reaction_type?.toLowerCase())
      ).length;
      
      // Extract common emotions from posts
      const emotionCounts: Record<string, number> = {};
      teamPosts.forEach(post => {
        if (post.emotions && typeof post.emotions === 'object') {
          Object.entries(post.emotions).forEach(([emotion, count]) => {
            emotionCounts[emotion] = (emotionCounts[emotion] || 0) + Number(count);
          });
        }
      });
      
      // Get player mentions from reactions
      const playerMentions = teamReactions
        .filter(r => r.player_id)
        .reduce((acc, r) => {
          acc[r.player_id!] = (acc[r.player_id!] || 0) + (r.intensity || 1);
          return acc;
        }, {} as Record<string, number>);

      return {
        teamId,
        avgSentiment,
        totalEngagement,
        positiveReactions,
        negativeReactions: teamReactions.length - positiveReactions,
        topEmotions: Object.entries(emotionCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([emotion]) => emotion),
        playerMentions,
        sampleFanComments: teamPosts.slice(0, 5).map(p => p.content).filter(Boolean),
      };
    });

    // Prepare match summaries with fan sentiment focus
    const matchSummaries = matches.map(m => {
      const homeTeam = m.home_team;
      const awayTeam = m.away_team;
      const homeSentiment = teamSentimentAnalysis.find(t => t.teamId === m.home_team_id);
      const awaySentiment = teamSentimentAnalysis.find(t => t.teamId === m.away_team_id);

      return `${homeTeam.name} vs ${awayTeam.name} (Score: ${m.home_score}-${m.away_score})
  - ${homeTeam.name} fan sentiment: ${((homeSentiment?.avgSentiment || 0) * 100).toFixed(0)}% positive, ${homeSentiment?.totalEngagement || 0} posts, Top emotions: ${homeSentiment?.topEmotions?.join(', ') || 'N/A'}
  - ${awayTeam.name} fan sentiment: ${((awaySentiment?.avgSentiment || 0) * 100).toFixed(0)}% positive, ${awaySentiment?.totalEngagement || 0} posts, Top emotions: ${awaySentiment?.topEmotions?.join(', ') || 'N/A'}`;
    });

    // Use AI to generate Team of the Week based on FAN SENTIMENT
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
            content: `You are a football analyst specializing in FAN SENTIMENT analysis. Your job is to select a Team of the Week based PRIMARILY on how fans reacted to players on social media - NOT on match statistics or scores.

Key criteria for selection (in order of importance):
1. POSITIVE FAN SENTIMENT - Players who generated the most positive fan reactions, excitement, and celebration
2. FAN ENGAGEMENT - Players who fans talked about the most with positive emotions
3. VIRAL MOMENTS - Players who created memorable moments that fans loved and shared
4. EMOTIONAL IMPACT - Players who made fans feel joy, pride, and excitement

You should select players that fans loved watching, talked about positively, and celebrated - regardless of the final score.`,
          },
          {
            role: 'user',
            content: `Based on FAN SENTIMENT from these matches:\n${matchSummaries.join('\n\n')}\n\nGenerate a Team of the Week in a 4-3-3 formation based on which players fans reacted most positively to. Return ONLY a valid JSON object with this exact structure:
{
  "formation": "4-3-3",
  "players": [
    {"position": "GK", "name": "Player Name", "team": "Team Name", "rating": 9.5, "reason": "Fan sentiment reason - e.g., 'Fans celebrated crucial saves'"},
    {"position": "LB", "name": "Player Name", "team": "Team Name", "rating": 8.5, "reason": "Fan sentiment reason"},
    {"position": "CB", "name": "Player Name", "team": "Team Name", "rating": 8.7, "reason": "Fan sentiment reason"},
    {"position": "CB", "name": "Player Name", "team": "Team Name", "rating": 8.8, "reason": "Fan sentiment reason"},
    {"position": "RB", "name": "Player Name", "team": "Team Name", "rating": 8.3, "reason": "Fan sentiment reason"},
    {"position": "LM", "name": "Player Name", "team": "Team Name", "rating": 8.9, "reason": "Fan sentiment reason"},
    {"position": "CM", "name": "Player Name", "team": "Team Name", "rating": 9.0, "reason": "Fan sentiment reason"},
    {"position": "RM", "name": "Player Name", "team": "Team Name", "rating": 8.6, "reason": "Fan sentiment reason"},
    {"position": "LW", "name": "Player Name", "team": "Team Name", "rating": 9.2, "reason": "Fan sentiment reason"},
    {"position": "ST", "name": "Player Name", "team": "Team Name", "rating": 9.5, "reason": "Fan sentiment reason"},
    {"position": "RW", "name": "Player Name", "team": "Team Name", "rating": 9.1, "reason": "Fan sentiment reason"}
  ]
}
Ratings should reflect FAN LOVE (7.0-10.0). Reasons MUST reference fan reactions, not match stats. No markdown, no code blocks, just the JSON.`,
          },
        ],
      }),
    });

    if (!aiResponse.ok) {
      console.error('AI API error:', aiResponse.status);
      return new Response(
        JSON.stringify({ error: 'Failed to generate Team of the Week' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const aiData = await aiResponse.json();
    const teamOfWeekContent = aiData.choices[0].message.content;
    
    // Parse the JSON from AI response
    let teamOfWeek;
    try {
      // Remove markdown code blocks if present
      const cleanContent = teamOfWeekContent.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      teamOfWeek = JSON.parse(cleanContent);
    } catch (parseError) {
      console.error('Failed to parse AI response:', teamOfWeekContent);
      return new Response(
        JSON.stringify({ error: 'Failed to parse AI response' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        weekStart,
        weekEnd,
        matchesAnalyzed: matches.length,
        teamOfWeek,
        matchSummaries,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error generating team of week:', error);
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

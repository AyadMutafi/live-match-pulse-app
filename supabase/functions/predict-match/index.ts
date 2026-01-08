import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Input validation schema
const inputSchema = z.object({
  matchId: z.string().uuid({ message: 'Invalid match ID format' }),
});

// Simple in-memory rate limiter (resets on function cold start)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 10; // requests per minute
const RATE_WINDOW = 60 * 1000; // 1 minute

function checkRateLimit(clientIp: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(clientIp);
  
  if (!record || now > record.resetTime) {
    rateLimitMap.set(clientIp, { count: 1, resetTime: now + RATE_WINDOW });
    return true;
  }
  
  if (record.count >= RATE_LIMIT) {
    return false;
  }
  
  record.count++;
  return true;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Rate limiting check
  const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
                   req.headers.get('x-real-ip') || 
                   'unknown';
  
  if (!checkRateLimit(clientIp)) {
    console.warn(`Rate limit exceeded for IP: ${clientIp}`);
    return new Response(
      JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
      { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json', 'Retry-After': '60' } }
    );
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

    // Fetch the match
    const { data: match, error: matchError } = await supabase
      .from('matches')
      .select(`
        *,
        home_team:teams!matches_home_team_id_fkey(id, name, league, country),
        away_team:teams!matches_away_team_id_fkey(id, name, league, country)
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

    // Fetch recent matches for both teams
    const { data: homeHistory, error: homeError } = await supabase
      .from('matches')
      .select('*')
      .or(`home_team_id.eq.${match.home_team_id},away_team_id.eq.${match.home_team_id}`)
      .eq('status', 'finished')
      .order('match_date', { ascending: false })
      .limit(5);

    const { data: awayHistory, error: awayError } = await supabase
      .from('matches')
      .select('*')
      .or(`home_team_id.eq.${match.away_team_id},away_team_id.eq.${match.away_team_id}`)
      .eq('status', 'finished')
      .order('match_date', { ascending: false })
      .limit(5);

    if (homeError || awayError) {
      console.error('History fetch error:', homeError || awayError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch team history' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Calculate recent form with detailed stats
    const calculateTeamCondition = (matches: any[], teamId: string) => {
      let wins = 0, draws = 0, losses = 0;
      let goalsScored = 0, goalsConceded = 0;
      let homeWins = 0, awayWins = 0;
      
      const form = matches.map(m => {
        const isHome = m.home_team_id === teamId;
        const teamScore = isHome ? m.home_score : m.away_score;
        const oppScore = isHome ? m.away_score : m.home_score;
        
        goalsScored += teamScore;
        goalsConceded += oppScore;
        
        if (teamScore > oppScore) {
          wins++;
          if (isHome) homeWins++; else awayWins++;
          return 'W';
        } else if (teamScore === oppScore) {
          draws++;
          return 'D';
        } else {
          losses++;
          return 'L';
        }
      }).join('');
      
      return {
        form,
        wins,
        draws,
        losses,
        goalsScored,
        goalsConceded,
        goalDifference: goalsScored - goalsConceded,
        homeWins,
        awayWins,
        avgGoalsScored: (goalsScored / matches.length).toFixed(1),
        avgGoalsConceded: (goalsConceded / matches.length).toFixed(1)
      };
    };

    const homeCondition = calculateTeamCondition(homeHistory || [], match.home_team_id);
    const awayCondition = calculateTeamCondition(awayHistory || [], match.away_team_id);

    // Fetch fan reactions for both teams
    const { data: homeFanReactions } = await supabase
      .from('fan_reactions')
      .select('*')
      .eq('team_id', match.home_team_id)
      .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

    const { data: awayFanReactions } = await supabase
      .from('fan_reactions')
      .select('*')
      .eq('team_id', match.away_team_id)
      .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

    // Calculate fan pulse (average intensity and sentiment)
    const calculateFanPulse = (reactions: any[]) => {
      if (!reactions || reactions.length === 0) return { avgIntensity: 50, totalReactions: 0, sentiment: 'neutral' };
      
      const avgIntensity = reactions.reduce((sum, r) => sum + (r.intensity || 50), 0) / reactions.length;
      const positiveEmojis = ['😍', '🔥', '⚡', '💪', '🎯', '👑'];
      const positiveCount = reactions.filter(r => positiveEmojis.includes(r.emoji)).length;
      const sentiment = positiveCount / reactions.length > 0.6 ? 'positive' : 
                        positiveCount / reactions.length < 0.4 ? 'negative' : 'neutral';
      
      return {
        avgIntensity: Math.round(avgIntensity),
        totalReactions: reactions.length,
        sentiment
      };
    };

    const homeFanPulse = calculateFanPulse(homeFanReactions || []);
    const awayFanPulse = calculateFanPulse(awayFanReactions || []);

    // Fetch fan predictions for this match
    const { data: fanPredictions } = await supabase
      .from('match_predictions')
      .select('predicted_winner')
      .eq('match_id', matchId);

    const predictionStats = {
      homeWinPredictions: fanPredictions?.filter(p => p.predicted_winner === 'home').length || 0,
      awayWinPredictions: fanPredictions?.filter(p => p.predicted_winner === 'away').length || 0,
      drawPredictions: fanPredictions?.filter(p => p.predicted_winner === 'draw').length || 0,
      totalPredictions: fanPredictions?.length || 0
    };

    // Use AI to predict match outcome
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
            content: 'You are a football match prediction expert. Analyze team form and provide realistic predictions with probabilities.',
          },
          {
            role: 'user',
            content: `Predict the outcome of: ${match.home_team.name} vs ${match.away_team.name}

**TEAM CONDITION ANALYSIS:**
${match.home_team.name}:
- Recent form: ${homeCondition.form} (${homeCondition.wins}W-${homeCondition.draws}D-${homeCondition.losses}L)
- Goals: ${homeCondition.goalsScored} scored, ${homeCondition.goalsConceded} conceded (${homeCondition.goalDifference > 0 ? '+' : ''}${homeCondition.goalDifference} GD)
- Average: ${homeCondition.avgGoalsScored} goals/game scored, ${homeCondition.avgGoalsConceded} conceded/game
- Home record: ${homeCondition.homeWins} wins in last 5 home games

${match.away_team.name}:
- Recent form: ${awayCondition.form} (${awayCondition.wins}W-${awayCondition.draws}D-${awayCondition.losses}L)
- Goals: ${awayCondition.goalsScored} scored, ${awayCondition.goalsConceded} conceded (${awayCondition.goalDifference > 0 ? '+' : ''}${awayCondition.goalDifference} GD)
- Average: ${awayCondition.avgGoalsScored} goals/game scored, ${awayCondition.avgGoalsConceded} conceded/game
- Away record: ${awayCondition.awayWins} wins in last 5 away games

**FAN PULSE & PREDICTIONS:**
${match.home_team.name} Fans:
- Pulse: ${homeFanPulse.avgIntensity}/100 intensity, ${homeFanPulse.sentiment} sentiment
- Total reactions: ${homeFanPulse.totalReactions}

${match.away_team.name} Fans:
- Pulse: ${awayFanPulse.avgIntensity}/100 intensity, ${awayFanPulse.sentiment} sentiment
- Total reactions: ${awayFanPulse.totalReactions}

Fan Predictions (${predictionStats.totalPredictions} total):
- Home win: ${predictionStats.homeWinPredictions} (${predictionStats.totalPredictions > 0 ? Math.round(predictionStats.homeWinPredictions/predictionStats.totalPredictions*100) : 0}%)
- Draw: ${predictionStats.drawPredictions} (${predictionStats.totalPredictions > 0 ? Math.round(predictionStats.drawPredictions/predictionStats.totalPredictions*100) : 0}%)
- Away win: ${predictionStats.awayWinPredictions} (${predictionStats.totalPredictions > 0 ? Math.round(predictionStats.awayWinPredictions/predictionStats.totalPredictions*100) : 0}%)

**REQUIRED OUTPUT:**
Analyze both team condition and fan sentiment/predictions to provide:
1) Win probabilities (home/draw/away as percentages - consider both team form AND fan pulse)
2) Predicted score
3) Confidence level (0-100)
4) 3 key insights (mention how fan sentiment aligns or contrasts with team form)

Format as JSON: {homeWin: number, draw: number, awayWin: number, predictedScore: string, confidence: number, insights: string[]}`,
          },
        ],
      }),
    });

    if (!aiResponse.ok) {
      console.error('AI API error:', aiResponse.status);
      return new Response(
        JSON.stringify({ error: 'Failed to generate prediction' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const aiData = await aiResponse.json();
    const prediction = aiData.choices[0].message.content;

    // Try to parse JSON from AI response
    let parsedPrediction;
    try {
      const jsonMatch = prediction.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedPrediction = JSON.parse(jsonMatch[0]);
      }
    } catch (e) {
      console.log('Could not parse prediction JSON, using raw response');
    }

    return new Response(
      JSON.stringify({
        matchId,
        homeTeam: match.home_team.name,
        awayTeam: match.away_team.name,
        teamCondition: {
          home: homeCondition,
          away: awayCondition
        },
        fanPulse: {
          home: homeFanPulse,
          away: awayFanPulse
        },
        fanPredictions: predictionStats,
        prediction: parsedPrediction || prediction,
        rawPrediction: prediction,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error predicting match:', error);
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

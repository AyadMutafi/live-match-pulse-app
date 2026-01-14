import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const TARGET_CLUBS = [
  'FC Barcelona', 'Real Madrid CF', 'Atletico de Madrid',
  'Liverpool FC', 'Manchester City FC', 'Manchester United FC', 'Arsenal FC'
];

interface MatchSummaryRequest {
  matchId: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  matchMinute?: number;
  status: 'live' | 'finished' | 'upcoming';
  socialPosts?: Array<{ content: string; platform: string; sentiment?: number }>;
  keyEvents?: Array<{ minute: number; type: string; player?: string; description?: string }>;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get('GOOGLE_AI_API_KEY');
    if (!apiKey) {
      throw new Error('GOOGLE_AI_API_KEY is not configured');
    }

    const matchData: MatchSummaryRequest = await req.json();

    if (!matchData.matchId || !matchData.homeTeam || !matchData.awayTeam) {
      return new Response(
        JSON.stringify({ error: 'matchId, homeTeam, and awayTeam are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Generating match summary for ${matchData.homeTeam} vs ${matchData.awayTeam}`);

    const isTargetClubMatch = TARGET_CLUBS.some(club => 
      matchData.homeTeam.includes(club) || matchData.awayTeam.includes(club) ||
      club.includes(matchData.homeTeam) || club.includes(matchData.awayTeam)
    );

    const systemPrompt = `You are an expert football/soccer match analyst and narrator. Generate engaging, real-time match summaries that capture the drama and emotion of the game.

Your summaries should:
- Be 200-300 words
- Highlight key talking points and viral moments
- Include fan sentiment and reactions when social data is provided
- Mention tactical observations
- Note controversial moments or referee decisions
- Use dynamic, engaging language

Target clubs for detailed analysis: ${TARGET_CLUBS.join(', ')}

Return a JSON object with:
{
  "summary": "The main narrative summary (200-300 words)",
  "keyMoments": ["moment1", "moment2", "moment3"],
  "talkingPoints": ["point1", "point2", "point3"],
  "sentiment": {
    "overall": "positive/negative/neutral/mixed",
    "homeTeamFans": "description",
    "awayTeamFans": "description"
  },
  "viralMoments": ["viral1", "viral2"],
  "controversies": ["controversy1"] or []
}`;

    let matchContext = `
Match: ${matchData.homeTeam} ${matchData.homeScore} - ${matchData.awayScore} ${matchData.awayTeam}
Status: ${matchData.status}${matchData.matchMinute ? ` (${matchData.matchMinute}')` : ''}
`;

    if (matchData.keyEvents && matchData.keyEvents.length > 0) {
      matchContext += `\nKey Events:\n${matchData.keyEvents.map(e => 
        `${e.minute}' - ${e.type}${e.player ? ` (${e.player})` : ''}${e.description ? `: ${e.description}` : ''}`
      ).join('\n')}`;
    }

    if (matchData.socialPosts && matchData.socialPosts.length > 0) {
      const samplePosts = matchData.socialPosts.slice(0, 10);
      matchContext += `\n\nFan Reactions (sample):\n${samplePosts.map(p => 
        `[${p.platform}] ${p.content}`
      ).join('\n')}`;
    }

    const userPrompt = `Generate a match summary for this ${matchData.status} match:\n${matchContext}`;

    const model = 'gemini-2.0-flash';
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            { role: 'user', parts: [{ text: systemPrompt + '\n\n' + userPrompt }] }
          ],
          generationConfig: {
            temperature: 0.7,
            topP: 0.9,
            maxOutputTokens: 2048,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', response.status, errorText);
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const geminiData = await response.json();
    const textContent = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || '';

    let summaryData: any = {
      summary: '',
      keyMoments: [],
      talkingPoints: [],
      sentiment: { overall: 'neutral', homeTeamFans: '', awayTeamFans: '' },
      viralMoments: [],
      controversies: [],
    };

    try {
      const jsonMatch = textContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        summaryData = JSON.parse(jsonMatch[0]);
      } else {
        summaryData.summary = textContent.slice(0, 500);
      }
    } catch (parseError) {
      console.error('Failed to parse summary:', parseError);
      summaryData.summary = textContent.slice(0, 500);
    }

    return new Response(
      JSON.stringify({
        matchId: matchData.matchId,
        homeTeam: matchData.homeTeam,
        awayTeam: matchData.awayTeam,
        score: `${matchData.homeScore} - ${matchData.awayScore}`,
        status: matchData.status,
        ...summaryData,
        generatedAt: new Date().toISOString(),
        isTargetClubMatch,
        model: 'gemini-2.0-flash',
        provider: 'google',
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in gemini-match-summary function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

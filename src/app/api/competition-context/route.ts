import { NextResponse } from 'next/server';
import prisma from "@/lib/prisma";
import { model } from "@/lib/ai-analysis";

export const dynamic = 'force-dynamic';

const COMP_MAP: Record<string, string> = {
  'premier-league': 'PL',
  'la-liga': 'PD',
  'ucl': 'CL'
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const compId = searchParams.get('compId') || 'premier-league';
    const leagueCode = COMP_MAP[compId] || 'PL';

    // 1. Fetch upcoming and recent matches for context
    const recentMatches = await prisma.match.findMany({
      where: { league: { contains: compId === 'premier-league' ? 'Premier' : compId === 'la-liga' ? 'La Liga' : 'Champions' } },
      orderBy: { date: 'desc' },
      take: 5
    });

    // 2. Fetch Standings from Football-Data API (Optional context for AI)
    let standingsContext = "";
    if (process.env.FOOTBALL_DATA_API_KEY) {
      try {
        const response = await fetch(`https://api.football-data.org/v4/competitions/${leagueCode}/standings`, {
          headers: { 'X-Auth-Token': process.env.FOOTBALL_DATA_API_KEY }
        });
        if (response.ok) {
          const data = await response.json();
          const top5 = data.standings?.[0]?.table?.slice(0, 5) || [];
          standingsContext = top5.map((t: any) => `${t.position}. ${t.team.name} (${t.points}pts)`).join(", ");
        }
      } catch (e) {
        console.warn("Standings fetch failed, proceeding with DB matches only");
      }
    }

    // 3. Use Gemini to generate the narrative
    const matchContext = recentMatches.map(m => `${m.homeTeam} ${m.homeScore}-${m.awayScore} ${m.awayTeam} (${m.status})`).join("; ");
    
    const prompt = `You are a football journalist and fan sentiment analyst. 
    Generate a real-time "Competition Context" for ${compId} based on:
    Standings: ${standingsContext}
    Recent Results: ${matchContext}

    Current Date: ${new Date().toLocaleDateString()}

    Return ONLY JSON matching this structure:
    {
      "roundKey": "Matchday X",
      "label": "Matchday X",
      "shortLabel": "MDX",
      "dateRange": "Date range here",
      "narrative": "One sentence summary of the current state of the league.",
      "storylines": ["Storyline 1", "Storyline 2", "Storyline 3"],
      "keyPlayers": [{ "name": "Player Name", "club": "Club", "moment": "Why they are key right now" }],
      "fanMoodSummary": "Summary of what fans are saying.",
      "moodEmoji": "Emoji",
      "accent": "Hex color code matching league (e.g. #3d0099 for PL)"
    }
    
    Be realistic and data-driven. If you don't have specific recent player moments, focus on team form or title race tension.`;

    const result = await model.generateContent(prompt);
    let responseText = result.response.text();
    if (responseText.includes('```')) {
      responseText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    }

    const context = JSON.parse(responseText);

    return NextResponse.json({
      ...context,
      compId
    });

  } catch (error) {
    console.error('[API/CompetitionContext] Error:', error);
    // Fallback context if AI fails
    return NextResponse.json({
      roundKey: 'Live Update',
      label: 'Current Matchday',
      shortLabel: 'LIVE',
      dateRange: 'Active Cycle',
      narrative: 'Data synchronization in progress. Real-time standings being processed.',
      storylines: ['League tension remains high across all tiers', 'Stat-heavy matchdays approaching'],
      keyPlayers: [],
      fanMoodSummary: 'Fans awaiting the next big results to settle the table.',
      moodEmoji: '📡',
      accent: '#666666'
    });
  }
}

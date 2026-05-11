import { NextResponse } from 'next/server'
import prisma from "@/lib/prisma"

export const dynamic = 'force-dynamic'

/**
 * SCOUT AGENT: Roster Synchronization
 * Automatically updates the Player database to ensure clubs/transfers are accurate for 2026.
 */
export async function GET(request: Request) {
  try {
    const apiKey = process.env.FOOTBALL_DATA_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'FOOTBALL_DATA_API_KEY is not defined' }, { status: 500 });
    }

    // Major competitions to monitor
    const { searchParams } = new URL(request.url);
    const comp = searchParams.get('comp') || 'PL'; // Default to Premier League
    
    let updatedPlayersCount = 0;
    let newPlayersCount = 0;

    console.log(`[Scout] Starting roster synchronization for ${comp}...`);

    // 1. Get all teams in this competition
    const teamsUrl = `https://api.football-data.org/v4/competitions/${comp}/teams`;
    const teamsRes = await fetch(teamsUrl, {
      headers: { 'X-Auth-Token': apiKey },
      next: { revalidate: 3600 } // Cache for 1 hour
    });

    if (!teamsRes.ok) {
      const errText = await teamsRes.text();
      throw new Error(`API error for ${comp}: ${teamsRes.status} ${errText}`);
    }

    const teamsData = await teamsRes.json();
    const teams = teamsData.teams || [];

    for (const team of teams) {
      const teamName = team.shortName || team.name;
      const squad = team.squad || [];

      console.log(`[Scout] Syncing ${teamName} (${squad.length} players)...`);

        for (const p of squad) {
          const playerName = p.name;
          const position = p.position || 'Unknown';

          // Try to find the player in our database
          const existingPlayer = await prisma.player.findFirst({
            where: { name: playerName }
          });

          if (existingPlayer) {
            // Check if they changed teams
            if (existingPlayer.team !== teamName) {
              await prisma.player.update({
                where: { id: existingPlayer.id },
                data: { 
                  team: teamName,
                  lastUpdated: new Date()
                }
              });
              updatedPlayersCount++;
            }
          } else {
            // New player found in a major squad
            await prisma.player.create({
              data: {
                name: playerName,
                team: teamName,
                position: mapPosition(position),
                sentiment: 50, // Default lukewarm sentiment
                season: '2025-26', // Updated for current context
                weekNumber: 34 // Current week
              }
            });
            newPlayersCount++;
          }
      }
    }

    // Log the successful activity for telemetry
    await prisma.agentActivity.create({
      data: {
        agent: 'Scout',
        action: 'sync_rosters',
        target: 'Global Clubs',
        status: 'success',
        message: `Synced squads. Updated: ${updatedPlayersCount}, Created: ${newPlayersCount}`
      }
    });

    return NextResponse.json({
      success: true,
      updated: updatedPlayersCount,
      created: newPlayersCount
    });

  } catch (error: any) {
    console.error('[Scout/Sync Error]:', error);
    
    await prisma.agentActivity.create({
      data: {
        agent: 'Scout',
        action: 'sync_rosters',
        target: 'external_api',
        status: 'failed',
        message: error.message
      }
    }).catch(() => {});

    return NextResponse.json({ error: 'Failed to process roster synchronization', msg: error.message }, { status: 500 });
  }
}

function mapPosition(pos: string): string {
  if (['Goalkeeper'].includes(pos)) return 'Goalkeeper';
  if (['Defender', 'Back'].includes(pos)) return 'Defender';
  if (['Midfielder'].includes(pos)) return 'Midfielder';
  if (['Offence', 'Forward', 'Striker'].includes(pos)) return 'Forward';
  return 'Midfielder';
}

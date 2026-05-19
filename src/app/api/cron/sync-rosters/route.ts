import { NextResponse } from 'next/server'
import prisma from "@/lib/prisma"

export const dynamic = 'force-dynamic'

const COMPETITIONS = ['PL', 'PD', 'BL1', 'FL1', 'SA', 'CL'];

import { normalizeName } from "@/lib/name-utils"

function getCurrentSeason(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth(); // 0-indexed
  return month >= 6 ? `${year}-${(year+1)%100}` : `${year-1}-${year%100}`;
}

function mapPosition(pos: string): string {
  if (['Goalkeeper'].includes(pos)) return 'Goalkeeper';
  if (['Defender', 'Back'].includes(pos)) return 'Defender';
  if (['Midfielder'].includes(pos)) return 'Midfielder';
  if (['Offence', 'Forward', 'Striker'].includes(pos)) return 'Forward';
  return 'Midfielder';
}

/**
 * SCOUT AGENT: Multi-Competition Roster Synchronization
 * Automatically updates the Player database to ensure clubs/transfers are accurate.
 */
export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return new Response('Unauthorized', { status: 401 });
    }

    const apiKey = process.env.FOOTBALL_DATA_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'FOOTBALL_DATA_API_KEY is not defined' }, { status: 500 });
    }

    let playersCreated = 0;
    let playersUpdated = 0;
    let playersUnchanged = 0;
    let successfulCompetitions = 0;
    const errors: string[] = [];
    const currentSeason = getCurrentSeason();

    console.log(`[Scout] Starting multi-competition roster synchronization...`);

    // Fetch all existing players to build a normalized map for matching
    const allExistingPlayers = await prisma.player.findMany();
    const playerMap = new Map();
    allExistingPlayers.forEach(p => {
      playerMap.set(normalizeName(p.name), p);
    });

    for (const comp of COMPETITIONS) {
      try {
        console.log(`[Scout] Fetching teams for ${comp}...`);
        const teamsUrl = `https://api.football-data.org/v4/competitions/${comp}/teams`;
        const teamsRes = await fetch(teamsUrl, {
          headers: { 'X-Auth-Token': apiKey },
          next: { revalidate: 3600 }
        });

        if (!teamsRes.ok) {
          const errText = await teamsRes.text();
          errors.push(`API error for ${comp}: ${teamsRes.status} ${errText}`);
          continue;
        }

        const teamsData = await teamsRes.json();
        const teams = teamsData.teams || [];
        successfulCompetitions++;

        for (const team of teams) {
          const teamName = team.shortName || team.name;
          const squad = team.squad || [];

          for (const p of squad) {
            const playerName = p.name;
            const normName = normalizeName(playerName);
            const position = p.position || 'Unknown';

            const existingPlayer = playerMap.get(normName);

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
                playersUpdated++;
                // Update map to reflect current state
                existingPlayer.team = teamName;
              } else {
                // Just update lastUpdated to show they are still active in the squad
                await prisma.player.update({
                  where: { id: existingPlayer.id },
                  data: { lastUpdated: new Date() }
                });
                playersUnchanged++;
              }
            } else {
              // New player found
              const newPlayer = await prisma.player.create({
                data: {
                  name: playerName,
                  team: teamName,
                  position: mapPosition(position),
                  sentiment: 50,
                  season: currentSeason,
                  weekNumber: 34,
                  lastUpdated: new Date()
                }
              });
              playersCreated++;
              playerMap.set(normName, newPlayer);
            }
          }
        }
      } catch (compError: any) {
        errors.push(`Error processing ${comp}: ${compError.message}`);
      }
    }

    // Log the successful activity for telemetry
    await prisma.agentActivity.create({
      data: {
        agent: 'Scout',
        action: 'sync_rosters_multi',
        target: 'Global Clubs',
        status: errors.length > 0 ? 'partial_success' : 'success',
        message: `Synced ${successfulCompetitions}/${COMPETITIONS.length} competitions. Created: ${playersCreated}, Updated: ${playersUpdated}`
      }
    });

    return NextResponse.json({
      totalCompetitions: COMPETITIONS.length,
      successfulCompetitions,
      playersCreated,
      playersUpdated,
      playersUnchanged,
      errors
    });

  } catch (error: any) {
    console.error('[Scout/Sync Multi Error]:', error);
    
    await prisma.agentActivity.create({
      data: {
        agent: 'Scout',
        action: 'sync_rosters_multi',
        target: 'global_process',
        status: 'failed',
        message: error.message
      }
    }).catch(() => {});

    return NextResponse.json({ error: 'Failed to process roster synchronization', msg: error.message }, { status: 500 });
  }
}

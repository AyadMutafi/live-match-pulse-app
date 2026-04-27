import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { extractThemes, groupContentByPlayer } from '@/lib/theme-extractor'
import { scrapeWithGrok } from '@/lib/grok-scraper'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

/**
 * POST /api/themes/update
 * 
 * Triggers AI-powered theme extraction for one or all players.
 * Uses Grok (xAI) to scrape fresh social data, then Gemini to extract themes.
 * 
 * Body:
 *   { playerName?: string }  — Update a specific player
 *   { all?: boolean }        — Update all players
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { playerName, all } = body

    const updatedPlayers: { name: string; positiveTheme: string; negativeTheme: string }[] = []

    if (playerName) {
      // ── Single Player Update ──────────────────────────────────────────
      const player = await db.player.findFirst({
        where: { name: { contains: playerName } }
      })

      if (!player) {
        return NextResponse.json({ error: `Player "${playerName}" not found` }, { status: 404 })
      }

      const scrapeResult = await scrapeWithGrok(`${player.name} ${player.team} fan opinion`, player.name)

      if (!scrapeResult.success || !scrapeResult.content) {
        return NextResponse.json({ error: 'Failed to scrape content for theme analysis' }, { status: 502 })
      }

      const themes = await extractThemes(scrapeResult.content, player.name)

      await db.player.update({
        where: { id: player.id },
        data: {
          positiveTheme: themes.positiveThemes.join(','),
          negativeTheme: themes.negativeThemes.join(','),
          lastThemeUpdate: new Date(),
          lastUpdated: new Date()
        }
      })

      updatedPlayers.push({
        name: player.name,
        positiveTheme: themes.positiveThemes.join(','),
        negativeTheme: themes.negativeThemes.join(',')
      })

      // Log agent activity
      await db.agentActivity.create({
        data: {
          agent: 'Analyst',
          action: 'extract_themes',
          target: player.name,
          status: 'success',
          message: `Extracted ${themes.positiveThemes.length} positive, ${themes.negativeThemes.length} negative themes. Mood: ${themes.fanMood}`
        }
      })

    } else if (all) {
      // ── Batch Update All Players ──────────────────────────────────────
      const players = await db.player.findMany({
        orderBy: { sentiment: 'desc' },
        take: 20 // Cap at top 20 to manage API rate limits
      })

      for (const player of players) {
        try {
          const scrapeResult = await scrapeWithGrok(
            `${player.name} ${player.team} fan opinion`,
            player.name
          )

          if (!scrapeResult.success || !scrapeResult.content) {
            console.warn(`[Theme Update] Skipping ${player.name}: no scraped content`)
            continue
          }

          const themes = await extractThemes(scrapeResult.content, player.name)

          await db.player.update({
            where: { id: player.id },
            data: {
              positiveTheme: themes.positiveThemes.join(','),
              negativeTheme: themes.negativeThemes.join(','),
              lastThemeUpdate: new Date(),
              lastUpdated: new Date()
            }
          })

          updatedPlayers.push({
            name: player.name,
            positiveTheme: themes.positiveThemes.join(','),
            negativeTheme: themes.negativeThemes.join(',')
          })

          // Small delay between players to respect rate limits
          await new Promise(resolve => setTimeout(resolve, 1500))
        } catch (err) {
          console.error(`[Theme Update] Error for ${player.name}:`, err)
        }
      }

      // Log batch activity
      await db.agentActivity.create({
        data: {
          agent: 'Analyst',
          action: 'batch_extract_themes',
          target: `${updatedPlayers.length} players`,
          status: 'success',
          message: `Batch theme extraction completed for ${updatedPlayers.length}/${players.length} players`
        }
      })

    } else {
      return NextResponse.json(
        { error: 'Provide either "playerName" or "all: true"' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      updated: updatedPlayers.length,
      players: updatedPlayers
    })

  } catch (error) {
    console.error('[Theme Update API] Error:', error)
    return NextResponse.json(
      { error: 'Theme update failed', message: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}

/**
 * GET /api/themes/update
 * Returns the current theme freshness status for all players.
 */
export async function GET() {
  try {
    const players = await db.player.findMany({
      select: {
        id: true,
        name: true,
        team: true,
        positiveTheme: true,
        negativeTheme: true,
        lastThemeUpdate: true
      },
      orderBy: { sentiment: 'desc' }
    })

    const now = Date.now()
    const enriched = players.map(p => ({
      ...p,
      hasThemes: !!(p.positiveTheme || p.negativeTheme),
      isLive: p.lastThemeUpdate ? (now - new Date(p.lastThemeUpdate).getTime()) < 3600000 : false,
      staleness: p.lastThemeUpdate
        ? Math.round((now - new Date(p.lastThemeUpdate).getTime()) / 60000)
        : null
    }))

    return NextResponse.json({
      total: players.length,
      withThemes: enriched.filter(p => p.hasThemes).length,
      liveThemes: enriched.filter(p => p.isLive).length,
      players: enriched
    })
  } catch (error) {
    console.error('[Theme Status] Error:', error)
    return NextResponse.json({ error: 'Failed to fetch theme status' }, { status: 500 })
  }
}

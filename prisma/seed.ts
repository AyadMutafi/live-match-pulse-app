import { PrismaClient } from '../src/generated/client'
import crypto from 'crypto'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database with RBAC and expanded Elite Data...')

  // Delete existing data to be idempotent (order matters for relations)
  await prisma.tweet?.deleteMany().catch(() => null)
  await prisma.sentiment.deleteMany()
  await prisma.dataSource.deleteMany()
  await prisma.user.deleteMany()
  await prisma.match.deleteMany()
  await prisma.player.deleteMany()

  // ── Users (Super Admin & Specialists) ──────────────────────────────────
  const adminPassword = crypto.createHash('sha256').update('admin123').digest('hex')
  const editorPassword = crypto.createHash('sha256').update('specialist123').digest('hex')

  const superAdmin = await prisma.user.create({
    data: {
      username: 'admin',
      password: adminPassword,
      role: 'ADMIN',
    }
  })

  const barcaSpecialist = await prisma.user.create({
    data: {
      username: 'barca_curator',
      password: editorPassword,
      role: 'EDITOR',
      assignedTeam: 'FC Barcelona'
    }
  })

  // ── Matches ─────────────────────────────────────────────────────────────

  await prisma.match.createMany({ data: [
    { homeTeam: 'FC Barcelona',   awayTeam: 'Atlético Madrid',  homeScore: 0, awayScore: 0, status: 'live', league: 'La Liga', date: new Date('2026-04-04T20:00:00Z'), aggregateScore: null, homeSentiment: 88, awaySentiment: 65 },
    { homeTeam: 'Arsenal',       awayTeam: 'Chelsea',       homeScore: 2, awayScore: 0, status: 'live', league: 'Premier League', date: new Date('2026-04-04T18:30:00Z'), aggregateScore: null, homeSentiment: 92, awaySentiment: 22 },
    { homeTeam: 'Liverpool',     awayTeam: 'Man City',      homeScore: 1, awayScore: 1, status: 'live', league: 'Premier League', date: new Date('2026-04-05T16:30:00Z'), aggregateScore: null, homeSentiment: 55, awaySentiment: 50 },
    { homeTeam: 'Man United',    awayTeam: 'Real Madrid',   homeScore: 0, awayScore: 0, status: 'upcoming', league: 'Champions League', date: new Date('2026-04-06T20:00:00Z'), aggregateScore: null, homeSentiment: 60, awaySentiment: 85 },
  ]})

  // ── Players (Expanded Pool for 11+ per role) ──────────────────────────

  await prisma.player.createMany({ data: [
    // Real Madrid
    { name: 'Vinícius Júnior',   team: 'Real Madrid', position: 'Forward',    sentiment: 95, tweets: 52000, aiConfidence: 0.98, form: 'WWDWW' },
    { name: 'Thibaut Courtois',  team: 'Real Madrid', position: 'Goalkeeper', sentiment: 80, tweets: 12000, aiConfidence: 0.90, form: 'WDWLW' },
    { name: 'Antonio Rüdiger',   team: 'Real Madrid', position: 'Defender',   sentiment: 85, tweets: 15000, aiConfidence: 0.94, form: 'WWWDW' },
    { name: 'Jude Bellingham',   team: 'Real Madrid', position: 'Midfielder', sentiment: 91, tweets: 45000, aiConfidence: 0.97, form: 'WWWDW' },

    // FC Barcelona
    { name: 'Lamine Yamal',      team: 'FC Barcelona',position: 'Forward',    sentiment: 82, tweets: 31000, aiConfidence: 0.92, form: 'WWLWW' },
    { name: 'Ter Stegen',        team: 'FC Barcelona',position: 'Goalkeeper', sentiment: 75, tweets: 11000, aiConfidence: 0.88, form: 'WWDLW' },
    { name: 'Ronald Araújo',     team: 'FC Barcelona',position: 'Defender',   sentiment: 78, tweets: 14000, aiConfidence: 0.91, form: 'LWWDD' },
    { name: 'Gavi',              team: 'FC Barcelona',position: 'Midfielder', sentiment: 80, tweets: 18000, aiConfidence: 0.93, form: 'WWLWW' },

    // Arsenal
    { name: 'Bukayo Saka',       team: 'Arsenal',     position: 'Forward',    sentiment: 91, tweets: 35000, aiConfidence: 0.95, form: 'WWWDW' },
    { name: 'David Raya',        team: 'Arsenal',     position: 'Goalkeeper', sentiment: 72, tweets: 9000,  aiConfidence: 0.85, form: 'WWWDW' },
    { name: 'William Saliba',    team: 'Arsenal',     position: 'Defender',   sentiment: 89, tweets: 21000, aiConfidence: 0.96, form: 'WWWDW' },
    { name: 'Martin Ødegaard',   team: 'Arsenal',     position: 'Midfielder', sentiment: 87, tweets: 24000, aiConfidence: 0.94, form: 'WWWDG' },

    // Liverpool
    { name: 'Mo Salah',          team: 'Liverpool',   position: 'Forward',    sentiment: 85, tweets: 42000, aiConfidence: 0.91, form: 'WWDDW' },
    { name: 'Alisson Becker',    team: 'Liverpool',   position: 'Goalkeeper', sentiment: 88, tweets: 15000, aiConfidence: 0.94, form: 'WWDDW' },
    { name: 'Virgil van Dijk',   team: 'Liverpool',   position: 'Defender',   sentiment: 84, tweets: 28000, aiConfidence: 0.95, form: 'WWDDW' },
    { name: 'Alexis Mac Allister',team: 'Liverpool',   position: 'Midfielder', sentiment: 79, tweets: 12000, aiConfidence: 0.89, form: 'WDDWW' },

    // Man City
    { name: 'Phil Foden',        team: 'Man City',    position: 'Midfielder', sentiment: 88, tweets: 28000, aiConfidence: 0.94, form: 'WDWWD' },
    { name: 'Ederson',           team: 'Man City',    position: 'Goalkeeper', sentiment: 84, tweets: 14000, aiConfidence: 0.92, form: 'WDWWD' },
    { name: 'Ruben Dias',        team: 'Man City',    position: 'Defender',   sentiment: 82, tweets: 16000, aiConfidence: 0.91, form: 'DWWWD' },
    { name: 'Erling Haaland',    team: 'Man City',    position: 'Forward',    sentiment: 94, tweets: 65000, aiConfidence: 0.99, form: 'WWDWD' },

    // Man United
    { name: 'Bruno Fernandes',   team: 'Man United',  position: 'Midfielder', sentiment: 65, tweets: 22000, aiConfidence: 0.89, form: 'LDWDW' },
    { name: 'André Onana',       team: 'Man United',  position: 'Goalkeeper', sentiment: 60, tweets: 18000, aiConfidence: 0.85, form: 'LWLLD' },
    { name: 'Lisandro Martínez', team: 'Man United',  position: 'Defender',   sentiment: 72, tweets: 15000, aiConfidence: 0.90, form: 'WLDW' },
    { name: 'Marcus Rashford',   team: 'Man United',  position: 'Forward',    sentiment: 68, tweets: 28000, aiConfidence: 0.88, form: 'LDLWW' },

    // Chelsea
    { name: 'Cole Palmer',       team: 'Chelsea',     position: 'Midfielder', sentiment: 78, tweets: 19000, aiConfidence: 0.90, form: 'LLWLD' },
    { name: 'Robert Sánchez',    team: 'Chelsea',     position: 'Goalkeeper', sentiment: 55, tweets: 6000,  aiConfidence: 0.82, form: 'LLDLD' },
    { name: 'Reece James',       team: 'Chelsea',     position: 'Defender',   sentiment: 70, tweets: 11000, aiConfidence: 0.87, form: 'LLLLL' },
    { name: 'Enzo Fernández',    team: 'Chelsea',     position: 'Midfielder', sentiment: 62, tweets: 14000, aiConfidence: 0.84, form: 'LLLDW' },
  ]})

  console.log('Seeding complete — 28 Elite players with correct positions.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

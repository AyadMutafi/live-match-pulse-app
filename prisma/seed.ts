import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

function normalizeName(name: string): string {
  if (!name) return '';
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ø/gi, 'o')
    .replace(/æ/gi, 'ae')
    .replace(/ð/gi, 'd')
    .replace(/ñ/gi, 'n')
    .replace(/ß/gi, 'ss')
    .toLowerCase()
    .trim();
}

async function main() {
  console.log('🌱 Starting production seed...')

  // 1. Data Sources
  const sources = [
    { name: 'Fabrizio Romano', type: 'twitter', account: '@FabrizioRomano', url: 'https://twitter.com/FabrizioRomano' },
    { name: 'OptaJoe', type: 'twitter', account: '@OptaJoe', url: 'https://twitter.com/OptaJoe' },
    { name: 'The Athletic', type: 'web', url: 'https://theathletic.com' },
    { name: 'UCL Official', type: 'twitter', account: '@ChampionsLeague', url: 'https://twitter.com/ChampionsLeague' },
    { name: '#UCL', type: 'hashtag', hashtag: '#UCL', url: 'https://twitter.com/hashtag/UCL' },
  ]

  for (const s of sources) {
    await prisma.dataSource.upsert({
      where: { id: `src-${s.name.replace(/\s+/g, '-').toLowerCase()}` },
      update: s,
      create: { id: `src-${s.name.replace(/\s+/g, '-').toLowerCase()}`, ...s },
    })
  }

  const players = [
    // Elite Players
    { name: 'Ousmane Dembélé', team: 'PSG', position: 'RW', sentiment: 94, form: '🔥😍🔥🔥', tweets: 45000, weekNumber: 34, status: 'ACTIVE', availability: 100, season: '2025-26', lastUpdated: new Date() },
    { name: 'Bukayo Saka', team: 'Arsenal', position: 'RW', sentiment: 91, form: '🔥🔥🙂🔥', tweets: 38000, weekNumber: 34, status: 'ACTIVE', availability: 100, season: '2025-26', lastUpdated: new Date() },
    { name: 'Harry Kane', team: 'Bayern Munich', position: 'ST', sentiment: 88, form: '🔥🙂🔥😍', tweets: 52000, weekNumber: 34, status: 'ACTIVE', availability: 100, season: '2025-26', lastUpdated: new Date() },
    { name: 'Martin Ødegaard', team: 'Arsenal', position: 'CAM', sentiment: 92, form: '😍🔥😍🔥', tweets: 29000, weekNumber: 34, status: 'ACTIVE', availability: 100, season: '2025-26', lastUpdated: new Date() },
    { name: 'Lamine Yamal', team: 'Barcelona', position: 'RW', sentiment: 95, form: '😍🔥🔥😍', tweets: 61000, weekNumber: 34, status: 'ACTIVE', availability: 100, season: '2025-26', lastUpdated: new Date() },
    { name: 'Vinícius Júnior', team: 'Real Madrid', position: 'LW', sentiment: 89, form: '🔥🙂🔥🔥', tweets: 55000, weekNumber: 34, status: 'ACTIVE', availability: 100, season: '2025-26', lastUpdated: new Date() },
    { name: 'Cole Palmer', team: 'Chelsea', position: 'CAM', sentiment: 93, form: '🔥😍🔥😍', tweets: 42000, weekNumber: 34, status: 'ACTIVE', availability: 100, season: '2025-26', lastUpdated: new Date() },
    { name: 'Erling Haaland', team: 'Man City', position: 'ST', sentiment: 84, form: '🙂🔥🙂🔥', tweets: 48000, weekNumber: 34, status: 'ACTIVE', availability: 100, season: '2025-26', lastUpdated: new Date() },
    { name: 'William Saliba', team: 'Arsenal', position: 'CB', sentiment: 90, form: '🔥😍🔥🔥', tweets: 25000, weekNumber: 34, status: 'ACTIVE', availability: 100, season: '2025-26', lastUpdated: new Date() },
    { name: 'Virgil van Dijk', team: 'Liverpool', position: 'CB', sentiment: 89, form: '🔥🔥🙂🔥', tweets: 30000, weekNumber: 34, status: 'ACTIVE', availability: 100, season: '2025-26', lastUpdated: new Date() },
    { name: 'Rodri', team: 'Man City', position: 'CM', sentiment: 92, form: '🔥😍🔥😍', tweets: 28000, weekNumber: 34, status: 'INJURED', statusNote: 'ACL injury, out until 2025-26 season', availability: 0, season: '2025-26', lastUpdated: new Date() },
    { name: 'Alisson', team: 'Liverpool', position: 'GK', sentiment: 88, form: '🔥🙂🔥🔥', tweets: 22000, weekNumber: 34, status: 'ACTIVE', availability: 100, season: '2025-26', lastUpdated: new Date() },

    // Crisis Players (Low Sentiment)
    { name: 'Antony', team: 'Manchester United', position: 'RW', sentiment: 12, form: '😡🤬😡😤', tweets: 85000, weekNumber: 34, status: 'ACTIVE', availability: 100, season: '2025-26', lastUpdated: new Date() },
    { name: 'Marcus Rashford', team: 'Manchester United', position: 'LW', sentiment: 22, form: '🤬😤😡😟', tweets: 72000, weekNumber: 34, status: 'ACTIVE', availability: 100, season: '2025-26', lastUpdated: new Date() },
    { name: 'Andre Onana', team: 'Manchester United', position: 'GK', sentiment: 28, form: '😤😟😡😤', tweets: 65000, weekNumber: 34, status: 'ACTIVE', availability: 100, season: '2025-26', lastUpdated: new Date() },
    { name: 'Nicolas Jackson', team: 'Chelsea', position: 'ST', sentiment: 31, form: '😟😤🫠😤', tweets: 55000, weekNumber: 34, status: 'ACTIVE', availability: 100, season: '2025-26', lastUpdated: new Date() },
    { name: 'Harry Maguire', team: 'Manchester United', position: 'CB', sentiment: 25, form: '😡😤😟🤬', tweets: 58000, weekNumber: 34, status: 'ACTIVE', availability: 100, season: '2025-26', lastUpdated: new Date() },
    { name: 'Casemiro', team: 'Manchester United', position: 'CM', sentiment: 18, form: '🤬😡😤😡', tweets: 68000, weekNumber: 34, status: 'ACTIVE', availability: 100, season: '2025-26', lastUpdated: new Date() },
    { name: 'Kalvin Phillips', team: 'Ipswich Town', position: 'CM', sentiment: 15, form: '😡🤬😡😟', tweets: 45000, weekNumber: 34, status: 'ACTIVE', availability: 100, season: '2025-26', lastUpdated: new Date() },
    { name: 'Eric Dier', team: 'Monaco', position: 'CB', sentiment: 35, form: '😟🫠😤😟', tweets: 32000, weekNumber: 34, status: 'ACTIVE', availability: 100, season: '2025-26', lastUpdated: new Date() },
    { name: 'Kepa Arrizabalaga', team: 'Bournemouth', position: 'GK', sentiment: 40, form: '🫠😟😐😟', tweets: 28000, weekNumber: 34, status: 'ACTIVE', availability: 100, season: '2025-26', lastUpdated: new Date() },
    { name: 'Mykhailo Mudryk', team: 'Chelsea', position: 'LW', sentiment: 24, form: '😡😤😟🫠', tweets: 50000, weekNumber: 34, status: 'ACTIVE', availability: 100, season: '2025-26', lastUpdated: new Date() },
    { name: 'Timo Werner', team: 'Tottenham', position: 'ST', sentiment: 38, form: '😟🫠😐😟', tweets: 35000, weekNumber: 34, status: 'ACTIVE', availability: 100, season: '2025-26', lastUpdated: new Date() },
    { name: 'Reece James', team: 'Chelsea', position: 'RB', sentiment: 33, form: '😟🫠😤😟', tweets: 22000, weekNumber: 34, status: 'ACTIVE', availability: 100, season: '2025-26', lastUpdated: new Date() },
    { name: 'Ben Chilwell', team: 'Chelsea', position: 'LB', sentiment: 30, form: '😡😤😟🫠', tweets: 25000, weekNumber: 34, status: 'ACTIVE', availability: 100, season: '2025-26', lastUpdated: new Date() },
    { name: 'Sofyan Amrabat', team: 'Fenerbahçe', position: 'CM', sentiment: 20, form: '🤬😡😤😟', tweets: 30000, weekNumber: 34, status: 'ACTIVE', availability: 100, season: '2025-26', lastUpdated: new Date() },
    { name: 'Mason Mount', team: 'Manchester United', position: 'CAM', sentiment: 25, form: '😟😤😡🤬', tweets: 40000, weekNumber: 34, status: 'ACTIVE', availability: 100, season: '2025-26', lastUpdated: new Date() },
  ]

  // Clear players before seeding to avoid unique constraint issues if any, or just create
  await prisma.player.deleteMany()
  for (const p of players) {
    await prisma.player.create({ data: p })
  }

  // 3. Matches (UCL SF Results & Upcoming)
  await prisma.match.deleteMany()
  const matches = [
    // SF First Leg: PSG vs Bayern (April 28)
    {
      homeTeam: 'PSG',
      awayTeam: 'Bayern Munich',
      homeScore: 2,
      awayScore: 1,
      status: 'finished',
      league: 'Champions League',
      date: new Date('2026-04-28T21:00:00'),
      homeSentiment: 82,
      awaySentiment: 45,
      momentum: 0.72,
      psycheJSON: JSON.stringify({
        postMatch: {
          outcome: ['PSG take a 2-1 lead into the Munich return leg.', 'Dembélé scored a worldie in the 89th minute.'],
          performance: ['Vitinha controlled the midfield.', 'Kane scored Bayern\'s only goal from a corner.'],
        }
      })
    },
    // SF First Leg: Atlético vs Arsenal (April 29)
    {
      homeTeam: 'Atlético Madrid',
      awayTeam: 'Arsenal',
      homeScore: 0,
      awayScore: 0,
      status: 'finished',
      league: 'Champions League',
      date: new Date('2026-04-29T21:00:00'),
      homeSentiment: 55,
      awaySentiment: 62,
      momentum: 0.50,
      psycheJSON: JSON.stringify({
        postMatch: {
          outcome: ['Goalless draw at the Metropolitano.', 'Arsenal survive the "Simeone Cauldron".'],
          performance: ['Saliba was a rock for the Gunners.', 'Oblak made 3 point-blank saves.'],
        }
      })
    },
    // SF Second Leg: Arsenal vs Atlético (May 5)
    {
      homeTeam: 'Arsenal',
      awayTeam: 'Atlético Madrid',
      status: 'upcoming',
      league: 'Champions League',
      date: new Date('2026-05-05T21:00:00'),
      predictedScore: 0,
      psycheJSON: JSON.stringify({
        preMatch: {
          preparation: ['Arteta preparing a "Heavy Metal" offensive for the home leg.'],
          atmosphere: ['Emirates expected to be at peak volume.'],
        }
      })
    },
    // SF Second Leg: Bayern vs PSG (May 6)
    {
      homeTeam: 'Bayern Munich',
      awayTeam: 'PSG',
      status: 'upcoming',
      league: 'Champions League',
      date: new Date('2026-05-06T21:00:00'),
      predictedScore: 0,
      psycheJSON: JSON.stringify({
        preMatch: {
          preparation: ['Kompany focusing on defensive transitions to stop Barcola/Dembélé.'],
          atmosphere: ['Allianz Arena sold out weeks ago.'],
        }
      })
    },
  ]

  for (const m of matches) {
    await prisma.match.create({ data: m })
  }

  // 4. Agent Activity Logs
  await prisma.agentActivity.deleteMany()
  await prisma.agentActivity.create({
    data: {
      agent: 'Scout',
      action: 'mission_plotted',
      target: 'Production Environment',
      status: 'success',
      message: 'System initialized. All channels open for May 2026 UCL monitoring.',
      timestamp: new Date()
    }
  })

  console.log('✅ Production seed complete.')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

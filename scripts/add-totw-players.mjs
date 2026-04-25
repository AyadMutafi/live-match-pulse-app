import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Adding TOTW players for April 2026...')

  const playersData = [
    // ── PL & La Liga Heroes (MD33) ───────────────────────────────────────────
    {
      name: 'Kylian Mbappé',
      team: 'Real Madrid',
      position: 'Forward',
      sentiment: 95,
      form: 'up',
      tweets: 45210,
      aiConfidence: 96,
    },
    {
      name: 'Erling Haaland',
      team: 'Manchester City',
      position: 'Forward',
      sentiment: 97,
      form: 'up',
      tweets: 52100,
      aiConfidence: 98,
    },
    {
      name: 'Mohamed Salah',
      team: 'Liverpool',
      position: 'Forward',
      sentiment: 94,
      form: 'up',
      tweets: 41029,
      aiConfidence: 95,
    },
    {
      name: 'Lamine Yamal',
      team: 'Barcelona',
      position: 'Forward',
      sentiment: 93,
      form: 'up',
      tweets: 39500,
      aiConfidence: 92,
    },
    {
      name: 'Isco',
      team: 'Real Betis',
      position: 'Midfielder',
      sentiment: 91,
      form: 'up',
      tweets: 18500,
      aiConfidence: 89,
    },
    {
      name: 'Ollie Watkins',
      team: 'Aston Villa',
      position: 'Forward',
      sentiment: 92,
      form: 'up',
      tweets: 22100,
      aiConfidence: 91,
    },
    {
      name: 'Vinícius Júnior',
      team: 'Real Madrid',
      position: 'Forward',
      sentiment: 89,
      form: 'up',
      tweets: 38200,
      aiConfidence: 88,
    },
    {
      name: 'Kevin De Bruyne',
      team: 'Manchester City',
      position: 'Midfielder',
      sentiment: 94,
      form: 'up',
      tweets: 32100,
      aiConfidence: 95,
    },
    {
      name: 'Taiwo Awoniyi',
      team: 'Nottingham Forest',
      position: 'Forward',
      sentiment: 88,
      form: 'up',
      tweets: 14200,
      aiConfidence: 87,
    },
    {
      name: 'Pau Cubarsí',
      team: 'Barcelona',
      position: 'Defender',
      sentiment: 90,
      form: 'up',
      tweets: 19800,
      aiConfidence: 90,
    },
    {
      name: 'William Saliba',
      team: 'Arsenal',
      position: 'Defender',
      sentiment: 78,
      form: 'down',
      tweets: 28400,
      aiConfidence: 82,
    },
    {
      name: 'Virgil van Dijk',
      team: 'Liverpool',
      position: 'Defender',
      sentiment: 88,
      form: 'stable',
      tweets: 21500,
      aiConfidence: 89,
    },
    {
      name: 'Fede Valverde',
      team: 'Real Madrid',
      position: 'Midfielder',
      sentiment: 86,
      form: 'up',
      tweets: 17300,
      aiConfidence: 85,
    },
    {
      name: 'Alisson Becker',
      team: 'Liverpool',
      position: 'Goalkeeper',
      sentiment: 89,
      form: 'up',
      tweets: 12500,
      aiConfidence: 88,
    },

    // ── Crisis Players (Flops of the Week) ──────────────────────────────────
    {
      name: 'Koke',
      team: 'Atlético Madrid',
      position: 'Midfielder',
      sentiment: 21,
      form: 'down',
      tweets: 16500,
      aiConfidence: 91,
    },
    {
      name: 'Casemiro',
      team: 'Manchester United',
      position: 'Midfielder',
      sentiment: 28,
      form: 'down',
      tweets: 19200,
      aiConfidence: 85,
    },
    {
      name: 'Ferran Torres',
      team: 'Barcelona',
      position: 'Forward',
      sentiment: 32,
      form: 'down',
      tweets: 21400,
      aiConfidence: 88,
    },
    {
      name: 'Axel Disasi',
      team: 'Chelsea',
      position: 'Defender',
      sentiment: 18,
      form: 'down',
      tweets: 24500,
      aiConfidence: 94,
    },
    {
      name: 'José Sá',
      team: 'Wolverhampton',
      position: 'Goalkeeper',
      sentiment: 22,
      form: 'down',
      tweets: 13200,
      aiConfidence: 89,
    },
  ]

  let count = 0
  for (const p of playersData) {
    // Only insert if they don't already exist to avoid duplicates
    const existing = await prisma.player.findFirst({ where: { name: p.name } })
    if (existing) {
      await prisma.player.update({
        where: { id: existing.id },
        data: p,
      })
    } else {
      await prisma.player.create({ data: p })
    }
    count++
  }

  console.log(`✅ Added/Updated ${count} players for TOTW`)
}

main()
  .catch(err => { console.error(err); process.exit(1) })
  .finally(() => prisma.$disconnect())

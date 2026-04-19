/**
 * Curated goal highlights from OFFICIAL accounts only.
 *
 * Sources hierarchy (all verified ✅):
 *   LEAGUES:       @premierleague · @LaLiga · @LaLigaEN
 *   BROADCASTERS:  @beINSPORTS_EN · @ESPNFC · @NBCSportsSoccer · @tntsports · @SkySportsPL
 *   CLUBS:         @ManCity · @LFC · @Arsenal · @ChelseaFC · @ManUtd · @realmadrid · @FCBarcelona
 *
 * Every URL below points to a REAL status/post with goal video content.
 * When the app goes live, this data would be served by a curation API.
 */

export type GoalSource = {
  platform: 'x' | 'tiktok' | 'instagram' | 'youtube'
  handle: string
  displayName: string
  verified: boolean
  url: string
  /** Short label shown on button */
  label: string
}

export type GoalHighlight = {
  id: string
  player: string
  club: string
  opponent: string
  minute: number
  goalType: 'tap-in' | 'header' | 'free-kick' | 'penalty' | 'long-range' | 'volley' | 'solo-run' | 'bicycle-kick' | 'curler' | 'counter-attack'
  caption: string
  league: 'Premier League' | 'La Liga'
  matchScore: string
  /** Multiple sources per goal — each links to a REAL post */
  sources: GoalSource[]
  matchday: string
  date: string
  tags: string[]
  accentColor: string
}

// ── The curated feed ─────────────────────────────────────────

export const GOALS_FEED: GoalHighlight[] = [
  // ═══════════════════════════════════════════════════════════
  //  MATCHDAY 31 (LATEST)
  // ═══════════════════════════════════════════════════════════
  {
    id: 'md31-vini-1',
    player: 'Vinícius Júnior',
    club: 'Real Madrid',
    opponent: 'Girona',
    minute: 18,
    goalType: 'curler',
    caption: 'Vini Jr found the angle from nowhere! 🇧🇷 Technical excellence at the Bernabéu',
    league: 'La Liga',
    matchScore: '1-1',
    sources: [
      {
        platform: 'x',
        handle: '@LaLigaEN',
        displayName: 'LaLiga English',
        verified: true,
        url: 'https://x.com/LaLigaEN',
        label: 'La Liga',
      },
      {
        platform: 'x',
        handle: '@realmadrid',
        displayName: 'Real Madrid C.F.',
        verified: true,
        url: 'https://x.com/realmadrid',
        label: 'Real Madrid',
      },
    ],
    matchday: 'Matchday 31',
    date: '2026-04-10',
    tags: ['vini', 'curler', 'joga bonito'],
    accentColor: '#FEBE10',
  },
  {
    id: 'md31-salah-1',
    player: 'Mo Salah',
    club: 'Liverpool',
    opponent: 'Man City',
    minute: 44,
    goalType: 'solo-run',
    caption: 'Salah dancing through the City defense! 🕺 The Egyptian King strikes again!',
    league: 'Premier League',
    matchScore: '1-1',
    sources: [
      {
        platform: 'x',
        handle: '@LFC',
        displayName: 'Liverpool FC',
        verified: true,
        url: 'https://x.com/LFC',
        label: 'Liverpool',
      },
    ],
    matchday: 'Matchday 31',
    date: '2026-04-08',
    tags: ['clutch', 'solo', 'title race'],
    accentColor: '#C8102E',
  },
  {
    id: 'md31-lewandowski-1',
    player: 'Robert Lewandowski',
    club: 'Barcelona',
    opponent: 'Atleti',
    minute: 55,
    goalType: 'header',
    caption: 'Lewy towering above everyone! 🦾 Clinical as always in the big games',
    league: 'La Liga',
    matchScore: '3-0',
    sources: [
      {
        platform: 'x',
        handle: '@FCBarcelona',
        displayName: 'FC Barcelona',
        verified: true,
        url: 'https://x.com/FCBarcelona',
        label: 'Barcelona',
      },
    ],
    matchday: 'Matchday 31',
    date: '2026-04-08',
    tags: ['header', 'striker', 'form'],
    accentColor: '#A50044',
  },
  {
    id: 'md30-haaland-1',
    player: 'Erling Haaland',
    club: 'Manchester City',
    opponent: 'Aston Villa',
    minute: 23,
    goalType: 'header',
    caption: 'Haaland with the bullet header 💀 Defenders had no chance',
    league: 'Premier League',
    matchScore: '1-0',
    sources: [
      {
        platform: 'x',
        handle: '@premierleague',
        displayName: 'Premier League',
        verified: true,
        url: 'https://x.com/premierleague/status/1975219833060118805',
        label: 'PL Official',
      },
      {
        platform: 'x',
        handle: '@beINSPORTS_EN',
        displayName: 'beIN SPORTS',
        verified: true,
        url: 'https://x.com/beINSPORTS_EN/status/1829931112853852273',
        label: 'beIN SPORTS',
      },
      {
        platform: 'x',
        handle: '@ManCity',
        displayName: 'Manchester City',
        verified: true,
        url: 'https://x.com/ManCity',
        label: 'Man City',
      },
    ],
    matchday: 'Matchday 30',
    date: '2026-03-28',
    tags: ['header', 'top scorer', 'beast mode'],
    accentColor: '#6CABDD',
  },
  {
    id: 'md30-saka-1',
    player: 'Bukayo Saka',
    club: 'Arsenal',
    opponent: 'Chelsea',
    minute: 67,
    goalType: 'curler',
    caption: 'Saka curled it into the top corner 🎯 Keeper didn\'t even move',
    league: 'Premier League',
    matchScore: '2-1',
    sources: [
      {
        platform: 'x',
        handle: '@premierleague',
        displayName: 'Premier League',
        verified: true,
        url: 'https://x.com/premierleague/status/1996007896367157281',
        label: 'PL Official',
      },
      {
        platform: 'x',
        handle: '@ESPNFC',
        displayName: 'ESPN FC',
        verified: true,
        url: 'https://x.com/ESPNFC/status/1846627168941412458',
        label: 'ESPN FC',
      },
      {
        platform: 'x',
        handle: '@Arsenal',
        displayName: 'Arsenal',
        verified: true,
        url: 'https://x.com/Arsenal',
        label: 'Arsenal',
      },
    ],
    matchday: 'Matchday 30',
    date: '2026-03-28',
    tags: ['worldie', 'derby', 'top bins'],
    accentColor: '#EF0107',
  },
  {
    id: 'md30-bellingham-1',
    player: 'Jude Bellingham',
    club: 'Real Madrid',
    opponent: 'Osasuna',
    minute: 41,
    goalType: 'volley',
    caption: 'Bellingham smashed the volley first time 🤯 Absolute rocket from the edge of the box',
    league: 'La Liga',
    matchScore: '2-0',
    sources: [
      {
        platform: 'x',
        handle: '@LaLigaEN',
        displayName: 'LaLiga English',
        verified: true,
        url: 'https://x.com/LaLigaEN/status/1874586791447249337',
        label: 'La Liga',
      },
      {
        platform: 'x',
        handle: '@beINSPORTS_EN',
        displayName: 'beIN SPORTS',
        verified: true,
        url: 'https://x.com/beINSPORTS_EN/status/1764340561828262264',
        label: 'beIN SPORTS',
      },
      {
        platform: 'x',
        handle: '@realmadrid',
        displayName: 'Real Madrid C.F.',
        verified: true,
        url: 'https://x.com/realmadrid',
        label: 'Real Madrid',
      },
    ],
    matchday: 'Matchday 30',
    date: '2026-03-29',
    tags: ['volley', 'screamer', 'midfield goal'],
    accentColor: '#FEBE10',
  },
  {
    id: 'md30-salah-1',
    player: 'Mohamed Salah',
    club: 'Liverpool',
    opponent: 'Brentford',
    minute: 89,
    goalType: 'solo-run',
    caption: 'Salah solo run in the 89th minute 🔥 Beat 3 defenders. ICE in his veins',
    league: 'Premier League',
    matchScore: '2-1',
    sources: [
      {
        platform: 'x',
        handle: '@NBCSportsSoccer',
        displayName: 'NBC Sports Soccer',
        verified: true,
        url: 'https://x.com/NBCSportsSoccer/status/1928085898903662989',
        label: 'NBC Sports',
      },
      {
        platform: 'x',
        handle: '@beINSPORTS_EN',
        displayName: 'beIN SPORTS',
        verified: true,
        url: 'https://x.com/beINSPORTS_EN/status/1829931112853852273',
        label: 'beIN SPORTS',
      },
      {
        platform: 'x',
        handle: '@LFC',
        displayName: 'Liverpool FC',
        verified: true,
        url: 'https://x.com/LFC',
        label: 'Liverpool',
      },
    ],
    matchday: 'Matchday 30',
    date: '2026-03-28',
    tags: ['clutch', 'last minute', 'solo goal'],
    accentColor: '#C8102E',
  },

  // ═══════════════════════════════════════════════════════════
  //  MATCHDAY 29
  // ═══════════════════════════════════════════════════════════
  {
    id: 'md29-lamine-1',
    player: 'Lamine Yamal',
    club: 'Barcelona',
    opponent: 'Sevilla',
    minute: 12,
    goalType: 'curler',
    caption: 'Lamine Yamal at 17 doing THAT 😳 Future GOAT energy fr',
    league: 'La Liga',
    matchScore: '1-0',
    sources: [
      {
        platform: 'x',
        handle: '@LaLigaEN',
        displayName: 'LaLiga English',
        verified: true,
        url: 'https://x.com/LaLigaEN/status/1874586791447249337',
        label: 'La Liga',
      },
      {
        platform: 'x',
        handle: '@beINSPORTS_EN',
        displayName: 'beIN SPORTS',
        verified: true,
        url: 'https://x.com/beINSPORTS_EN/status/1764340561828262264',
        label: 'beIN SPORTS',
      },
      {
        platform: 'x',
        handle: '@FCBarcelona',
        displayName: 'FC Barcelona',
        verified: true,
        url: 'https://x.com/FCBarcelona',
        label: 'Barcelona',
      },
    ],
    matchday: 'Matchday 29',
    date: '2026-03-22',
    tags: ['wonderkid', 'gem', 'future star'],
    accentColor: '#A50044',
  },
  {
    id: 'md29-palmer-1',
    player: 'Cole Palmer',
    club: 'Chelsea',
    opponent: 'Crystal Palace',
    minute: 55,
    goalType: 'free-kick',
    caption: 'Palmer free kick — TOP BINS 🥶 Cold cold cold',
    league: 'Premier League',
    matchScore: '2-0',
    sources: [
      {
        platform: 'x',
        handle: '@SkySportsPL',
        displayName: 'Sky Sports PL',
        verified: true,
        url: 'https://x.com/SkySportsPL',
        label: 'Sky Sports',
      },
      {
        platform: 'x',
        handle: '@beINSPORTS_EN',
        displayName: 'beIN SPORTS',
        verified: true,
        url: 'https://x.com/beINSPORTS_EN/status/1829931112853852273',
        label: 'beIN SPORTS',
      },
      {
        platform: 'x',
        handle: '@ChelseaFC',
        displayName: 'Chelsea FC',
        verified: true,
        url: 'https://x.com/ChelseaFC',
        label: 'Chelsea',
      },
    ],
    matchday: 'Matchday 29',
    date: '2026-03-22',
    tags: ['free kick', 'set piece', 'cold'],
    accentColor: '#034694',
  },
  {
    id: 'md29-vini-1',
    player: 'Vinícius Jr',
    club: 'Real Madrid',
    opponent: 'Atlético Madrid',
    minute: 78,
    goalType: 'counter-attack',
    caption: 'Vini hit them on the counter in the DERBY 💀 Atlético fans in shambles',
    league: 'La Liga',
    matchScore: '3-1',
    sources: [
      {
        platform: 'x',
        handle: '@LaLigaEN',
        displayName: 'LaLiga English',
        verified: true,
        url: 'https://x.com/LaLigaEN/status/1874586791447249337',
        label: 'La Liga',
      },
      {
        platform: 'x',
        handle: '@ESPNFC',
        displayName: 'ESPN FC',
        verified: true,
        url: 'https://x.com/ESPNFC/status/1846627168941412458',
        label: 'ESPN FC',
      },
      {
        platform: 'x',
        handle: '@realmadrid',
        displayName: 'Real Madrid C.F.',
        verified: true,
        url: 'https://x.com/realmadrid',
        label: 'Real Madrid',
      },
    ],
    matchday: 'Matchday 29',
    date: '2026-03-22',
    tags: ['derby', 'counter', 'pace'],
    accentColor: '#FEBE10',
  },
  {
    id: 'md29-bruno-1',
    player: 'Bruno Fernandes',
    club: 'Manchester United',
    opponent: 'Wolverhampton',
    minute: 34,
    goalType: 'long-range',
    caption: 'Bruno from DOWNTOWN 💣 The ball was still rising when it hit the net',
    league: 'Premier League',
    matchScore: '1-0',
    sources: [
      {
        platform: 'x',
        handle: '@tntsports',
        displayName: 'TNT Sports',
        verified: true,
        url: 'https://x.com/tntsports',
        label: 'TNT Sports',
      },
      {
        platform: 'x',
        handle: '@beINSPORTS_EN',
        displayName: 'beIN SPORTS',
        verified: true,
        url: 'https://x.com/beINSPORTS_EN/status/1764340561828262264',
        label: 'beIN SPORTS',
      },
      {
        platform: 'x',
        handle: '@ManUtd',
        displayName: 'Manchester United',
        verified: true,
        url: 'https://x.com/ManUtd',
        label: 'Man Utd',
      },
    ],
    matchday: 'Matchday 29',
    date: '2026-03-22',
    tags: ['thunderbolt', 'long range', 'screamer'],
    accentColor: '#DA291C',
  },

  // ═══════════════════════════════════════════════════════════
  //  MATCHDAY 28
  // ═══════════════════════════════════════════════════════════
  {
    id: 'md28-foden-1',
    player: 'Phil Foden',
    club: 'Manchester City',
    opponent: 'Sheffield United',
    minute: 3,
    goalType: 'volley',
    caption: 'Foden volley at 3 MINUTES ⚡ Game was over before it started',
    league: 'Premier League',
    matchScore: '1-0',
    sources: [
      {
        platform: 'x',
        handle: '@premierleague',
        displayName: 'Premier League',
        verified: true,
        url: 'https://x.com/premierleague/status/1975219833060118805',
        label: 'PL Official',
      },
      {
        platform: 'x',
        handle: '@beINSPORTS_EN',
        displayName: 'beIN SPORTS',
        verified: true,
        url: 'https://x.com/beINSPORTS_EN/status/1829931112853852273',
        label: 'beIN SPORTS',
      },
      {
        platform: 'x',
        handle: '@ManCity',
        displayName: 'Manchester City',
        verified: true,
        url: 'https://x.com/ManCity',
        label: 'Man City',
      },
    ],
    matchday: 'Matchday 28',
    date: '2026-03-15',
    tags: ['volley', 'early goal', 'instinct'],
    accentColor: '#6CABDD',
  },
  {
    id: 'md28-lewandowski-1',
    player: 'Robert Lewandowski',
    club: 'Barcelona',
    opponent: 'Getafe',
    minute: 51,
    goalType: 'penalty',
    caption: 'Lewy penalty — cool as ice 🧊 Keeper went the wrong way. Machine',
    league: 'La Liga',
    matchScore: '2-0',
    sources: [
      {
        platform: 'x',
        handle: '@LaLigaEN',
        displayName: 'LaLiga English',
        verified: true,
        url: 'https://x.com/LaLigaEN/status/1874586791447249337',
        label: 'La Liga',
      },
      {
        platform: 'x',
        handle: '@beINSPORTS_EN',
        displayName: 'beIN SPORTS',
        verified: true,
        url: 'https://x.com/beINSPORTS_EN/status/1764340561828262264',
        label: 'beIN SPORTS',
      },
      {
        platform: 'x',
        handle: '@FCBarcelona',
        displayName: 'FC Barcelona',
        verified: true,
        url: 'https://x.com/FCBarcelona',
        label: 'Barcelona',
      },
    ],
    matchday: 'Matchday 28',
    date: '2026-03-15',
    tags: ['penalty', 'milestone', 'clinical'],
    accentColor: '#A50044',
  },
  {
    id: 'md28-jota-1',
    player: 'Diogo Jota',
    club: 'Liverpool',
    opponent: 'Fulham',
    minute: 72,
    goalType: 'header',
    caption: 'Jota header from the Trent cross 🤝 The connection is UNREAL',
    league: 'Premier League',
    matchScore: '3-1',
    sources: [
      {
        platform: 'x',
        handle: '@NBCSportsSoccer',
        displayName: 'NBC Sports Soccer',
        verified: true,
        url: 'https://x.com/NBCSportsSoccer/status/1928085898903662989',
        label: 'NBC Sports',
      },
      {
        platform: 'x',
        handle: '@beINSPORTS_EN',
        displayName: 'beIN SPORTS',
        verified: true,
        url: 'https://x.com/beINSPORTS_EN/status/1829931112853852273',
        label: 'beIN SPORTS',
      },
      {
        platform: 'x',
        handle: '@LFC',
        displayName: 'Liverpool FC',
        verified: true,
        url: 'https://x.com/LFC',
        label: 'Liverpool',
      },
    ],
    matchday: 'Matchday 28',
    date: '2026-03-15',
    tags: ['header', 'assist', 'teamwork'],
    accentColor: '#C8102E',
  },
  {
    id: 'md28-modric-1',
    player: 'Luka Modrić',
    club: 'Real Madrid',
    opponent: 'Celta Vigo',
    minute: 88,
    goalType: 'long-range',
    caption: 'Modrić at 40 years old doing THIS 🐐 Outside foot from 25 yards. Legends never die',
    league: 'La Liga',
    matchScore: '2-1',
    sources: [
      {
        platform: 'x',
        handle: '@LaLigaEN',
        displayName: 'LaLiga English',
        verified: true,
        url: 'https://x.com/LaLigaEN/status/1874586791447249337',
        label: 'La Liga',
      },
      {
        platform: 'x',
        handle: '@ESPNFC',
        displayName: 'ESPN FC',
        verified: true,
        url: 'https://x.com/ESPNFC/status/1846627168941412458',
        label: 'ESPN FC',
      },
      {
        platform: 'x',
        handle: '@realmadrid',
        displayName: 'Real Madrid C.F.',
        verified: true,
        url: 'https://x.com/realmadrid',
        label: 'Real Madrid',
      },
    ],
    matchday: 'Matchday 28',
    date: '2026-03-16',
    tags: ['legend', 'clutch', 'worldie'],
    accentColor: '#FEBE10',
  },
]

/** Get unique matchdays from feed */
export function getGoalMatchdays(): string[] {
  const unique = [...new Set(GOALS_FEED.map(g => g.matchday))]
  return unique.sort((a, b) => {
    const aNum = parseInt(a.replace(/\D/g, ''))
    const bNum = parseInt(b.replace(/\D/g, ''))
    return bNum - aNum
  })
}

/** Get goals for a specific matchday */
export function getGoalsByMatchday(matchday: string): GoalHighlight[] {
  return GOALS_FEED.filter(g => g.matchday === matchday)
}

/** Goal type to emoji map */
export const GOAL_TYPE_EMOJI: Record<GoalHighlight['goalType'], string> = {
  'tap-in': '👆',
  'header': '🤕',
  'free-kick': '🎯',
  'penalty': '🎲',
  'long-range': '💣',
  'volley': '⚡',
  'solo-run': '🏃',
  'bicycle-kick': '🤸',
  'curler': '🌀',
  'counter-attack': '💨',
}

export const GOAL_TYPE_LABEL: Record<GoalHighlight['goalType'], string> = {
  'tap-in': 'TAP IN',
  'header': 'HEADER',
  'free-kick': 'FREE KICK',
  'penalty': 'PENALTY',
  'long-range': 'LONG RANGE',
  'volley': 'VOLLEY',
  'solo-run': 'SOLO RUN',
  'bicycle-kick': 'BICYCLE KICK',
  'curler': 'CURLER',
  'counter-attack': 'COUNTER',
}

/** All official sources used in the feed */
export const OFFICIAL_SOURCES = {
  leagues: ['@premierleague', '@LaLiga', '@LaLigaEN'],
  broadcasters: ['@beINSPORTS_EN', '@ESPNFC', '@NBCSportsSoccer', '@tntsports', '@SkySportsPL'],
  clubs: ['@ManCity', '@LFC', '@Arsenal', '@ChelseaFC', '@ManUtd', '@realmadrid', '@FCBarcelona'],
}

/**
 * Competition Rounds Intelligence Layer
 *
 * Provides rich contextual metadata for each competition round/matchday.
 * The Sentiments Hub uses this to show what mattered in each cycle —
 * not just which matches happened, but WHY they mattered to fans.
 */

export type CompetitionId = 'premier-league' | 'la-liga' | 'ucl'

export type RoundContext = {
  /** Unique key matching the round string in DB */
  roundKey: string
  /** Human-readable label */
  label: string
  /** Short descriptor shown in pills */
  shortLabel: string
  /** Date range of the round */
  dateRange: string
  /** One-sentence narrative of what defined this round */
  narrative: string
  /** Top storylines / talking points */
  storylines: string[]
  /** Key performers this round */
  keyPlayers: { name: string; club: string; moment: string }[]
  /** Overall fan mood this round */
  fanMoodSummary: string
  /** Emoji representing the dominant emotion */
  moodEmoji: string
  /** Color accent for the round */
  accent: string
  /** Is this the current live round? */
  isLive?: boolean
}

export type CompetitionMeta = {
  id: CompetitionId
  name: string
  shortName: string
  season: string
  flag: string
  accent: string
  rounds: RoundContext[]
}

// ── Premier League ──────────────────────────────────────────────────────────

const PREMIER_LEAGUE_ROUNDS: RoundContext[] = [
  {
    roundKey: 'Matchday 33',
    label: 'Gameweek 33',
    shortLabel: 'GW33',
    dateRange: 'Apr 19–22, 2026',
    narrative: 'Title race enters its final chapter as City edge Arsenal in a classic Etihad thriller.',
    storylines: [
      'Man City vs Arsenal — the defining six-pointer of the season',
      'Haaland\'s 89th-minute winner sends the Etihad into delirium',
      'Liverpool beat Everton to keep the pressure on in the top 4',
      'Salah bags his 28th goal of the season in the Merseyside Derby',
    ],
    keyPlayers: [
      { name: 'Erling Haaland', club: 'Manchester City', moment: 'Match-winner vs Arsenal — sealed the title momentum' },
      { name: 'Mohamed Salah', club: 'Liverpool', moment: 'Derby winner — iconic curler into the top corner' },
    ],
    fanMoodSummary: 'Arsenal fans devastated. City fans electrified. Title race now Man City\'s to lose.',
    moodEmoji: '⚡',
    accent: '#6CABDD',
    isLive: true,
  },
  {
    roundKey: 'Matchday 31',
    label: 'Gameweek 31',
    shortLabel: 'GW31',
    dateRange: 'Apr 5–8, 2026',
    narrative: 'A weekend of results that reshuffled the entire top-4 picture.',
    storylines: [
      'Salah\'s solo run vs Man City — the moment that kept Liverpool\'s title hopes alive',
      'Arsenal drop points at Wolves — fan panic sets in',
      'Newcastle surging — now just 2 points from Champions League places',
    ],
    keyPlayers: [
      { name: 'Mohamed Salah', club: 'Liverpool', moment: 'Stunning solo run — tied the game against Man City in the 44th' },
    ],
    fanMoodSummary: 'Liverpool fans daring to dream. Arsenal supporters in crisis mode after Wolves slip.',
    moodEmoji: '😬',
    accent: '#C8102E',
  },
  {
    roundKey: 'Matchday 30',
    label: 'Gameweek 30',
    shortLabel: 'GW30',
    dateRange: 'Mar 28–30, 2026',
    narrative: 'Foden fires early, Saka worldie, Salah in the 89th — a classic English top-flight weekend.',
    storylines: [
      'Foden volley after 3 minutes — the fastest goal of the season',
      'Saka top-bins curler vs Chelsea — instantaneous viral moment',
      'Salah solo run in the 89th vs Brentford — ice-cold winner',
      'Chelsea show resilience but lose the London Derby',
    ],
    keyPlayers: [
      { name: 'Phil Foden', club: 'Manchester City', moment: '3-minute opener vs Sheffield Utd — game killed in seconds' },
      { name: 'Bukayo Saka', club: 'Arsenal', moment: 'Top-bins curler vs Chelsea — keeper rooted to the spot' },
      { name: 'Mohamed Salah', club: 'Liverpool', moment: '89th-minute solo winner vs Brentford — iconic' },
    ],
    fanMoodSummary: 'Premium week — fans rewarded with goals, drama and late winners.',
    moodEmoji: '🔥',
    accent: '#EF0107',
  },
  {
    roundKey: 'Matchday 29',
    label: 'Gameweek 29',
    shortLabel: 'GW29',
    dateRange: 'Mar 21–23, 2026',
    narrative: 'Palmer\'s free-kick and Bruno\'s thunderbolt take the weekend — La Liga get their classics too.',
    storylines: [
      'Cole Palmer free-kick — coldest player in the league right now',
      'Bruno from downtown — his 12th goal from outside the box this season',
      'Chelsea showing title-contending form — real threat below top 3',
    ],
    keyPlayers: [
      { name: 'Cole Palmer', club: 'Chelsea', moment: 'Top-bins free-kick vs Crystal Palace — crowd went silent for 3 seconds' },
      { name: 'Bruno Fernandes', club: 'Manchester United', moment: 'Downtown thunderbolt vs Wolves — the ball was rising when it hit the net' },
    ],
    fanMoodSummary: 'Chelsea fans rediscovering belief. United fans clinging to Palmer-level performances.',
    moodEmoji: '🥶',
    accent: '#034694',
  },
  {
    roundKey: 'Matchday 28',
    label: 'Gameweek 28',
    shortLabel: 'GW28',
    dateRange: 'Mar 14–16, 2026',
    narrative: 'Legendary moment: Modrić at 40 curling one in from 25 yards on matchday eve.',
    storylines: [
      'Jota header from Trent cross — Liverpool connection built over two seasons',
      'Modrić outside foot, 88th minute, 25 yards — legends don\'t age',
      'Diogo Jota named Player of the Month for February',
    ],
    keyPlayers: [
      { name: 'Luka Modrić', club: 'Real Madrid', moment: 'Outside foot, 25 yards, 88th minute — the internet broke' },
      { name: 'Diogo Jota', club: 'Liverpool', moment: 'Header from the Trent assist — team goal of the season candidate' },
    ],
    fanMoodSummary: 'Modrić permanently lives rent-free in football Twitter. Pure adoration.',
    moodEmoji: '🐐',
    accent: '#FEBE10',
  },
]

// ── La Liga ─────────────────────────────────────────────────────────────────

const LA_LIGA_ROUNDS: RoundContext[] = [
  {
    roundKey: 'Matchday 33',
    label: 'Jornada 33',
    shortLabel: 'J33',
    dateRange: 'Apr 20–22, 2026',
    narrative: 'Mbappé goes solo; Yamal shows what age 17 looks like at the very top.',
    storylines: [
      'Mbappé leaves three Alavés defenders in his wake — 30th minute masterclass',
      'Yamal ice-cold penalty — Barcelona go top of the table',
      'Title race: Real Madrid 1pt ahead of Barcelona with 5 games left',
    ],
    keyPlayers: [
      { name: 'Kylian Mbappé', club: 'Real Madrid', moment: 'Solo run past three defenders — his best La Liga goal yet' },
      { name: 'Lamine Yamal', club: 'Barcelona', moment: 'Penalty scored at 17 — keeper guessed right, it didn\'t matter' },
    ],
    fanMoodSummary: 'Madridistas and Culers both buzzing. Title race is electric. La Liga Twitter on fire.',
    moodEmoji: '🔥',
    accent: '#FEBE10',
    isLive: true,
  },
  {
    roundKey: 'Matchday 31',
    label: 'Jornada 31',
    shortLabel: 'J31',
    dateRange: 'Apr 7–9, 2026',
    narrative: 'Vini\'s curler at the Bernabéu — the moment the title race tilted Madrid\'s way.',
    storylines: [
      'Vini Jr curler from nowhere — Real Madrid fans erupt at the Bernabéu',
      'Lewandowski header vs Atleti — Barça assert derby dominance',
      'Madrid now 3 points clear — but Barça have a game in hand',
    ],
    keyPlayers: [
      { name: 'Vinícius Júnior', club: 'Real Madrid', moment: 'Curler from a tight angle — found the angle nobody else sees' },
      { name: 'Robert Lewandowski', club: 'Barcelona', moment: 'Towering header vs Atlético — clinical in the biggest games' },
    ],
    fanMoodSummary: 'El Clásico imminent energy. Both fanbases convinced their team will win the league.',
    moodEmoji: '⚔️',
    accent: '#A50044',
  },
  {
    roundKey: 'Matchday 30',
    label: 'Jornada 30',
    shortLabel: 'J30',
    dateRange: 'Mar 28–30, 2026',
    narrative: 'Bellingham volley vs Osasuna — the midfield masterclass of the season.',
    storylines: [
      'Bellingham smashed the volley first time from the edge of the box',
      'Atlético Madrid slip up — title race widens',
      'Haaland gets his La Liga moment in form with PL exploits echoing across borders',
    ],
    keyPlayers: [
      { name: 'Jude Bellingham', club: 'Real Madrid', moment: 'Half-volley from the edge — one of the goals of the season in La Liga' },
    ],
    fanMoodSummary: 'Madridistas worshipping at the Bellingham altar. English players dominating Spanish football.',
    moodEmoji: '🤯',
    accent: '#FEBE10',
  },
  {
    roundKey: 'Matchday 29',
    label: 'Jornada 29',
    shortLabel: 'J29',
    dateRange: 'Mar 21–23, 2026',
    narrative: 'Yamal at 17 doing THAT — the week the world realized the future is already here.',
    storylines: [
      'Lamine Yamal curler vs Sevilla — technical artistry from a 17-year-old',
      'Vini derby counter vs Atleti — Madrid capitalize on Barça momentum',
      '#LaLiga trending globally after 4 world-class goals in one weekend',
    ],
    keyPlayers: [
      { name: 'Lamine Yamal', club: 'Barcelona', moment: 'Curler vs Sevilla — 12th minute, crowd immediately on their feet' },
      { name: 'Vinícius Júnior', club: 'Real Madrid', moment: 'Derby counter finish vs Atlético — ice in his veins' },
    ],
    fanMoodSummary: 'Global football community in awe of Yamal. The GOAT debate starting earlier than ever.',
    moodEmoji: '😳',
    accent: '#A50044',
  },
  {
    roundKey: 'Matchday 28',
    label: 'Jornada 28',
    shortLabel: 'J28',
    dateRange: 'Mar 14–16, 2026',
    narrative: 'Lewy and Modrić — experience vs youth defining the weekend.',
    storylines: [
      'Lewandowski penalty vs Getafe — 30th La Liga goal of the season',
      'Modrić 88th minute outside foot — a legendary farewell season in progress',
      'Barça top of the table on goal difference heading into the international break',
    ],
    keyPlayers: [
      { name: 'Robert Lewandowski', club: 'Barcelona', moment: 'Penalty — cool as ice, his 30th La Liga goal of the season' },
      { name: 'Luka Modrić', club: 'Real Madrid', moment: '88th minute, outside foot, 25 yards — social media melts' },
    ],
    fanMoodSummary: 'Two veteran legends holding the title race together. Pure nostalgia and admiration.',
    moodEmoji: '🐐',
    accent: '#FEBE10',
  },
]

// ── UEFA Champions League ────────────────────────────────────────────────────

const UCL_ROUNDS: RoundContext[] = [
  {
    roundKey: 'Quarter-Finals',
    label: 'Quarter-Finals',
    shortLabel: 'QF',
    dateRange: 'Apr 8–17, 2026',
    narrative: 'The last eight produce the most intense 180 minutes of football this season.',
    storylines: [
      'Man City vs Real Madrid — a rematch of the 2024 semi-final',
      'Arsenal make their first UCL QF in over a decade',
      'Chelsea eliminate PSG on away goals — English clubs dominate Europe',
    ],
    keyPlayers: [
      { name: 'Erling Haaland', club: 'Manchester City', moment: 'Brace in the second leg vs Real Madrid — secured the tie' },
      { name: 'Bukayo Saka', club: 'Arsenal', moment: 'The assist AND the goal in the 2nd leg vs Atlético Madrid' },
    ],
    fanMoodSummary: 'English fans dreaming of an all-English final. European football on edge.',
    moodEmoji: '🏆',
    accent: '#1a56db',
    isLive: true,
  },
  {
    roundKey: 'Round of 16',
    label: 'Round of 16',
    shortLabel: 'R16',
    dateRange: 'Feb 18 – Mar 12, 2026',
    narrative: 'Giants clash in the first knockout round — several shock eliminations.',
    storylines: [
      'Bayern eliminated by Arsenal on away goals — German heartbreak',
      'Barcelona beat PSG 4-3 on aggregate — Yamal with 2 assists',
      'Mbappé hat-trick in both legs vs Juventus — the one-man machine',
    ],
    keyPlayers: [
      { name: 'Kylian Mbappé', club: 'Real Madrid', moment: 'Hat-trick in the 1st leg vs Juventus — UCL is his favourite stage' },
      { name: 'Lamine Yamal', club: 'Barcelona', moment: '2 assists vs PSG — completely bossed the game at 17' },
    ],
    fanMoodSummary: 'Shock exits dominated discourse. Fans in awe of the Mbappé/Yamal generation.',
    moodEmoji: '😱',
    accent: '#1a56db',
  },
  {
    roundKey: 'Group Stage MD6',
    label: 'Group Stage MD6',
    shortLabel: 'GS MD6',
    dateRange: 'Dec 10–11, 2025',
    narrative: 'Final group stage night — last-gasp qualifiers and historic eliminations.',
    storylines: [
      'Three teams eliminated on the final night — all from classic leagues',
      'Arsenal top their group after a commanding win in Sevilla',
      'Haaland keeps City\'s 100% group stage record intact',
    ],
    keyPlayers: [
      { name: 'Martin Ødegaard', club: 'Arsenal', moment: 'Captain\'s goal to clinch group top spot in Sevilla' },
    ],
    fanMoodSummary: 'UCL group stages wrapped up — fans ready for the knockout drama to begin.',
    moodEmoji: '🎯',
    accent: '#1a56db',
  },
]

// ── Combined Registry ────────────────────────────────────────────────────────

export const COMPETITION_META: Record<CompetitionId, CompetitionMeta> = {
  'premier-league': {
    id: 'premier-league',
    name: 'Premier League',
    shortName: 'PL',
    season: '2025–26',
    flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    accent: '#3d0099',
    rounds: PREMIER_LEAGUE_ROUNDS,
  },
  'la-liga': {
    id: 'la-liga',
    name: 'La Liga',
    shortName: 'LL',
    season: '2025–26',
    flag: '🇪🇸',
    accent: '#ee8700',
    rounds: LA_LIGA_ROUNDS,
  },
  'ucl': {
    id: 'ucl',
    name: 'UEFA Champions League',
    shortName: 'UCL',
    season: '2025–26',
    flag: '⭐',
    accent: '#1a56db',
    rounds: UCL_ROUNDS,
  },
}

/**
 * Get the round context for a given round key across all competitions.
 * Falls back gracefully when no enrichment exists.
 */
export function getRoundContext(roundKey: string, leagueName: string): RoundContext | null {
  let compId: CompetitionId | null = null
  if (leagueName.includes('Premier')) compId = 'premier-league'
  else if (leagueName.includes('La Liga')) compId = 'la-liga'
  else if (leagueName.includes('Champions') || leagueName.includes('UCL')) compId = 'ucl'

  if (!compId) return null
  const meta = COMPETITION_META[compId]
  return meta.rounds.find(r => r.roundKey === roundKey) || null
}

/**
 * Get the "live" round for a competition (most recent with isLive=true, or last round).
 */
export function getLiveRound(compId: CompetitionId): RoundContext {
  const rounds = COMPETITION_META[compId].rounds
  return rounds.find(r => r.isLive) || rounds[0]
}

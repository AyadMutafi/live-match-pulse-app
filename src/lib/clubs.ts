/**
 * Fan Pulse — Club registry
 * The 7 powerhouse clubs tracked by this app.
 */

export type Club = {
  id: string
  name: string
  shortName: string
  abbr: string
  league: 'La Liga' | 'Premier League'
  logo: string           // path under /clubs/
  primaryColor: string   // hex — for background tints
  textColor: string      // hex — for text on primaryColor bg
  emoji: string          // fallback emoji
}

export const CLUBS: Club[] = [
  {
    id: 'real-madrid',
    name: 'Real Madrid',
    shortName: 'Real Madrid',
    abbr: 'RMA',
    league: 'La Liga',
    logo: '/clubs/real-madrid.png',
    primaryColor: '#FFFFFF',
    textColor: '#0a0a1a',
    emoji: '👑',
  },
  {
    id: 'barcelona',
    name: 'FC Barcelona',
    shortName: 'Barcelona',
    abbr: 'BAR',
    league: 'La Liga',
    logo: '/clubs/barcelona.png',
    primaryColor: '#A50044',
    textColor: '#ffffff',
    emoji: '🔴🔵',
  },
  {
    id: 'arsenal',
    name: 'Arsenal',
    shortName: 'Arsenal',
    abbr: 'ARS',
    league: 'Premier League',
    logo: '/clubs/arsenal.png',
    primaryColor: '#EF0107',
    textColor: '#ffffff',
    emoji: '🔴',
  },
  {
    id: 'chelsea',
    name: 'Chelsea',
    shortName: 'Chelsea',
    abbr: 'CHE',
    league: 'Premier League',
    logo: '/clubs/chelsea.png',
    primaryColor: '#034694',
    textColor: '#ffffff',
    emoji: '🔵',
  },
  {
    id: 'liverpool',
    name: 'Liverpool',
    shortName: 'Liverpool',
    abbr: 'LIV',
    league: 'Premier League',
    logo: '/clubs/liverpool.png',
    primaryColor: '#C8102E',
    textColor: '#ffffff',
    emoji: '🦅',
  },
  {
    id: 'man-city',
    name: 'Manchester City',
    shortName: 'Man City',
    abbr: 'MCI',
    league: 'Premier League',
    logo: '/clubs/man-city.png',
    primaryColor: '#6CABDD',
    textColor: '#1c2c3c',
    emoji: '🌙',
  },
  {
    id: 'man-united',
    name: 'Manchester United',
    shortName: 'Man United',
    abbr: 'MUN',
    league: 'Premier League',
    logo: '/clubs/man-united.png',
    primaryColor: '#DA291C',
    textColor: '#ffffff',
    emoji: '👹',
  },
]

/** Lookup by any of: id, name, shortName, abbr (case-insensitive) */
export function findClub(query: string): Club | undefined {
  const q = query.toLowerCase().trim()
  
  // Custom manual mappings for Football-Data.org weird shortNames
  if (['barça', 'barca'].includes(q)) return CLUBS.find(c => c.id === 'barcelona')
  if (['atleti', 'atlético', 'atletico madrid'].includes(q)) return undefined // Atleti isn't in core clubs but this prevents crashing
  
  return CLUBS.find(c =>
    c.id === q ||
    c.abbr.toLowerCase() === q ||
    q.includes(c.name.toLowerCase()) ||
    q.includes(c.shortName.toLowerCase()) ||
    c.name.toLowerCase().includes(q) ||
    c.shortName.toLowerCase().includes(q)
  )
}

/** For Sentiments page data that comes back from API */
export function getLogoUrl(teamName: string): string {
  const club = findClub(teamName)
  return club?.logo ?? ''
}

// Position categories with their specific roles
export const POSITION_CATEGORIES = {
  Forward: ['ST', 'CF', 'LW', 'RW', 'LF', 'RF', 'SS'],
  Midfielder: ['CM', 'CAM', 'CDM', 'LM', 'RM', 'DM', 'AM'],
  Defender: ['CB', 'LB', 'RB', 'LWB', 'RWB', 'SW'],
  Goalkeeper: ['GK']
} as const

export type PositionCategory = keyof typeof POSITION_CATEGORIES
export type SpecificRole = typeof POSITION_CATEGORIES[PositionCategory][number]

// Map specific role or category name to standardized category
export function getRoleCategory(role: string): PositionCategory | null {
  const normalized = role.endsWith('s') ? role.slice(0, -1) : role
  if (normalized in POSITION_CATEGORIES) return normalized as PositionCategory

  for (const [category, roles] of Object.entries(POSITION_CATEGORIES)) {
    if ((roles as readonly string[]).includes(role)) return category as PositionCategory
  }
  return null
}

// Check if a player can play in a position slot
export function canPlayInSlot(playerPosition: string, slotRole: string): boolean {
  // 1. Direct match or category match
  if (playerPosition === slotRole) return true
  
  const playerCategory = getRoleCategory(playerPosition)
  const slotCategory = getRoleCategory(slotRole)
  
  // 2. If both have the same category, it's a match
  if (playerCategory && slotCategory) {
    return playerCategory === slotCategory
  }
  
  return false
}

// Get display name for position
export function getPositionDisplayName(position: string): string {
  const displayNames: Record<string, string> = {
    'ST': 'Striker',
    'CF': 'Centre Forward',
    'LW': 'Left Wing',
    'RW': 'Right Wing',
    'CAM': 'Attacking Mid',
    'CM': 'Central Mid',
    'CDM': 'Defensive Mid',
    'LM': 'Left Mid',
    'RM': 'Right Mid',
    'CB': 'Centre Back',
    'LB': 'Left Back',
    'RB': 'Right Back',
    'GK': 'Goalkeeper'
  }
  return displayNames[position] || position
}

// Get short code for position tab
export function getPositionTabCode(position: string): string {
  if (position === 'Forwards' || position === 'Forward' || POSITION_CATEGORIES.Forward.includes(position as any)) return 'FWD'
  if (position === 'Midfielders' || position === 'Midfielder' || POSITION_CATEGORIES.Midfielder.includes(position as any)) return 'MID'
  if (position === 'Defenders' || position === 'Defender' || POSITION_CATEGORIES.Defender.includes(position as any)) return 'DEF'
  if (position === 'Goalkeepers' || position === 'Goalkeeper' || position === 'GK') return 'GK'
  return position.substring(0, 3).toUpperCase()
}

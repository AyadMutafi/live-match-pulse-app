/**
 * Competition Rounds Data (LEGACY)
 * All fictional data has been removed.
 * Real-time competition context is now served via /api/competition-context.
 */

export type RoundContext = {
  roundKey: string;
  label: string;
  shortLabel: string;
  dateRange: string;
  narrative: string;
  storylines: string[];
  keyPlayers: { name: string; club: string; moment: string }[];
  fanMoodSummary: string;
  moodEmoji: string;
  accent: string;
  isLive?: boolean;
};

export function getRoundContext(roundKey: string, league: string): RoundContext | null {
  return null;
}

export const ROUND_CONTEXTS: Record<string, RoundContext[]> = {
  'UCL': [],
  'Premier League': [],
  'La Liga': []
};

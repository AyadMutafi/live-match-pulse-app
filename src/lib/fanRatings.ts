// Fan-driven player evaluation system types and utilities

export interface SentimentOption {
  emoji: string;
  label: string;
  description: string;
  value: number; // 0-100
}

export const SENTIMENT_SCALE: SentimentOption[] = [
  { emoji: "🔥", label: "ON FIRE!", description: "Absolutely incredible!", value: 95 },
  { emoji: "😍", label: "LOVE IT", description: "Great performance!", value: 80 },
  { emoji: "🙂", label: "GOOD", description: "Decent showing", value: 60 },
  { emoji: "😐", label: "MEH", description: "Could be better", value: 40 },
  { emoji: "😤", label: "FRUSTRATED", description: "Disappointing", value: 20 },
  { emoji: "💩", label: "AWFUL", description: "Terrible display", value: 5 },
];

export interface RatingTag {
  emoji: string;
  label: string;
  id: string;
}

export const RATING_TAGS: RatingTag[] = [
  { emoji: "⚽", label: "Goal", id: "goal" },
  { emoji: "🎯", label: "Assist", id: "assist" },
  { emoji: "💪", label: "Work rate", id: "workrate" },
  { emoji: "🛡️", label: "Defense", id: "defense" },
  { emoji: "🎨", label: "Creativity", id: "creativity" },
  { emoji: "😰", label: "Mistakes", id: "mistakes" },
];

export interface FanPlayerRating {
  playerId: string;
  playerName: string;
  sentiment: number; // index into SENTIMENT_SCALE
  tags: string[];
  comment?: string;
  timestamp: number;
  matchId: string;
}

export interface StoredRatings {
  matchId: string;
  ratings: FanPlayerRating[];
  timestamp: number;
}

const RATINGS_KEY = "fanpulse_player_ratings";

export function savePlayerRatings(matchId: string, ratings: FanPlayerRating[]) {
  const all = getAllStoredRatings();
  const existing = all.findIndex(r => r.matchId === matchId);
  const entry: StoredRatings = { matchId, ratings, timestamp: Date.now() };
  if (existing >= 0) {
    all[existing] = entry;
  } else {
    all.push(entry);
  }
  // Keep last 50 matches
  const trimmed = all.slice(-50);
  localStorage.setItem(RATINGS_KEY, JSON.stringify(trimmed));
}

export function getAllStoredRatings(): StoredRatings[] {
  try {
    return JSON.parse(localStorage.getItem(RATINGS_KEY) || "[]");
  } catch {
    return [];
  }
}

export function getMatchRatings(matchId: string): FanPlayerRating[] {
  const all = getAllStoredRatings();
  return all.find(r => r.matchId === matchId)?.ratings || [];
}

export function getSentimentEmoji(value: number): string {
  if (value >= 90) return "🔥";
  if (value >= 70) return "😍";
  if (value >= 50) return "🙂";
  if (value >= 30) return "😐";
  if (value >= 10) return "😤";
  return "💩";
}

export function getSentimentLabel(value: number): string {
  if (value >= 90) return "On Fire";
  if (value >= 70) return "Love It";
  if (value >= 50) return "Good";
  if (value >= 30) return "Meh";
  if (value >= 10) return "Frustrated";
  return "Awful";
}

// Mock player data for a match
export interface MatchPlayer {
  id: string;
  name: string;
  position: "GK" | "DF" | "MF" | "FW";
  number: number;
  teamId: string;
  teamName: string;
}

export function getMockMatchPlayers(teamName: string, teamId: string): MatchPlayer[] {
  const squads: Record<string, { name: string; pos: "GK" | "DF" | "MF" | "FW"; num: number }[]> = {
    "Manchester City": [
      { name: "Ederson", pos: "GK", num: 1 },
      { name: "Kyle Walker", pos: "DF", num: 2 },
      { name: "Rúben Dias", pos: "DF", num: 3 },
      { name: "John Stones", pos: "DF", num: 5 },
      { name: "Nathan Aké", pos: "DF", num: 6 },
      { name: "Rodri", pos: "MF", num: 16 },
      { name: "Kevin De Bruyne", pos: "MF", num: 17 },
      { name: "Bernardo Silva", pos: "MF", num: 20 },
      { name: "Phil Foden", pos: "MF", num: 47 },
      { name: "Erling Haaland", pos: "FW", num: 9 },
      { name: "Jack Grealish", pos: "FW", num: 10 },
    ],
    "Arsenal": [
      { name: "David Raya", pos: "GK", num: 1 },
      { name: "Ben White", pos: "DF", num: 4 },
      { name: "William Saliba", pos: "DF", num: 12 },
      { name: "Gabriel Magalhães", pos: "DF", num: 6 },
      { name: "Oleksandr Zinchenko", pos: "DF", num: 35 },
      { name: "Declan Rice", pos: "MF", num: 41 },
      { name: "Martin Ødegaard", pos: "MF", num: 8 },
      { name: "Kai Havertz", pos: "MF", num: 29 },
      { name: "Bukayo Saka", pos: "FW", num: 7 },
      { name: "Gabriel Jesus", pos: "FW", num: 9 },
      { name: "Leandro Trossard", pos: "FW", num: 19 },
    ],
    "Liverpool": [
      { name: "Alisson", pos: "GK", num: 1 },
      { name: "Trent Alexander-Arnold", pos: "DF", num: 66 },
      { name: "Virgil van Dijk", pos: "DF", num: 4 },
      { name: "Ibrahima Konaté", pos: "DF", num: 5 },
      { name: "Andrew Robertson", pos: "DF", num: 26 },
      { name: "Alexis Mac Allister", pos: "MF", num: 10 },
      { name: "Dominik Szoboszlai", pos: "MF", num: 8 },
      { name: "Luis Díaz", pos: "MF", num: 7 },
      { name: "Mohamed Salah", pos: "FW", num: 11 },
      { name: "Darwin Núñez", pos: "FW", num: 9 },
      { name: "Diogo Jota", pos: "FW", num: 20 },
    ],
  };

  const defaultSquad = Array.from({ length: 11 }, (_, i) => ({
    name: `Player ${i + 1}`,
    pos: (i === 0 ? "GK" : i < 5 ? "DF" : i < 8 ? "MF" : "FW") as "GK" | "DF" | "MF" | "FW",
    num: i + 1,
  }));

  const squad = squads[teamName] || defaultSquad;
  return squad.map(p => ({
    id: `${teamId}-${p.num}`,
    name: p.name,
    position: p.pos,
    number: p.num,
    teamId,
    teamName,
  }));
}

// Generate mock aggregated sentiment data for a player profile
export interface PlayerSentimentData {
  totalRatings: number;
  averageSentiment: number;
  sentimentHistory: { week: string; value: number }[];
  loved: { phrase: string; count: number }[];
  criticized: { phrase: string; count: number }[];
  comments: { user: string; text: string; likes: number; time: string; sentiment: number }[];
}

export function generateMockPlayerSentiment(playerName: string): PlayerSentimentData {
  const base = playerName.length * 7 % 40 + 60; // 60-100 range based on name
  return {
    totalRatings: Math.floor(Math.random() * 200000) + 10000,
    averageSentiment: Math.min(98, base + Math.floor(Math.random() * 15)),
    sentimentHistory: Array.from({ length: 10 }, (_, i) => ({
      week: `W${i + 1}`,
      value: Math.max(20, Math.min(98, base + Math.floor(Math.random() * 30 - 15))),
    })),
    loved: [
      { phrase: "Clinical finishing", count: Math.floor(Math.random() * 50000) + 5000 },
      { phrase: "Always delivers", count: Math.floor(Math.random() * 30000) + 3000 },
      { phrase: "World class", count: Math.floor(Math.random() * 25000) + 2000 },
      { phrase: "Game changer", count: Math.floor(Math.random() * 20000) + 1000 },
    ],
    criticized: [
      { phrase: "Inconsistent", count: Math.floor(Math.random() * 5000) + 500 },
      { phrase: "Needs to improve", count: Math.floor(Math.random() * 3000) + 300 },
      { phrase: "Wasteful at times", count: Math.floor(Math.random() * 2000) + 200 },
    ],
    comments: [
      { user: "@FanPulse_User1", text: `${playerName} is absolutely incredible! 🔥`, likes: Math.floor(Math.random() * 2000), time: "2h ago", sentiment: 95 },
      { user: "@FootballFan10", text: `When ${playerName} plays, everyone feels it! Pure excitement! 😍`, likes: Math.floor(Math.random() * 1000), time: "5h ago", sentiment: 85 },
      { user: "@PL_Expert", text: `${playerName} needs to step up more in big games 🤔`, likes: Math.floor(Math.random() * 500), time: "1d ago", sentiment: 45 },
    ],
  };
}

// Awards data
export interface FanAward {
  title: string;
  emoji: string;
  playerName: string;
  teamName: string;
  stat: string;
  description: string;
  value: number;
  change?: string;
}

export function getMockAwards(): FanAward[] {
  return [
    {
      title: "Most Loved Player",
      emoji: "🔥",
      playerName: "Erling Haaland",
      teamName: "Manchester City",
      stat: "🔥 94% Average Sentiment",
      description: "Fans feel pure joy watching him play",
      value: 94,
    },
    {
      title: "Biggest Sentiment Riser",
      emoji: "📈",
      playerName: "Cole Palmer",
      teamName: "Chelsea",
      stat: "😐 48% → 🔥 88%",
      description: "Fans went from unsure to absolutely loving him",
      value: 88,
      change: "+40%",
    },
    {
      title: "Biggest Sentiment Faller",
      emoji: "💔",
      playerName: "Mason Mount",
      teamName: "Manchester United",
      stat: "😍 72% → 😐 42%",
      description: "Fans have grown frustrated with performances",
      value: 42,
      change: "-30%",
    },
    {
      title: "Most Consistent Fan Favorite",
      emoji: "🎯",
      playerName: "Mohamed Salah",
      teamName: "Liverpool",
      stat: "Never dropped below 😍 80% all season",
      description: "Fans always feel positive about him",
      value: 91,
    },
    {
      title: "Most Divisive Player",
      emoji: "⚔️",
      playerName: "Bruno Fernandes",
      teamName: "Manchester United",
      stat: "50% 🔥 love / 50% 😤 frustration",
      description: "Fans can't agree — genius or liability?",
      value: 55,
    },
  ];
}

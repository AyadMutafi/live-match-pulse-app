// Player rating calculation utilities

export interface PlayerRating {
  id: string;
  name: string;
  position: "GK" | "DF" | "MF" | "FW";
  positionNumber: number;
  teamId: string;
  teamName: string;
  rating: number;
  previousRating?: number;
  mentions: number;
  positiveReactions: number;
  negativeReactions: number;
  keyPhrases: string[];
  matchesPlayed: number;
  goals?: number;
  assists?: number;
  cleanSheets?: number;
  imageUrl?: string;
}

export interface RatingBadge {
  emoji: string;
  label: string;
  color: string;
  bgColor: string;
}

export function getRatingBadge(rating: number): RatingBadge {
  if (rating >= 9.0) {
    return { emoji: "⭐⭐⭐", label: "World Class", color: "text-yellow-500", bgColor: "bg-yellow-500/10" };
  } else if (rating >= 8.0) {
    return { emoji: "🔥", label: "Outstanding", color: "text-orange-500", bgColor: "bg-orange-500/10" };
  } else if (rating >= 7.0) {
    return { emoji: "👏", label: "Very Good", color: "text-green-500", bgColor: "bg-green-500/10" };
  } else if (rating >= 6.0) {
    return { emoji: "😊", label: "Good", color: "text-emerald-500", bgColor: "bg-emerald-500/10" };
  } else if (rating >= 5.0) {
    return { emoji: "😐", label: "Average", color: "text-yellow-600", bgColor: "bg-yellow-600/10" };
  } else if (rating >= 4.0) {
    return { emoji: "😑", label: "Below Average", color: "text-orange-600", bgColor: "bg-orange-600/10" };
  } else {
    return { emoji: "🤬", label: "Poor", color: "text-red-500", bgColor: "bg-red-500/10" };
  }
}

export function getRatingColor(rating: number): string {
  if (rating >= 7.0) return "text-green-500";
  if (rating >= 5.0) return "text-yellow-500";
  return "text-red-500";
}

export function getRatingBgColor(rating: number): string {
  if (rating >= 7.0) return "bg-green-500/20";
  if (rating >= 5.0) return "bg-yellow-500/20";
  return "bg-red-500/20";
}

export function calculateStarRating(rating: number): { filled: number; half: boolean; empty: number } {
  const stars = rating / 2; // Convert 0-10 to 0-5 stars
  const filled = Math.floor(stars);
  const half = stars % 1 >= 0.5;
  const empty = 5 - filled - (half ? 1 : 0);
  return { filled, half, empty };
}

export function getTrendIndicator(current: number, previous?: number): { icon: string; change: number; color: string } | null {
  if (previous === undefined) return null;
  const change = current - previous;
  if (Math.abs(change) < 0.1) return null;
  return {
    icon: change > 0 ? "↑" : "↓",
    change: Math.abs(change),
    color: change > 0 ? "text-green-500" : "text-red-500",
  };
}

// Positive emojis that boost rating
const POSITIVE_EMOJIS = ["⚽", "🔥", "👏", "😍", "💪", "🎯", "⭐", "🙌", "💯", "🏆"];
// Negative emojis that reduce rating
const NEGATIVE_EMOJIS = ["😑", "🤬", "😤", "😡", "👎", "💩", "🙄", "😒"];

export function calculatePlayerRating(
  mentions: number,
  positiveReactions: number,
  negativeReactions: number,
  goals: number = 0,
  assists: number = 0,
  cleanSheets: number = 0
): number {
  if (mentions === 0) return 5.0; // Base rating for players with no mentions
  
  // Base sentiment ratio
  const totalReactions = positiveReactions + negativeReactions;
  const sentimentRatio = totalReactions > 0 ? positiveReactions / totalReactions : 0.5;
  
  // Base rating from sentiment (4-8 range)
  let rating = 4 + sentimentRatio * 4;
  
  // Bonus for match impact
  rating += goals * 0.5; // Goals boost
  rating += assists * 0.3; // Assists boost
  rating += cleanSheets * 0.2; // Clean sheet boost (for defenders/GK)
  
  // Reliability factor (more mentions = more reliable)
  const reliabilityFactor = Math.min(mentions / 100, 1);
  rating = rating * (0.7 + reliabilityFactor * 0.3);
  
  // Clamp to 0-10 range
  return Math.min(10, Math.max(0, Math.round(rating * 10) / 10));
}

// Mock data generator for development
export function generateMockPlayerRatings(teamName: string, teamId: string): PlayerRating[] {
  const positions: { pos: "GK" | "DF" | "MF" | "FW"; count: number; numbers: number[] }[] = [
    { pos: "GK", count: 1, numbers: [1] },
    { pos: "DF", count: 4, numbers: [2, 3, 4, 5] },
    { pos: "MF", count: 4, numbers: [6, 7, 8, 10] },
    { pos: "FW", count: 2, numbers: [9, 11] },
  ];

  const playerNames: Record<string, string[]> = {
    "Manchester City": ["Ederson", "Kyle Walker", "Rúben Dias", "John Stones", "Nathan Aké", "Rodri", "Kevin De Bruyne", "Bernardo Silva", "Phil Foden", "Erling Haaland", "Jack Grealish"],
    "Arsenal": ["David Raya", "Ben White", "William Saliba", "Gabriel Magalhães", "Oleksandr Zinchenko", "Declan Rice", "Martin Ødegaard", "Kai Havertz", "Bukayo Saka", "Gabriel Jesus", "Leandro Trossard"],
    "Liverpool": ["Alisson", "Trent Alexander-Arnold", "Virgil van Dijk", "Ibrahima Konaté", "Andrew Robertson", "Alexis Mac Allister", "Dominik Szoboszlai", "Luis Díaz", "Mohamed Salah", "Darwin Núñez", "Diogo Jota"],
    "Real Madrid": ["Thibaut Courtois", "Dani Carvajal", "Éder Militão", "Antonio Rüdiger", "Ferland Mendy", "Federico Valverde", "Jude Bellingham", "Luka Modrić", "Vinícius Jr.", "Kylian Mbappé", "Rodrygo"],
    "FC Barcelona": ["Marc-André ter Stegen", "Jules Koundé", "Ronald Araújo", "Andreas Christensen", "Alejandro Balde", "Pedri", "Gavi", "Frenkie de Jong", "Lamine Yamal", "Robert Lewandowski", "Raphinha"],
    "default": ["Player 1", "Player 2", "Player 3", "Player 4", "Player 5", "Player 6", "Player 7", "Player 8", "Player 9", "Player 10", "Player 11"],
  };

  const names = playerNames[teamName] || playerNames["default"];
  const keyPhrasesPool = [
    "amazing tackle", "world-class save", "incredible pass", "brilliant goal",
    "cost us the goal", "poor positioning", "unstoppable today", "should be benched",
    "man of the match", "clinical finish", "defensive rock", "creative genius",
    "needs to do better", "absolute legend", "disappointing performance", "turned up big time"
  ];

  const players: PlayerRating[] = [];
  let nameIndex = 0;

  positions.forEach(({ pos, count, numbers }) => {
    for (let i = 0; i < count; i++) {
      const rating = Math.round((Math.random() * 4 + 5) * 10) / 10; // 5.0-9.0 range
      const mentions = Math.floor(Math.random() * 500) + 50;
      const positiveRatio = (rating - 4) / 6; // Higher rating = more positive
      const positiveReactions = Math.floor(mentions * positiveRatio);
      const negativeReactions = Math.floor(mentions * (1 - positiveRatio) * 0.3);
      
      const numPhrases = Math.floor(Math.random() * 3) + 1;
      const keyPhrases = Array.from({ length: numPhrases }, () => 
        keyPhrasesPool[Math.floor(Math.random() * keyPhrasesPool.length)]
      );

      players.push({
        id: `${teamId}-${numbers[i]}`,
        name: names[nameIndex] || `Player ${numbers[i]}`,
        position: pos,
        positionNumber: numbers[i],
        teamId,
        teamName,
        rating,
        previousRating: rating + (Math.random() - 0.5),
        mentions,
        positiveReactions,
        negativeReactions,
        keyPhrases,
        matchesPlayed: Math.floor(Math.random() * 5) + 1,
        goals: pos === "FW" ? Math.floor(Math.random() * 3) : pos === "MF" ? Math.floor(Math.random() * 2) : 0,
        assists: pos === "MF" || pos === "FW" ? Math.floor(Math.random() * 2) : 0,
        cleanSheets: pos === "GK" || pos === "DF" ? Math.floor(Math.random() * 2) : 0,
      });
      nameIndex++;
    }
  });

  return players.sort((a, b) => b.rating - a.rating);
}

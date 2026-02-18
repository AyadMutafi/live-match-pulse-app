// Target clubs for the app - expanded to cover 5 major leagues
export const TARGET_CLUBS = [
  // Spain (La Liga)
  { name: "FC Barcelona", shortName: "Barcelona", aliases: ["Barcelona", "Barça", "Barca", "FCB"], league: "La Liga", country: "Spain", color: "#A50044" },
  { name: "Real Madrid CF", shortName: "Real Madrid", aliases: ["Real Madrid", "Madrid", "RMA"], league: "La Liga", country: "Spain", color: "#FEBE10" },
  { name: "Atletico de Madrid", shortName: "Atlético Madrid", aliases: ["Atletico Madrid", "Atlético Madrid", "Atleti", "ATM"], league: "La Liga", country: "Spain", color: "#CB3524" },
  
  // England (Premier League)
  { name: "Liverpool FC", shortName: "Liverpool", aliases: ["Liverpool", "LFC", "The Reds"], league: "Premier League", country: "England", color: "#C8102E" },
  { name: "Manchester City FC", shortName: "Man City", aliases: ["Manchester City", "Man City", "City", "MCFC"], league: "Premier League", country: "England", color: "#6CABDD" },
  { name: "Manchester United FC", shortName: "Man United", aliases: ["Manchester United", "Man United", "United", "MUFC"], league: "Premier League", country: "England", color: "#DA291C" },
  { name: "Arsenal FC", shortName: "Arsenal", aliases: ["Arsenal", "AFC", "Gunners"], league: "Premier League", country: "England", color: "#EF0107" },

  // Italy (Serie A)
  { name: "FC Internazionale Milano", shortName: "Inter Milan", aliases: ["Inter Milan", "Inter", "INT"], league: "Serie A", country: "Italy", color: "#0068A8" },
  { name: "Juventus FC", shortName: "Juventus", aliases: ["Juventus", "Juve", "JUV"], league: "Serie A", country: "Italy", color: "#000000" },
  { name: "AC Milan", shortName: "AC Milan", aliases: ["AC Milan", "Milan", "ACM"], league: "Serie A", country: "Italy", color: "#FB090B" },
  { name: "SSC Napoli", shortName: "Napoli", aliases: ["Napoli", "NAP"], league: "Serie A", country: "Italy", color: "#12A0D7" },

  // Germany (Bundesliga)
  { name: "FC Bayern München", shortName: "Bayern Munich", aliases: ["Bayern Munich", "Bayern", "FCB München", "BAY"], league: "Bundesliga", country: "Germany", color: "#DC052D" },
  { name: "Borussia Dortmund", shortName: "Dortmund", aliases: ["Dortmund", "BVB", "Borussia Dortmund"], league: "Bundesliga", country: "Germany", color: "#FDE100" },
  { name: "Bayer 04 Leverkusen", shortName: "Leverkusen", aliases: ["Leverkusen", "Bayer Leverkusen", "LEV"], league: "Bundesliga", country: "Germany", color: "#E32221" },

  // France (Ligue 1)
  { name: "Paris Saint-Germain FC", shortName: "PSG", aliases: ["PSG", "Paris Saint-Germain", "Paris"], league: "Ligue 1", country: "France", color: "#004170" },
  { name: "Olympique de Marseille", shortName: "Marseille", aliases: ["Marseille", "OM", "Olympique Marseille"], league: "Ligue 1", country: "France", color: "#2FAEE0" },
] as const;

export type TargetClub = typeof TARGET_CLUBS[number];

// Get all aliases as a flat array for filtering
export const ALL_TARGET_ALIASES = TARGET_CLUBS.flatMap(club => [club.name, club.shortName, ...club.aliases]);

// Classic rivalries between target clubs
export const CLUB_RIVALRIES = [
  {
    name: "El Clásico",
    clubs: ["FC Barcelona", "Real Madrid CF"],
    description: "The biggest rivalry in world football",
    intensity: 100
  },
  {
    name: "Madrid Derby",
    clubs: ["Real Madrid CF", "Atletico de Madrid"],
    description: "Madrid's fierce local derby",
    intensity: 90
  },
  {
    name: "Manchester Derby",
    clubs: ["Manchester City FC", "Manchester United FC"],
    description: "Battle for Manchester supremacy",
    intensity: 95
  },
  {
    name: "North-West Derby",
    clubs: ["Liverpool FC", "Manchester United FC"],
    description: "England's most historic rivalry",
    intensity: 98
  },
  {
    name: "Title Race Clash",
    clubs: ["Liverpool FC", "Manchester City FC"],
    description: "Modern Premier League's defining rivalry",
    intensity: 92
  },
  {
    name: "North London Derby",
    clubs: ["Arsenal FC", "Tottenham Hotspur FC"],
    description: "Arsenal's local rivalry",
    intensity: 88
  },
  {
    name: "Derby della Madonnina",
    clubs: ["FC Internazionale Milano", "AC Milan"],
    description: "Milan's legendary city derby",
    intensity: 96
  },
  {
    name: "Derby d'Italia",
    clubs: ["Juventus FC", "FC Internazionale Milano"],
    description: "Italy's biggest inter-city rivalry",
    intensity: 94
  },
  {
    name: "Der Klassiker",
    clubs: ["FC Bayern München", "Borussia Dortmund"],
    description: "Germany's defining football rivalry",
    intensity: 93
  },
  {
    name: "Le Classique",
    clubs: ["Paris Saint-Germain FC", "Olympique de Marseille"],
    description: "France's fiercest football rivalry",
    intensity: 91
  }
] as const;

// Check if a team is one of the target clubs
export const isTargetClub = (teamName: string): boolean => {
  const normalizedName = teamName.toLowerCase().trim();
  return TARGET_CLUBS.some(club => 
    club.name.toLowerCase() === normalizedName ||
    club.shortName.toLowerCase() === normalizedName ||
    club.aliases.some(alias => alias.toLowerCase() === normalizedName) ||
    normalizedName.includes(club.shortName.toLowerCase()) ||
    club.aliases.some(alias => normalizedName.includes(alias.toLowerCase()))
  );
};

// Get club info by name
export const getClubInfo = (teamName: string): TargetClub | undefined => {
  const normalizedName = teamName.toLowerCase().trim();
  return TARGET_CLUBS.find(club => 
    club.name.toLowerCase() === normalizedName ||
    club.shortName.toLowerCase() === normalizedName ||
    club.aliases.some(alias => alias.toLowerCase() === normalizedName) ||
    normalizedName.includes(club.shortName.toLowerCase()) ||
    club.aliases.some(alias => normalizedName.includes(alias.toLowerCase()))
  );
};

// Check if match involves at least one target club
export const isTargetMatch = (homeTeam: string, awayTeam: string): boolean => {
  return isTargetClub(homeTeam) || isTargetClub(awayTeam);
};

// Check if match is a featured match (both teams are target clubs)
export const isFeaturedMatch = (homeTeam: string, awayTeam: string): boolean => {
  return isTargetClub(homeTeam) && isTargetClub(awayTeam);
};

// Get rivalry name if applicable
export const getRivalryName = (homeTeam: string, awayTeam: string): string | null => {
  const rivalry = CLUB_RIVALRIES.find(r => {
    const homeInfo = getClubInfo(homeTeam);
    const awayInfo = getClubInfo(awayTeam);
    if (!homeInfo || !awayInfo) return false;
    const clubNames = r.clubs as readonly string[];
    return clubNames.includes(homeInfo.name) && clubNames.includes(awayInfo.name);
  });
  return rivalry?.name || null;
};

// Sentiment categories with 10 nuanced levels
export const SENTIMENT_CATEGORIES = [
  { name: "Euphoric", range: [90, 100], emoji: "🎉", color: "hsl(142, 76%, 36%)" },
  { name: "Optimistic", range: [80, 89], emoji: "😊", color: "hsl(142, 60%, 45%)" },
  { name: "Pleased", range: [70, 79], emoji: "👍", color: "hsl(142, 50%, 50%)" },
  { name: "Neutral", range: [50, 69], emoji: "😐", color: "hsl(215, 20%, 65%)" },
  { name: "Concerned", range: [40, 49], emoji: "😟", color: "hsl(38, 70%, 50%)" },
  { name: "Nervous", range: [30, 39], emoji: "😰", color: "hsl(38, 80%, 45%)" },
  { name: "Frustrated", range: [20, 29], emoji: "😤", color: "hsl(0, 60%, 55%)" },
  { name: "Angry", range: [10, 19], emoji: "😠", color: "hsl(0, 70%, 50%)" },
  { name: "Outraged", range: [5, 9], emoji: "🤬", color: "hsl(0, 80%, 45%)" },
  { name: "Devastated", range: [0, 4], emoji: "😢", color: "hsl(0, 84%, 40%)" },
] as const;

// Get sentiment category from score
export const getSentimentCategory = (score: number) => {
  const category = SENTIMENT_CATEGORIES.find(
    cat => score >= cat.range[0] && score <= cat.range[1]
  );
  return category || SENTIMENT_CATEGORIES[3]; // Default to Neutral
};

// Legacy support - keep for backward compatibility
export const ALLOWED_TEAMS = ALL_TARGET_ALIASES;

export const isAllowedTeam = (teamName: string): boolean => {
  return isTargetClub(teamName);
};

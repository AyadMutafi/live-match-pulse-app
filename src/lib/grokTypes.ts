// Target clubs for Grok-powered sentiment analysis
export const TARGET_CLUBS = {
  spain: ['FC Barcelona', 'Real Madrid CF', 'Atletico de Madrid'] as const,
  england: ['Liverpool FC', 'Manchester City FC', 'Manchester United FC', 'Arsenal FC'] as const,
};

export const ALL_TARGET_CLUBS = [...TARGET_CLUBS.spain, ...TARGET_CLUBS.england] as const;

export type TargetClub = typeof ALL_TARGET_CLUBS[number];

// Sentiment categories from Euphoric to Devastated
export const SENTIMENT_CATEGORIES = [
  'Euphoric', 'Optimistic', 'Pleased', 'Neutral', 'Concerned',
  'Nervous', 'Frustrated', 'Angry', 'Outraged', 'Devastated'
] as const;

export type SentimentCategory = typeof SENTIMENT_CATEGORIES[number];
export type SentimentIntensity = 'Weak' | 'Moderate' | 'Strong' | 'Extreme';

// Classic rivalries
export const CLASSIC_RIVALRIES = [
  { clubA: 'FC Barcelona', clubB: 'Real Madrid CF', name: 'El Clásico' },
  { clubA: 'Liverpool FC', clubB: 'Manchester United FC', name: 'North West Derby' },
  { clubA: 'Manchester City FC', clubB: 'Manchester United FC', name: 'Manchester Derby' },
  { clubA: 'Arsenal FC', clubB: 'Manchester United FC', name: 'Historic Rivalry' },
  { clubA: 'Atletico de Madrid', clubB: 'Real Madrid CF', name: 'Madrid Derby' },
  { clubA: 'Liverpool FC', clubB: 'Manchester City FC', name: 'Title Race Rivalry' },
] as const;

// ========== POST /api/grok/sentiment ==========
export interface GrokSentimentPost {
  id?: string;
  content: string;
  club?: string;
  author?: string;
  platform?: string;
  timestamp?: string;
}

export interface GrokSentimentResult {
  postId: string;
  content: string;
  sentiment: {
    category: SentimentCategory;
    score: number;
    intensity: SentimentIntensity;
    sarcasmDetected: boolean;
    topics: string[];
    emotionKeywords: string[];
    language: 'en' | 'es';
    club: string;
  };
}

export interface GrokSentimentResponse {
  results: GrokSentimentResult[];
  aggregateStats: {
    totalPosts: number;
    averageScore: number;
    categoryBreakdown: Record<SentimentCategory, number>;
    sarcasmCount: number;
    topTopics: string[];
    byClub: Record<string, {
      count: number;
      averageScore: number;
      dominantCategory: SentimentCategory;
    }>;
  };
  targetClubs: string[];
}

// ========== POST /api/grok/match-summary ==========
export interface GrokMatchSummaryRequest {
  matchId: string;
  homeTeam: string;
  awayTeam: string;
  homeScore?: number;
  awayScore?: number;
  minute?: number;
  status: 'scheduled' | 'live' | 'finished';
  posts: Array<{
    content: string;
    author?: string;
    timestamp?: string;
    platform?: string;
  }>;
}

export interface GrokMatchSummaryResponse {
  matchId: string;
  summary: string;
  keyMoments: string[];
  viralHighlights: string[];
  controversyThemes: string[];
  fanMood: {
    homeTeam: { score: number; emoji: string; description: string };
    awayTeam: { score: number; emoji: string; description: string };
  };
  talkingPoints: string[];
  updatedAt: string;
}

// ========== POST /api/grok/club-analysis ==========
export interface GrokClubAnalysisRequest {
  club: TargetClub;
  posts: GrokSentimentPost[];
  players?: string[];
}

export interface GrokClubAnalysisResponse {
  club: string;
  analysisDate: string;
  overallSentiment: {
    score: number;
    label: string;
    emoji: string;
  };
  keyTalkingPoints: Array<{
    topic: string;
    sentiment: 'positive' | 'negative' | 'neutral';
    mentionCount: number;
    summary: string;
  }>;
  sentimentTrend: {
    vsLastMatch: { direction: 'up' | 'down' | 'stable'; change: number };
    vsLastWeek: { direction: 'up' | 'down' | 'stable'; change: number };
  };
  playerSentiment: {
    praised: Array<{ name: string; score: number; topics: string[] }>;
    criticized: Array<{ name: string; score: number; topics: string[] }>;
  };
  fanActivity: {
    totalMentions: number;
    peakHour: string;
    platforms: Record<string, number>;
  };
  topEmotions: string[];
}

// ========== POST /api/grok/rivalry-analysis ==========
export interface GrokRivalryAnalysisRequest {
  clubA: TargetClub;
  clubB: TargetClub;
  postsClubA: GrokSentimentPost[];
  postsClubB: GrokSentimentPost[];
}

export interface GrokRivalryAnalysisResponse {
  rivalry: {
    clubA: string;
    clubB: string;
    name: string;
  };
  sentimentComparison: {
    clubA: { score: number; label: string; emoji: string };
    clubB: { score: number; label: string; emoji: string };
    advantage: string;
  };
  activityComparison: {
    clubA: { mentions: number; engagement: number };
    clubB: { mentions: number; engagement: number };
    louderFanbase: string;
  };
  fanNarratives: {
    clubA: string[];
    clubB: string[];
  };
  rivalryInsights: {
    intensity: 'Low' | 'Moderate' | 'High' | 'Extreme';
    mainTopics: string[];
    controversies: string[];
    banterHighlights: string[];
  };
  headToHead: {
    recentTone: 'friendly' | 'tense' | 'hostile';
    trendingHashtags: string[];
  };
  analysisDate: string;
}

// ========== POST /api/grok/player-sentiment ==========
export interface GrokPlayerSentimentRequest {
  playerName: string;
  club: TargetClub;
  posts: GrokSentimentPost[];
  includeTopicBreakdown?: boolean;
}

export interface GrokPlayerSentimentResponse {
  player: {
    name: string;
    club: string;
  };
  overallRating: {
    score: number; // 0-10
    label: string;
    emoji: string;
  };
  topicBreakdown: Array<{
    topic: string;
    positivePercent: number;
    negativePercent: number;
    neutralPercent: number;
    sampleComments: string[];
  }>;
  trend: {
    direction: 'improving' | 'declining' | 'stable';
    vsLastMatch: number;
    momentum: string;
  };
  fanVerdicts: {
    praises: string[];
    criticisms: string[];
    debates: string[];
  };
  highlightQuotes: string[];
  analysisDate: string;
}

// Helper functions
export function getSentimentEmoji(category: SentimentCategory): string {
  const emojiMap: Record<SentimentCategory, string> = {
    'Euphoric': '🤩',
    'Optimistic': '😊',
    'Pleased': '🙂',
    'Neutral': '😐',
    'Concerned': '😟',
    'Nervous': '😰',
    'Frustrated': '😤',
    'Angry': '😠',
    'Outraged': '🤬',
    'Devastated': '😭',
  };
  return emojiMap[category] || '😐';
}

export function getSentimentColor(category: SentimentCategory): string {
  const colorMap: Record<SentimentCategory, string> = {
    'Euphoric': 'text-green-400',
    'Optimistic': 'text-emerald-400',
    'Pleased': 'text-teal-400',
    'Neutral': 'text-gray-400',
    'Concerned': 'text-yellow-400',
    'Nervous': 'text-orange-400',
    'Frustrated': 'text-orange-500',
    'Angry': 'text-red-400',
    'Outraged': 'text-red-500',
    'Devastated': 'text-red-600',
  };
  return colorMap[category] || 'text-gray-400';
}

export function getIntensityBadgeColor(intensity: SentimentIntensity): string {
  const colorMap: Record<SentimentIntensity, string> = {
    'Weak': 'bg-gray-500/20 text-gray-300',
    'Moderate': 'bg-yellow-500/20 text-yellow-300',
    'Strong': 'bg-orange-500/20 text-orange-300',
    'Extreme': 'bg-red-500/20 text-red-300',
  };
  return colorMap[intensity] || 'bg-gray-500/20 text-gray-300';
}

export function getClubShortName(club: string): string {
  const shortNames: Record<string, string> = {
    'FC Barcelona': 'Barça',
    'Real Madrid CF': 'Real Madrid',
    'Atletico de Madrid': 'Atlético',
    'Liverpool FC': 'Liverpool',
    'Manchester City FC': 'Man City',
    'Manchester United FC': 'Man United',
    'Arsenal FC': 'Arsenal',
  };
  return shortNames[club] || club;
}

export function getClubColors(club: string): { primary: string; secondary: string } {
  const colors: Record<string, { primary: string; secondary: string }> = {
    'FC Barcelona': { primary: '#A50044', secondary: '#004D98' },
    'Real Madrid CF': { primary: '#FFFFFF', secondary: '#00529F' },
    'Atletico de Madrid': { primary: '#CB3524', secondary: '#FFFFFF' },
    'Liverpool FC': { primary: '#C8102E', secondary: '#00B2A9' },
    'Manchester City FC': { primary: '#6CABDD', secondary: '#1C2C5B' },
    'Manchester United FC': { primary: '#DA291C', secondary: '#FBE122' },
    'Arsenal FC': { primary: '#EF0107', secondary: '#063672' },
  };
  return colors[club] || { primary: '#666666', secondary: '#333333' };
}

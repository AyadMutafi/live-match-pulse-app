import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Types for Gemini API responses
export interface GeminiSentimentResult {
  postId: string;
  originalContent: string;
  sentiment: {
    category: string;
    score: number;
    intensity: 'Weak' | 'Moderate' | 'Strong' | 'Extreme';
    sarcasmDetected: boolean;
    topics: string[];
    emotionKeywords: string[];
  };
  clubMentioned: string | null;
  language: string;
}

export interface GeminiSentimentResponse {
  results: GeminiSentimentResult[];
  aggregateStats: {
    totalPosts: number;
    averageScore: number;
    categoryBreakdown: Record<string, number>;
    topTopics: string[];
    dominantCategory: string;
    sarcasmCount: number;
  };
  model: string;
  provider: string;
}

export interface GeminiClubAnalysisResponse {
  club: string;
  overallSentiment: {
    score: number;
    label: string;
    trend: 'improving' | 'declining' | 'stable';
  };
  keyTalkingPoints: Array<{ topic: string; sentiment: string; mentionCount: number }>;
  sentimentTrend: {
    vsLastMatch: number;
    vsLastWeek: number;
  };
  playerSentiment: {
    topPraised: Array<{ name: string; score: number; topics: string[] }>;
    mostCriticized: Array<{ name: string; score: number; topics: string[] }>;
  };
  fanActivity: {
    totalMentions: number;
    platformBreakdown: Record<string, number>;
    peakActivity: string;
  };
  topEmotions: Array<{ emotion: string; percentage: number }>;
  generatedAt: string;
  model: string;
  provider: string;
}

export interface GeminiRivalryAnalysisResponse {
  clubA: string;
  clubB: string;
  sentimentComparison: {
    clubA: { score: number; dominantEmotion: string };
    clubB: { score: number; dominantEmotion: string };
  };
  fanActivity: {
    clubA: { mentions: number; engagement: string };
    clubB: { mentions: number; engagement: string };
  };
  whatFansAreSaying: {
    clubA: string[];
    clubB: string[];
  };
  rivalryInsights: {
    tensionLevel: string;
    keyDebates: string[];
    prediction: string;
    historicalContext: string;
  };
  headToHeadSentiment: {
    moreConfident: string;
    moreAnxious: string;
    moreOptimistic: string;
  };
  generatedAt: string;
  model: string;
  provider: string;
}

export interface GeminiPlayerSentimentResponse {
  playerName: string;
  club: string;
  overallRating: number;
  sentimentLabel: string;
  topicBreakdown: Array<{
    topic: string;
    positivePercentage: number;
    negativePercentage: number;
    sampleComments: string[];
  }>;
  trend: {
    direction: 'improving' | 'declining' | 'stable';
    changePercent: number;
  };
  fanOpinions: {
    praiseCount: number;
    criticismCount: number;
    neutralCount: number;
    topPraises: string[];
    topCriticisms: string[];
  };
  comparisonToTeammates: {
    ranking: number;
    totalPlayers: number;
  };
  postsAnalyzed: number;
  generatedAt: string;
  model: string;
  provider: string;
}

export interface GeminiMatchSummaryResponse {
  matchId: string;
  homeTeam: string;
  awayTeam: string;
  score: string;
  status: string;
  summary: string;
  keyMoments: string[];
  talkingPoints: string[];
  sentiment: {
    overall: string;
    homeTeamFans: string;
    awayTeamFans: string;
  };
  viralMoments: string[];
  controversies: string[];
  generatedAt: string;
  isTargetClubMatch: boolean;
  model: string;
  provider: string;
}

// Sentiment analysis mutation
export function useGeminiSentimentAnalysis() {
  return useMutation({
    mutationFn: async (posts: Array<{ id?: string; content: string }>) => {
      const { data, error } = await supabase.functions.invoke('gemini-sentiment', {
        body: { posts }
      });
      if (error) throw error;
      return data as GeminiSentimentResponse;
    },
  });
}

// Match summary mutation
export function useGeminiMatchSummaryMutation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (matchData: {
      matchId: string;
      homeTeam: string;
      awayTeam: string;
      homeScore: number;
      awayScore: number;
      matchMinute?: number;
      status: 'live' | 'finished' | 'upcoming';
      socialPosts?: Array<{ content: string; platform: string }>;
      keyEvents?: Array<{ minute: number; type: string; player?: string; description?: string }>;
    }) => {
      const { data, error } = await supabase.functions.invoke('gemini-match-summary', {
        body: matchData
      });
      if (error) throw error;
      return data as GeminiMatchSummaryResponse;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['gemini-match-summary', data.matchId], data);
    },
  });
}

// Club analysis mutation
export function useGeminiClubAnalysisMutation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (params: {
      club: string;
      posts: Array<{ content: string; platform: string }>;
      players?: string[];
    }) => {
      const { data, error } = await supabase.functions.invoke('gemini-club-analysis', {
        body: params
      });
      if (error) throw error;
      return data as GeminiClubAnalysisResponse;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['gemini-club-analysis', data.club], data);
    },
  });
}

// Rivalry analysis mutation
export function useGeminiRivalryAnalysisMutation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (params: {
      clubA: string;
      clubB: string;
      postsClubA: Array<{ content: string; platform: string }>;
      postsClubB: Array<{ content: string; platform: string }>;
    }) => {
      const { data, error } = await supabase.functions.invoke('gemini-rivalry-analysis', {
        body: params
      });
      if (error) throw error;
      return data as GeminiRivalryAnalysisResponse;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['gemini-rivalry-analysis', data.clubA, data.clubB], data);
    },
  });
}

// Player sentiment mutation
export function useGeminiPlayerSentimentMutation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (params: {
      playerName: string;
      club: string;
      posts: Array<{ content: string; platform: string }>;
    }) => {
      const { data, error } = await supabase.functions.invoke('gemini-player-sentiment', {
        body: params
      });
      if (error) throw error;
      return data as GeminiPlayerSentimentResponse;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['gemini-player-sentiment', data.playerName, data.club], data);
    },
  });
}

// Helper functions for UI
export function getSentimentColor(category: string): string {
  const colors: Record<string, string> = {
    'Euphoric': 'text-green-500',
    'Optimistic': 'text-green-400',
    'Pleased': 'text-emerald-400',
    'Neutral': 'text-gray-400',
    'Concerned': 'text-yellow-400',
    'Nervous': 'text-orange-400',
    'Frustrated': 'text-orange-500',
    'Angry': 'text-red-400',
    'Outraged': 'text-red-500',
    'Devastated': 'text-red-600',
  };
  return colors[category] || 'text-gray-400';
}

export function getSentimentEmoji(category: string): string {
  const emojis: Record<string, string> = {
    'Euphoric': '🎉',
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
  return emojis[category] || '😐';
}

export function getScoreColor(score: number): string {
  if (score >= 75) return 'text-green-500';
  if (score >= 50) return 'text-yellow-500';
  if (score >= 25) return 'text-orange-500';
  return 'text-red-500';
}

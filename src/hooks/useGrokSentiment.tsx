import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { 
  GrokSentimentPost, 
  GrokSentimentResponse,
  GrokMatchSummaryRequest,
  GrokMatchSummaryResponse,
  GrokClubAnalysisRequest,
  GrokClubAnalysisResponse,
  GrokRivalryAnalysisRequest,
  GrokRivalryAnalysisResponse,
  GrokPlayerSentimentRequest,
  GrokPlayerSentimentResponse,
  TargetClub 
} from "@/lib/grokTypes";
import { toast } from "sonner";

// ========== Sentiment Analysis Hook ==========
export function useGrokSentimentAnalysis() {
  return useMutation({
    mutationFn: async ({ posts, clubFilter }: { posts: GrokSentimentPost[]; clubFilter?: TargetClub }) => {
      const { data, error } = await supabase.functions.invoke<GrokSentimentResponse>('grok-sentiment', {
        body: { posts, clubFilter }
      });

      if (error) throw error;
      return data;
    },
    onError: (error) => {
      console.error('Grok sentiment analysis error:', error);
      toast.error('Failed to analyze sentiment');
    },
  });
}

// ========== Match Summary Hook ==========
export function useGrokMatchSummary(matchId: string | null, enabled = true) {
  return useQuery({
    queryKey: ['grok-match-summary', matchId],
    queryFn: async () => {
      if (!matchId) return null;
      
      // This would typically fetch match data and posts first
      // For now, returning a placeholder that requires manual triggering
      return null;
    },
    enabled: enabled && !!matchId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useGrokMatchSummaryMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: GrokMatchSummaryRequest) => {
      const { data, error } = await supabase.functions.invoke<GrokMatchSummaryResponse>('grok-match-summary', {
        body: request
      });

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      if (data?.matchId) {
        queryClient.setQueryData(['grok-match-summary', data.matchId], data);
      }
    },
    onError: (error) => {
      console.error('Grok match summary error:', error);
      toast.error('Failed to generate match summary');
    },
  });
}

// ========== Club Analysis Hook ==========
export function useGrokClubAnalysis(club: TargetClub | null, enabled = true) {
  return useQuery({
    queryKey: ['grok-club-analysis', club],
    queryFn: async () => {
      if (!club) return null;
      
      // Fetch social posts for the club from database
      const { data: posts, error: postsError } = await supabase
        .from('social_posts')
        .select('id, content, platform, author_handle, posted_at')
        .order('posted_at', { ascending: false })
        .limit(100);

      if (postsError) throw postsError;
      if (!posts || posts.length === 0) return null;

      // Transform to expected format
      const transformedPosts: GrokSentimentPost[] = posts.map(p => ({
        id: p.id,
        content: p.content,
        club: club,
        author: p.author_handle || undefined,
        platform: p.platform,
        timestamp: p.posted_at,
      }));

      const { data, error } = await supabase.functions.invoke<GrokClubAnalysisResponse>('grok-club-analysis', {
        body: { club, posts: transformedPosts }
      });

      if (error) throw error;
      return data;
    },
    enabled: enabled && !!club,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useGrokClubAnalysisMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: GrokClubAnalysisRequest) => {
      const { data, error } = await supabase.functions.invoke<GrokClubAnalysisResponse>('grok-club-analysis', {
        body: request
      });

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      if (data?.club) {
        queryClient.setQueryData(['grok-club-analysis', data.club], data);
      }
    },
    onError: (error) => {
      console.error('Grok club analysis error:', error);
      toast.error('Failed to analyze club sentiment');
    },
  });
}

// ========== Rivalry Analysis Hook ==========
export function useGrokRivalryAnalysis(clubA: TargetClub | null, clubB: TargetClub | null, enabled = true) {
  return useQuery({
    queryKey: ['grok-rivalry-analysis', clubA, clubB],
    queryFn: async () => {
      if (!clubA || !clubB) return null;

      // Fetch posts for both clubs
      const { data: posts, error: postsError } = await supabase
        .from('social_posts')
        .select('id, content, platform, author_handle, posted_at')
        .order('posted_at', { ascending: false })
        .limit(100);

      if (postsError) throw postsError;

      // Split posts (in real implementation, would filter by team association)
      const midpoint = Math.floor((posts?.length || 0) / 2);
      const postsClubA = (posts || []).slice(0, midpoint).map(p => ({
        id: p.id,
        content: p.content,
        club: clubA,
        author: p.author_handle || undefined,
        platform: p.platform,
        timestamp: p.posted_at,
      }));
      const postsClubB = (posts || []).slice(midpoint).map(p => ({
        id: p.id,
        content: p.content,
        club: clubB,
        author: p.author_handle || undefined,
        platform: p.platform,
        timestamp: p.posted_at,
      }));

      const { data, error } = await supabase.functions.invoke<GrokRivalryAnalysisResponse>('grok-rivalry-analysis', {
        body: { clubA, clubB, postsClubA, postsClubB }
      });

      if (error) throw error;
      return data;
    },
    enabled: enabled && !!clubA && !!clubB,
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
}

export function useGrokRivalryAnalysisMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: GrokRivalryAnalysisRequest) => {
      const { data, error } = await supabase.functions.invoke<GrokRivalryAnalysisResponse>('grok-rivalry-analysis', {
        body: request
      });

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      if (data?.rivalry) {
        queryClient.setQueryData(
          ['grok-rivalry-analysis', data.rivalry.clubA, data.rivalry.clubB], 
          data
        );
      }
    },
    onError: (error) => {
      console.error('Grok rivalry analysis error:', error);
      toast.error('Failed to analyze rivalry');
    },
  });
}

// ========== Player Sentiment Hook ==========
export function useGrokPlayerSentiment(playerName: string | null, club: TargetClub | null, enabled = true) {
  return useQuery({
    queryKey: ['grok-player-sentiment', playerName, club],
    queryFn: async () => {
      if (!playerName || !club) return null;

      // Fetch posts mentioning the player
      const { data: posts, error: postsError } = await supabase
        .from('social_posts')
        .select('id, content, platform, author_handle, posted_at')
        .ilike('content', `%${playerName}%`)
        .order('posted_at', { ascending: false })
        .limit(60);

      if (postsError) throw postsError;
      if (!posts || posts.length === 0) return null;

      const transformedPosts: GrokSentimentPost[] = posts.map(p => ({
        id: p.id,
        content: p.content,
        club: club,
        author: p.author_handle || undefined,
        platform: p.platform,
        timestamp: p.posted_at,
      }));

      const { data, error } = await supabase.functions.invoke<GrokPlayerSentimentResponse>('grok-player-sentiment', {
        body: { playerName, club, posts: transformedPosts }
      });

      if (error) throw error;
      return data;
    },
    enabled: enabled && !!playerName && !!club,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useGrokPlayerSentimentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: GrokPlayerSentimentRequest) => {
      const { data, error } = await supabase.functions.invoke<GrokPlayerSentimentResponse>('grok-player-sentiment', {
        body: request
      });

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      if (data?.player) {
        queryClient.setQueryData(
          ['grok-player-sentiment', data.player.name, data.player.club], 
          data
        );
      }
    },
    onError: (error) => {
      console.error('Grok player sentiment error:', error);
      toast.error('Failed to analyze player sentiment');
    },
  });
}

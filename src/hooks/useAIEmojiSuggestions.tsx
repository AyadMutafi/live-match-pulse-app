import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface EmojiSuggestion {
  emoji: string;
  label: string;
  confidence: number;
  reason: string;
}

interface AIEmojiSuggestionsParams {
  matchId?: string;
  context?: 'pre-match' | 'live' | 'post-match';
  teamName?: string;
  currentScore?: { home: number; away: number };
}

export function useAIEmojiSuggestions({ 
  matchId, 
  context = 'live',
  teamName,
  currentScore 
}: AIEmojiSuggestionsParams) {
  return useQuery({
    queryKey: ['ai-emoji-suggestions', matchId, context, teamName, currentScore],
    queryFn: async (): Promise<EmojiSuggestion[]> => {
      if (!matchId) return getDefaultSuggestions(context);

      try {
        // Get match data
        const { data: match } = await supabase
          .from('matches')
          .select('*, home_team:teams!matches_home_team_id_fkey(name), away_team:teams!matches_away_team_id_fkey(name)')
          .eq('id', matchId)
          .single();

        // Get recent social sentiment
        const { data: recentPosts } = await supabase
          .from('social_posts')
          .select('sentiment_score, emotions, content')
          .eq('match_id', matchId)
          .order('posted_at', { ascending: false })
          .limit(50);

        // Calculate average sentiment
        const avgSentiment = recentPosts?.reduce((sum, p) => sum + (p.sentiment_score || 0.5), 0) / (recentPosts?.length || 1);

        // Generate context-aware emoji suggestions
        return generateContextualEmojis(context, match, avgSentiment, currentScore, teamName);
      } catch (error) {
        console.error('Error fetching AI emoji suggestions:', error);
        return getDefaultSuggestions(context);
      }
    },
    enabled: !!matchId,
    staleTime: 30000, // 30 seconds
  });
}

function generateContextualEmojis(
  context: string,
  match: any,
  sentiment: number,
  score?: { home: number; away: number },
  teamName?: string
): EmojiSuggestion[] {
  const suggestions: EmojiSuggestion[] = [];

  // Context-based suggestions
  if (context === 'pre-match') {
    suggestions.push(
      { emoji: '🔥', label: 'Hyped', confidence: 0.9, reason: 'High anticipation for match start' },
      { emoji: '💪', label: 'Confident', confidence: 0.85, reason: 'Team looking strong' },
      { emoji: '🙏', label: 'Hopeful', confidence: 0.8, reason: 'Wishing for good performance' },
      { emoji: '😤', label: 'Ready', confidence: 0.75, reason: 'Team prepared for battle' },
    );
  } else if (context === 'live' && score) {
    const isWinning = teamName && match?.home_team?.name === teamName 
      ? score.home > score.away 
      : score.away > score.home;
    const isLosing = teamName && match?.home_team?.name === teamName 
      ? score.home < score.away 
      : score.away < score.home;

    if (isWinning) {
      suggestions.push(
        { emoji: '🎉', label: 'Celebrating', confidence: 0.95, reason: 'Team is winning!' },
        { emoji: '💪', label: 'Strong', confidence: 0.9, reason: 'Dominant performance' },
        { emoji: '⚡', label: 'Electric', confidence: 0.85, reason: 'Exciting match' },
      );
    } else if (isLosing) {
      suggestions.push(
        { emoji: '😤', label: 'Frustrated', confidence: 0.9, reason: 'Team needs to improve' },
        { emoji: '💔', label: 'Disappointed', confidence: 0.85, reason: 'Not the result we want' },
        { emoji: '🙏', label: 'Hopeful', confidence: 0.8, reason: 'Still time to turn it around' },
      );
    } else {
      suggestions.push(
        { emoji: '😬', label: 'Tense', confidence: 0.9, reason: 'Match is tight' },
        { emoji: '🔥', label: 'Intense', confidence: 0.85, reason: 'High stakes moment' },
      );
    }
  } else if (context === 'post-match') {
    if (sentiment > 0.6) {
      suggestions.push(
        { emoji: '🎊', label: 'Victory', confidence: 0.95, reason: 'Great win!' },
        { emoji: '👏', label: 'Applause', confidence: 0.9, reason: 'Outstanding performance' },
        { emoji: '💙', label: 'Love', confidence: 0.85, reason: 'Proud of the team' },
      );
    } else if (sentiment < 0.4) {
      suggestions.push(
        { emoji: '😔', label: 'Sad', confidence: 0.9, reason: 'Tough loss' },
        { emoji: '💔', label: 'Heartbroken', confidence: 0.85, reason: 'Disappointing result' },
        { emoji: '😤', label: 'Determined', confidence: 0.8, reason: 'We\'ll bounce back' },
      );
    }
  }

  // Sentiment-based suggestions
  if (sentiment > 0.7) {
    suggestions.push({ emoji: '😍', label: 'Love it', confidence: sentiment, reason: 'Fans are ecstatic' });
  } else if (sentiment > 0.5) {
    suggestions.push({ emoji: '😊', label: 'Happy', confidence: sentiment, reason: 'Positive vibes' });
  } else if (sentiment < 0.3) {
    suggestions.push({ emoji: '😡', label: 'Angry', confidence: 1 - sentiment, reason: 'Fans are upset' });
  }

  return suggestions.sort((a, b) => b.confidence - a.confidence).slice(0, 6);
}

function getDefaultSuggestions(context: string): EmojiSuggestion[] {
  if (context === 'pre-match') {
    return [
      { emoji: '🔥', label: 'Hyped', confidence: 0.8, reason: 'Match starting soon' },
      { emoji: '⚡', label: 'Excited', confidence: 0.75, reason: 'Ready for action' },
      { emoji: '💪', label: 'Confident', confidence: 0.7, reason: 'Team looking good' },
    ];
  }
  
  return [
    { emoji: '⚽', label: 'Football', confidence: 0.8, reason: 'Match in progress' },
    { emoji: '🔥', label: 'Intense', confidence: 0.75, reason: 'High energy' },
    { emoji: '😊', label: 'Enjoying', confidence: 0.7, reason: 'Good match' },
  ];
}

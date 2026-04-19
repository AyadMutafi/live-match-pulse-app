import Firecrawl from '@mendable/firecrawl-js';
import { detectLanguage, DICTIONARIES } from './multilingual-sentiment';
import { findPlayerMentions, PLAYER_NAME_VARIANTS } from './player-names-multilingual';

const firecrawl = new Firecrawl({
  apiKey: process.env.FIRECRAWL_API_KEY || ''
});

// Calculate sentiment (multilingual)
export function calculateSentiment(text: string): number {
  const detectedLang = detectLanguage(text);
  
  const positiveKeywords = DICTIONARIES[detectedLang]?.positive || DICTIONARIES['English'].positive;
  const negativeKeywords = DICTIONARIES[detectedLang]?.negative || DICTIONARIES['English'].negative;
  
  let score = 50;
  const lowerText = text.toLowerCase();
  
  for (const word of positiveKeywords) {
    if (lowerText.includes(word.toLowerCase())) {
      score += 5;
    }
  }
  
  for (const word of negativeKeywords) {
    if (lowerText.includes(word.toLowerCase())) {
      score -= 5;
    }
  }
  
  if (/[🔥😍🌟⭐💜❤️💪👑🎯]/.test(text)) score += 8;
  if (/[😭😤😢💔👎😫🤬]/.test(text)) score -= 8;
  
  return Math.max(0, Math.min(100, score));
}

// Extract player mention Using Multilingual
export function extractPlayerMention(text: string): string | undefined {
  return findPlayerMentions(text)[0];
}

export interface ScrapedTweet {
  text: string;
  author: string;
  sentiment: number;
  playersMentioned: string[];
}

export async function searchFootballTweets(
  query: string,
  options: { limit?: number, languages?: string[] } = {}
): Promise<ScrapedTweet[]> {
  // Provided signature as requested for future structured tweet extraction
  return [];
}

/**
 * Helper to build a multi-language query string for a player
 */
function buildMultiLanguageQuery(playerName: string, teamName: string): string {
  let queryParts = [`"${playerName} ${teamName}"`];
  const lowerPlayer = playerName.toLowerCase();
  
  let playerKey = Object.keys(PLAYER_NAME_VARIANTS).find(k => 
    PLAYER_NAME_VARIANTS[k].canonical.toLowerCase() === lowerPlayer || 
    PLAYER_NAME_VARIANTS[k].variants.english?.some(v => v.toLowerCase() === lowerPlayer)
  );

  if (playerKey) {
    const player = PLAYER_NAME_VARIANTS[playerKey];
    if (player.variants.arabic) {
      queryParts.push(`"${player.variants.arabic[0]} ${teamName}"`); // e.g. "محمد صلاح ليفربول"
    }
    if (player.variants.spanish) {
      queryParts.push(`"${player.variants.spanish[0]} ${teamName}"`);
    }
  }

  return queryParts.join(' OR ');
}

/**
 * Scrapes player sentiment from X.com with optional date filtering.
 */
export async function scrapePlayerSentiment(playerName: string, teamName: string, date?: string) {
  try {
    let query = buildMultiLanguageQuery(playerName, teamName);
    
    if (date) {
      const matchDate = new Date(date);
      const since = matchDate.toISOString().split('T')[0];
      const untilDate = new Date(matchDate);
      untilDate.setDate(untilDate.getDate() + 1);
      const until = untilDate.toISOString().split('T')[0];
      query = `(${query}) since:${since} until:${until}`;
    }

    const searchUrl = `https://x.com/search?q=${encodeURIComponent(query)}&f=live`;
    console.log('Scraping URL:', searchUrl);
    
    const result = await firecrawl.v1.search(query, {
      limit: 5,
      scrapeOptions: { formats: ['markdown'] }
    });

    if (!result.success) {
      throw new Error(result.error || 'Failed to search');
    }

    const combinedContent = result.data
      .map((item: any) => `Source: ${item.url}\n\nContent:\n${item.markdown || ''}`)
      .join('\n\n---\n\n');

    return {
      success: true,
      content: combinedContent,
      url: searchUrl,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Firecrawl error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Scrapes match sentiment from X.com with optional date filtering.
 */
export async function scrapeMatchSentiment(homeTeam: string, awayTeam: string, hashtag: string, date?: string) {
  try {
    let query = `("${homeTeam}" AND "${awayTeam}") OR "${hashtag}" OR #${homeTeam.replace(/\s+/g, '')} OR #${awayTeam.replace(/\s+/g, '')}`;
    
    if (date) {
      const matchDate = new Date(date);
      const since = matchDate.toISOString().split('T')[0];
      const untilDate = new Date(matchDate);
      untilDate.setDate(untilDate.getDate() + 1);
      const until = untilDate.toISOString().split('T')[0];
      query += ` since:${since} until:${until}`;
    }

    const searchUrl = `https://x.com/search?q=${encodeURIComponent(query)}&f=live`;
    console.log('Scraping URL:', searchUrl);
    
    const result = await firecrawl.v1.search(query, {
      limit: 5,
      scrapeOptions: { formats: ['markdown'] }
    });

    if (!result.success) {
      throw new Error(result.error || 'Failed to search');
    }

    const combinedContent = result.data
      .map((item: any) => `Source: ${item.url}\n\nContent:\n${item.markdown || ''}`)
      .join('\n\n---\n\n');

    return {
      success: true,
      content: combinedContent,
      url: searchUrl,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Firecrawl error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

export default firecrawl;

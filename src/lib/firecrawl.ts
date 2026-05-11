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
export async function scrapePlayerSentiment(
  playerName: string, 
  teamName: string, 
  date?: string,
  sources?: any[]
) {
  try {
    let baseQuery = buildMultiLanguageQuery(playerName, teamName);
    let query = baseQuery;
    
    // Override default query if specific sources are provided
    if (sources && sources.length > 0) {
      const sourceQueries = sources.map(source => {
        if (source.type === 'ACCOUNT' && source.account) {
          const handle = source.account.startsWith('@') ? source.account.slice(1) : source.account;
          return `from:${handle}`;
        }
        if (source.type === 'HASHTAG' && source.hashtag) {
          return source.hashtag.startsWith('#') ? source.hashtag : `#${source.hashtag}`;
        }
        return '';
      }).filter(Boolean);
      
      if (sourceQueries.length > 0) {
        query = `(${sourceQueries.join(' OR ')}) AND (${baseQuery})`;
      }
    }

    if (date) {
      const matchDate = new Date(date);
      
      const sinceDate = new Date(matchDate);
      sinceDate.setDate(sinceDate.getDate() - 2); 
      const since = sinceDate.toISOString().split('T')[0];
      
      const untilDate = new Date(matchDate);
      untilDate.setDate(untilDate.getDate() + 1);
      const until = untilDate.toISOString().split('T')[0];
      
      query = `(${query}) since:${since} until:${until}`;
    }

    query += ` min_faves:50 min_retweets:5`;

    const searchUrl = `https://x.com/search?q=${encodeURIComponent(query)}`;
    console.log('Scraping URL:', searchUrl);
    
    // Direct API call to Firecrawl Search
    const response = await fetch('https://api.firecrawl.dev/v1/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.FIRECRAWL_API_KEY}`
      },
      body: JSON.stringify({
        query: query,
        limit: 5,
        scrapeOptions: { formats: ['markdown'] }
      })
    });

    const result = await response.json();

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
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}



/**
 * Scrapes broad club sentiment and top tweets of the day.
 */
export async function scrapeClubSentiment(clubName: string, sources?: any[]) {
  try {
    let query = `"${clubName}"`;
    
    // Add trusted sources if provided
    if (sources && sources.length > 0) {
      const sourceQueries = sources.map(source => {
        if (source.type === 'ACCOUNT' && source.account) {
          const handle = source.account.startsWith('@') ? source.account.slice(1) : source.account;
          return `from:${handle}`;
        }
        return '';
      }).filter(Boolean);
      
      if (sourceQueries.length > 0) {
        query = `(${sourceQueries.join(' OR ')}) AND "${clubName}"`;
      }
    }

    // Target the last 24-48 hours
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const since = yesterday.toISOString().split('T')[0];
    query += ` since:${since}`;

    // Engagement filters for "Top Tweets"
    query += ` min_faves:200 min_retweets:20`;

    const searchUrl = `https://x.com/search?q=${encodeURIComponent(query)}`;
    console.log('Scraping Club URL:', searchUrl);
    
    const response = await fetch('https://api.firecrawl.dev/v1/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.FIRECRAWL_API_KEY}`
      },
      body: JSON.stringify({
        query: query,
        limit: 8,
        scrapeOptions: { formats: ['markdown'] }
      })
    });

    const result = await response.json();
    const combinedContent = (result.data || [])
      .map((d: any) => `[TWEET_URL: ${d.url || ''}]\n${d.markdown || d.content || ''}`)
      .join('\n\n---\n\n');

    return {
      success: true,
      content: combinedContent,
      url: searchUrl,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Firecrawl Club Error:', error);
    return { success: false, error: String(error) };
  }
}

/**
 * Scrapes match sentiment from X.com with optional date filtering.
 */
export async function scrapeMatchSentiment(
  homeTeam: string, 
  awayTeam: string, 
  hashtag: string, 
  date?: string,
  sources?: any[]
) {
  try {
    let query = `("${homeTeam}" AND "${awayTeam}") OR "${hashtag}" OR #${homeTeam.replace(/\s+/g, '')} OR #${awayTeam.replace(/\s+/g, '')}`;
    
    // Override default query if specific sources are provided
    if (sources && sources.length > 0) {
      const sourceQueries = sources.map(source => {
        if (source.type === 'ACCOUNT' && source.account) {
          const handle = source.account.startsWith('@') ? source.account.slice(1) : source.account;
          return `from:${handle}`;
        }
        if (source.type === 'HASHTAG' && source.hashtag) {
          return source.hashtag.startsWith('#') ? source.hashtag : `#${source.hashtag}`;
        }
        return '';
      }).filter(Boolean);
      
      if (sourceQueries.length > 0) {
        // Find tweets from trusted sources that mention the match teams or hashtag
        query = `(${sourceQueries.join(' OR ')}) AND ("${homeTeam}" OR "${awayTeam}" OR "${hashtag}")`;
      }
    }

    if (date) {
      const matchDate = new Date(date);
      
      // Look back 48 hours from the match date for a broader context of popular tweets
      const sinceDate = new Date(matchDate);
      sinceDate.setDate(sinceDate.getDate() - 2); 
      const since = sinceDate.toISOString().split('T')[0];
      
      const untilDate = new Date(matchDate);
      untilDate.setDate(untilDate.getDate() + 1); // Up to the day after the match
      const until = untilDate.toISOString().split('T')[0];
      
      query += ` since:${since} until:${until}`;
    }

    // Add engagement filters to guarantee high-interaction tweets from popular accounts
    query += ` min_faves:100 min_retweets:10`;

    // Remove &f=live to target the 'Top' algorithm instead of 'Latest'
    const searchUrl = `https://x.com/search?q=${encodeURIComponent(query)}`;
    console.log('Scraping URL:', searchUrl);
    
    // Direct API call to Firecrawl Search
    const response = await fetch('https://api.firecrawl.dev/v1/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.FIRECRAWL_API_KEY}`
      },
      body: JSON.stringify({
        query: query,
        limit: 5,
        scrapeOptions: { formats: ['markdown'] }
      })
    });

    const result = await response.json();

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
 * Scrapes content from an admin-defined DataSource.
 * Unlike scrapePlayerSentiment, this uses the raw query directly
 * without any multi-language player name wrapping.
 */
export async function scrapeFromSource(
  sourceType: string,
  query: string,
  sourceUrl?: string
) {
  try {
    console.log(`[scrapeFromSource] type=${sourceType}, query="${query}"`);

    // Build the search query based on source type
    let searchQuery: string;

    if (sourceType === 'ACCOUNT') {
      // For accounts, search for content "from:" that account
      const handle = query.startsWith('@') ? query.slice(1) : query;
      searchQuery = `from:${handle}`;
    } else if (sourceType === 'HASHTAG') {
      searchQuery = query.startsWith('#') ? query : `#${query}`;
    } else {
      searchQuery = query;
    }

    console.log(`[scrapeFromSource] Searching: "${searchQuery}"`);
    const response = await fetch('https://api.firecrawl.dev/v1/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.FIRECRAWL_API_KEY}`
      },
      body: JSON.stringify({
        query: searchQuery,
        limit: 5,
        scrapeOptions: { formats: ['markdown'] }
      })
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Failed to search');
    }

    const combinedContent = result.data
      .map((item: any) => `Source: ${item.url}\n\nContent:\n${item.markdown || ''}`)
      .join('\n\n---\n\n');

    return {
      success: true,
      content: combinedContent,
      url: `search://${searchQuery}`,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('[scrapeFromSource] Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

export default firecrawl;

import { db } from '@/lib/db';
import { scrapePlayerSentiment, scrapeMatchSentiment } from '@/lib/firecrawl';
import { analyzeSentimentWithAI } from '@/lib/ai-analysis';
import { updateRivalsAnalysis } from './rivals-journalist';

/**
 * Type definitions for Tool Parameters
 */
export interface ToolDefinition {
  name: string;
  description: string;
  parameters: {
    type: 'object';
    properties: Record<string, any>;
    required: string[];
  };
  execute: (args: any) => Promise<any>;
}

/**
 * The Manifest of all tools available to Paperclip AI Agents.
 */
export const AGENT_TOOLS: Record<string, ToolDefinition> = {
  /**
   * Status Tool: Helps the Scout agent decide what needs work.
   */
  get_app_status: {
    name: 'get_app_status',
    description: 'Retrieves a summary of live matches, upcoming matches, and players needing sentiment updates.',
    parameters: {
      type: 'object',
      properties: {},
      required: []
    },
    execute: async () => {
      const liveMatches = await db.match.findMany({
        where: { status: 'live' },
        select: { id: true, homeTeam: true, awayTeam: true, league: true, lastUpdated: true }
      });

      const upcomingMatches = await db.match.findMany({
        where: { status: 'upcoming' },
        take: 5,
        orderBy: { date: 'asc' },
        select: { id: true, homeTeam: true, awayTeam: true, date: true }
      });

      const trendingPlayers = await db.player.findMany({
        take: 10,
        orderBy: { lastUpdated: 'asc' },
        select: { id: true, name: true, team: true, lastUpdated: true, sentiment: true }
      });

      return {
        liveMatches,
        upcomingMatches,
        trendingPlayers,
        timestamp: new Date().toISOString()
      };
    }
  },

  /**
   * Scrape Tool: Orchestrates the raw scraping.
   */
  scrape_social_data: {
    name: 'scrape_social_data',
    description: 'Fetches raw social media content for a player or match from X.com.',
    parameters: {
      type: 'object',
      properties: {
        entityType: { type: 'string', enum: ['player', 'match'] },
        entityId: { type: 'string', description: 'DB ID for persistence check.' },
        query: { type: 'string', description: 'Override query (e.g. hashtag).' }
      },
      required: ['entityType', 'entityId']
    },
    execute: async ({ entityType, entityId, query: overrideQuery }) => {
      if (entityType === 'player') {
        const player = await db.player.findUnique({ where: { id: entityId } });
        if (!player) return { error: 'Player not found' };
        const result = await scrapePlayerSentiment(player.name, player.team);
        return result;
      } else {
        const match = await db.match.findUnique({ where: { id: entityId } });
        if (!match) return { error: 'Match not found' };
        const result = await scrapeMatchSentiment(match.homeTeam, match.awayTeam, overrideQuery || '#FanPulse');
        return result;
      }
    }
  },

  /**
   * Analyze Tool: Processes raw content into sentiment vectors.
   */
  analyze_sentiment: {
    name: 'analyze_sentiment',
    description: 'Uses Gemini to analyze raw social media content and extract sentiment, themes, and mentions.',
    parameters: {
      type: 'object',
      properties: {
        rawContent: { type: 'string' },
        entityLabel: { type: 'string' },
        previousScore: { type: 'number' }
      },
      required: ['rawContent', 'entityLabel']
    },
    execute: async ({ rawContent, entityLabel, previousScore }) => {
      const analysis = await analyzeSentimentWithAI(rawContent, entityLabel, previousScore || 50);
      return analysis;
    }
  },

  /**
   * Journalist Tool: Persists deep rivals analysis.
   */
  publish_rivals_intel: {
    name: 'publish_rivals_intel',
    description: 'Saves a high-quality "Journalist" analysis for a match rivalry in the database.',
    parameters: {
      type: 'object',
      properties: {
        matchId: { type: 'string' },
        analysisText: { type: 'string', description: 'The 100+ word tactical and psychological summary.' }
      },
      required: ['matchId', 'analysisText']
    },
    execute: async ({ matchId, analysisText }) => {
      return await updateRivalsAnalysis(matchId, analysisText);
    }
  },

  /**
   * Scrape Tool: Fetches raw social media content from admin-defined DataSource
   */
  scrape_from_source: {
    name: 'scrape_from_source',
    description: 'Fetches raw social media content using a stored DataSource (account or hashtag) defined by an admin.',
    parameters: {
      type: 'object',
      properties: {
        sourceId: { type: 'string', description: 'ID of the DataSource record' }
      },
      required: ['sourceId']
    },
    execute: async ({ sourceId }) => {
      const source = await db.dataSource.findUnique({ where: { id: sourceId } });
      if (!source) return { error: 'Source not found' };

      const query = source.account
        ? source.account
        : source.hashtag
        ? source.hashtag
        : source.url;

      const result = await scrapePlayerSentiment(query, source.name || 'unknown');
      return result;
    }
  }
};

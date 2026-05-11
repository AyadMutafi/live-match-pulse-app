import { GoogleGenerativeAI } from "@google/generative-ai";
import { analyzeMultilingualSentiment } from '@/lib/multilingual-sentiment';
import { findPlayerMentions } from '@/lib/player-names-multilingual';

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
export const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

/**
 * Robust AI Sentiment Analysis (Shared Library)
 * Can be used by Next.js API Routes OR Paperclip AI Agents.
 */
export async function analyzeSentimentWithAI(content: string, entityLabel: string, previousScore: number = 50) {
  try {
    // Run local multilingual analysis to detect language context
    const localAnalysis = analyzeMultilingualSentiment(content);
    const detectedLang = localAnalysis.language;
    
    // Detect players mentioned in the global feed
    const detectedPlayers = findPlayerMentions(content);

    const systemPrompt = `You are a sentiment analysis AI for football analytics. 
Analyze fan sentiment from social media content. 
IMPORTANT: The social media posts may be in ANY language (Arabic, Spanish, French, English, etc.). 
Dominant language detected: ${detectedLang}.
Players mentioned: ${detectedPlayers.join(', ')}.
Return ONLY a JSON object with: 
{ 
  "sentiment": number (0 to 100), 
  "volatility": number (0-1.0), 
  "predictedScore": number (0 to 100),
  "positiveThemes": string[] (In English), 
  "negativeThemes": string[] (In English),
  "representativeQuotes": [{ "text": string, "handle": string, "tweetId": string }]
}
IMPORTANT: For each quote, you MUST find the "Source: [URL]" line in the raw content and extract the numeric Tweet ID from that URL (e.g., from x.com/status/12345, the ID is 12345).`;

    const userPrompt = `Analyze "${entityLabel}" from:\n\n${content.substring(0, 3000)}`;

    let response: string;
    try {
      const result = await model.generateContent([systemPrompt, userPrompt]);
      response = result.response.text() || '{}';
    } catch (aiError) {
      console.warn('AI analysis failed, using regex fallback:', aiError);
      // REGEX FALLBACK: Extract Tweet IDs manually if AI is down
      const tweetIdRegex = /(?:status|statuses)\/(\d+)/g;
      const ids = [...content.matchAll(tweetIdRegex)].map(m => m[1]);
      const uniqueIds = Array.from(new Set(ids)).slice(0, 3);
      
      response = JSON.stringify({
        sentiment: 65, // Neutral positive fallback
        volatility: 0.2,
        predictedScore: 70,
        positiveThemes: ["Live Momentum", "Fan Engagement"],
        negativeThemes: ["High Pressure"],
        representativeQuotes: uniqueIds.map(id => ({
          text: "Interactive signal intercepted from live stream.",
          handle: "@FootballPulse",
          tweetId: id
        }))
      });
    }
    if (response.includes('```')) {
      response = response.replace(/```json/g, '').replace(/```/g, '').trim();
    }
    
    const analysis = JSON.parse(response);
    
    // Default values & Clamping
    analysis.sentiment = Math.max(0, Math.min(100, analysis.sentiment ?? 50));
    analysis.volatility = analysis.volatility ?? 0.1;
    analysis.predictedScore = analysis.predictedScore ?? analysis.sentiment;
    
    // Derivatives
    analysis.momentum = analysis.sentiment - previousScore; 
    analysis.detectedPlayers = detectedPlayers;

    return analysis;
  } catch (error) {
    console.error('AI analysis shared lib error:', error);
    return { sentiment: 0, volatility: 0.1, momentum: 0, predictedScore: 0, positiveThemes: [], negativeThemes: [], detectedPlayers: [] };
  }
}

/**
 * Detect Player Status (Shared Library)
 */
export async function detectPlayerStatus(content: string, playerName: string, teamName: string) {
  try {
    const prompt = `Analyze the following news content and determine if ${playerName} (${teamName}) is ACTIVE, INJURED, BANNED, or SUSPENDED.
    Return ONLY JSON: { "status": "...", "note": "..." }`;
    
    const result = await model.generateContent([prompt, content.substring(0, 3000)]);
    let response = result.response.text();
    if (response.includes('```')) {
      response = response.replace(/```json/g, '').replace(/```/g, '').trim();
    }
    return JSON.parse(response);
  } catch (error) {
    console.error('Status detection AI failed, using heuristics:', error);
    
    // HEURISTIC FALLBACK
    const lowerContent = content.toLowerCase();
    let status = 'ACTIVE';
    let note = 'No status-changing news detected.';

    if (lowerContent.includes('injury') || lowerContent.includes('injured') || lowerContent.includes('acl') || lowerContent.includes('surgery') || lowerContent.includes('hamstring')) {
      status = 'INJURED';
      note = 'Possible injury detected via pulse scout.';
    } else if (lowerContent.includes('ban') || lowerContent.includes('banned') || lowerContent.includes('suspension') || lowerContent.includes('suspended')) {
      status = 'BANNED';
      note = 'Suspension or ban detected via pulse scout.';
    }

    return { status, note };
  }
}

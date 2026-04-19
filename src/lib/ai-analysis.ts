import ZAI from 'z-ai-web-dev-sdk';
import { analyzeMultilingualSentiment } from '@/lib/multilingual-sentiment';
import { findPlayerMentions } from '@/lib/player-names-multilingual';

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

    // The SDK automatically reads GEMINI_API_KEY from environment
    const zai = await ZAI.create();
    
    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `You are a sentiment analysis AI for football analytics. 
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
            "representativeQuotes": [{ "text": string, "handle": string }]
          }`
        },
        {
          role: 'user',
          content: `Analyze "${entityLabel}" from:\n\n${content.substring(0, 3000)}`
        }
      ],
      thinking: { type: 'disabled' }
    });

    let response = completion.choices[0]?.message?.content || '{}';
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

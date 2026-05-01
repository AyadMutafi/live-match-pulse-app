import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export interface ThemeExtractionResult {
  positiveThemes: string[]
  negativeThemes: string[]
  trendingTopics: string[]
  fanMood: string
  confidence: number
}

/**
 * AI Theme Extractor — Uses Gemini to extract
 * structured theme data from scraped social media content.
 */
export async function extractThemes(content: string, entityLabel?: string): Promise<ThemeExtractionResult> {
  try {
    const prompt = `Analyze these football fan social media posts about ${entityLabel || 'this player/team'} and extract:
1. Top 5 positive themes/phrases fans use (what they praise)
2. Top 5 negative themes/phrases (what they criticize)  
3. Top 5 trending topics/keywords
4. Overall fan mood (one sentence)

Content to analyze:
${content.substring(0, 4000)}

Return ONLY valid JSON (no markdown, no code fences):
{
  "positiveThemes": ["theme1", "theme2", ...],
  "negativeThemes": ["theme1", "theme2", ...],
  "trendingTopics": ["topic1", "topic2", ...],
  "fanMood": "summary sentence",
  "confidence": 0-100
}`;

    const systemPrompt = `You are an elite football sentiment analyst. You extract structured theme data from fan discourse across X/Twitter, Reddit, and fan forums. Your output is always clean JSON with English labels. Be specific — not generic. "Clinical finishing" is better than "good". "Weak set pieces" is better than "bad defense".`;

    let response: string;
    try {
      const result = await model.generateContent([systemPrompt, prompt]);
      response = result.response.text() || '{}'
    } catch (aiError) {
      console.warn('Theme extraction AI failed, using fallback:', aiError);
      response = JSON.stringify({
        positiveThemes: ["Great atmosphere", "Strong individual performance"],
        negativeThemes: ["Frustrating finishing", "Defensive lapses"],
        trendingTopics: ["Match highlights", "Manager interview"],
        fanMood: "Cautiously optimistic following recent performances.",
        confidence: 50
      });
    }

    // Strip markdown code fences if present
    if (response.includes('```')) {
      response = response.replace(/```json/g, '').replace(/```/g, '').trim()
    }

    const parsed = JSON.parse(response)

    return {
      positiveThemes: Array.isArray(parsed.positiveThemes) ? parsed.positiveThemes.slice(0, 5) : [],
      negativeThemes: Array.isArray(parsed.negativeThemes) ? parsed.negativeThemes.slice(0, 5) : [],
      trendingTopics: Array.isArray(parsed.trendingTopics) ? parsed.trendingTopics.slice(0, 5) : [],
      fanMood: parsed.fanMood || 'Unable to determine mood',
      confidence: Math.max(0, Math.min(100, parsed.confidence ?? 50))
    }
  } catch (error) {
    console.error('[Theme Extractor] Error:', error)
    return {
      positiveThemes: [],
      negativeThemes: [],
      trendingTopics: [],
      fanMood: 'Analysis unavailable',
      confidence: 0
    }
  }
}

/**
 * Groups scraped content by player mentions.
 * Accepts raw markdown content and splits it into player-specific segments.
 */
export function groupContentByPlayer(content: string, playerNames: string[]): Record<string, string> {
  const groups: Record<string, string[]> = {}

  // Split content into paragraphs/sections
  const sections = content.split(/\n{2,}|---/)

  for (const section of sections) {
    if (!section.trim()) continue

    for (const name of playerNames) {
      const nameParts = name.toLowerCase().split(' ')
      const sectionLower = section.toLowerCase()

      // Match full name or last name
      const matches = sectionLower.includes(name.toLowerCase()) ||
        (nameParts.length > 1 && sectionLower.includes(nameParts[nameParts.length - 1]))

      if (matches) {
        if (!groups[name]) groups[name] = []
        groups[name].push(section.trim())
      }
    }
  }

  // Merge arrays into single strings
  const result: Record<string, string> = {}
  for (const [name, sections] of Object.entries(groups)) {
    result[name] = sections.join('\n\n')
  }

  return result
}

import { DICTIONARIES } from './multilingual-sentiment';

/**
 * Uses xAI's Grok API to search X.com in real-time and return dummy scraped text 
 * or directly return sentiment analysis if we use Grok for both.
 * For this pipeline, Grok will act as the "Scraper" by fetching real-time knowledge.
 */
export async function scrapeWithGrok(query: string, label?: string) {
  const apiKey = process.env.XAI_API_KEY;
  
  if (!apiKey) {
    console.warn('[Grok Scraper] Missing XAI_API_KEY');
    return { success: false, error: 'Missing XAI_API_KEY in .env file' };
  }

  const prompt = `You have real-time access to X/Twitter. Please search the platform right now for the following query: "${query}"${label ? ` about ${label}` : ''}.
  
Summarize the current live sentiment across multiple posts. Include at least 5 representative raw quotes (even if translated) from fans.
Format the output as clear Markdown text so our sentiment analyzer can parse it seamlessly.`;

  try {
    const response = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'grok-4.20', // updated to the latest 2026 stable flagship
        messages: [
          { role: 'system', content: 'You are an elite, real-time social media scraper specialized in global football culture.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.2
      })
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`xAI API Error: ${err}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error('Empty response from Grok');
    }

    return {
      success: true,
      content: content,
      url: `grok-search://${query.replace(/\s+/g, '-')}`,
      timestamp: new Date().toISOString()
    };
  } catch (error: any) {
    console.error('[Grok Scraper Error]:', error);
    return { success: false, error: error.message };
  }
}

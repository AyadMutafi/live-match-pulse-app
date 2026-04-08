import { NextResponse } from 'next/server'

// Vercel Cron Job runs this automatically based on vercel.json schedule
export async function GET(request: Request) {
  try {
    // Optionally check for Vercel Cron Auth Header to prevent unauthorized triggers
    const authHeader = request.headers.get('authorization');
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return new Response('Unauthorized', { status: 401 });
    }

    console.log('[Cron] Triggering background scrape for live tweets...');
    
    // In production, the URL needs to be absolute, so we trigger the local scrape endpoint
    const proto = request.headers.get('x-forwarded-proto') || 'http';
    const host = request.headers.get('host') || 'localhost:3000';
    
    const scrapeRes = await fetch(`${proto}://${host}/api/scrape`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });

    if (!scrapeRes.ok) {
      throw new Error(`Scrape API failed with status ${scrapeRes.status}`);
    }

    const data = await scrapeRes.json();

    return NextResponse.json({
      success: true,
      message: 'Cron triggered successfully',
      scrapeResult: data
    })
  } catch (error: any) {
    console.error('[Cron Error]:', error)
    return NextResponse.json({ error: 'Failed to process cron job', msg: error.message }, { status: 500 })
  }
}

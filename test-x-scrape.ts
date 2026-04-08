import FirecrawlApp from '@mendable/firecrawl-js'

async function test() {
  const firecrawl = new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY })
  try {
    const result = await firecrawl.search("site:x.com 'Vinicius'", {
      limit: 3
    });
    console.log("SUCCESS:", JSON.stringify(result, null, 2))
  } catch(e) {
    console.error("ERROR:", e)
  }
}

test()

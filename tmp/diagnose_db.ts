import prisma from "./src/lib/prisma"

async function main() {
  console.log('--- Database Health Check ---')
  
  const matchCount = await prisma.match.count()
  const playerCount = await prisma.player.count()
  const tweetCount = await prisma.tweet.count()
  const sentimentCount = await prisma.sentiment.count()

  console.log(`Summary: ${matchCount} matches, ${playerCount} players, ${tweetCount} tweets, ${sentimentCount} sentiments.`)

  const sampleMatch = await prisma.match.findFirst({
    where: { psycheJSON: { not: null } },
    orderBy: { date: 'desc' }
  })

  console.log('\n--- Recent Match Psyche Analysis ---')
  if (sampleMatch) {
    console.log(`Match: ${sampleMatch.homeTeam} v ${sampleMatch.awayTeam} (${sampleMatch.status})`)
    try {
      const psyche = JSON.parse(sampleMatch.psycheJSON)
      console.log('Psyche structure: ' + Object.keys(psyche).join(', '))
      if (psyche.preMatch) console.log('Pre-Match Categories: ' + Object.keys(psyche.preMatch).join(', '))
      if (psyche.postMatch) console.log('Post-Match Categories: ' + Object.keys(psyche.postMatch).join(', '))
    } catch (e) {
      console.log('Invalid psycheJSON format')
    }
  } else {
    console.log('No recent matches with psyche analysis found.')
  }

  const samplePlayer = await prisma.player.findFirst({
    orderBy: { lastUpdated: 'desc' }
  })

  console.log('\n--- Recent Player Updates ---')
  if (samplePlayer) {
    console.log(`Player: ${samplePlayer.name} (${samplePlayer.team}) - Sentiment: ${samplePlayer.sentiment}%`)
  }

  console.log('\n--- Done ---')
}

main().catch(console.error).finally(() => prisma.$disconnect())

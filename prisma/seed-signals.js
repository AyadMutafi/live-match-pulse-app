const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const clubs = [
    { name: 'PSG', tweets: ["2051647034709426388", "2051602712714682707"] },
    { name: 'Arsenal', tweets: ["2051714037524931007", "2051767344633114890"] },
    { name: 'Real Madrid', tweets: ["2051629170854338820", "2051673053537657048"] },
    { name: 'Barcelona', tweets: ["2050171556752421036", "2050500366882541789"] },
    { name: 'Manchester City', tweets: ["2051663818795749603", "2051632345245962265"] },
    { name: 'Atlético Madrid', tweets: ["2051721970278867355", "2051312011103899713"] },
    { name: 'Bayern Munich', tweets: ["2051686215779307611", "2050619030545821900"] }
  ];


  for (const club of clubs) {
    for (const tweetId of club.tweets) {
      await prisma.interceptedSignal.create({
        data: {
          team: club.name,
          handle: `@${club.name.replace(/\s+/g, '')}Hub`,
          text: `Intercepted intelligence regarding ${club.name} upcoming strategy.`,
          likes: 1200,
          retweets: 400,
          pulse: (Math.floor(Math.random() * 40) + 60).toString(),
          clubId: club.name, // Using name as ID for filtering
          tweetId: tweetId,
          createdAt: new Date()
        }
      });
    }
  }

  console.log('Club signals seeded.');
}

main().catch(console.error).finally(() => prisma.$disconnect());

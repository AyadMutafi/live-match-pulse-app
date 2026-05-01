const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const clubs = [
    { name: 'PSG', tweets: ['1777785584825946112', '1801264380757270528'] },
    { name: 'Arsenal', tweets: ['1777785584825946112', '1801264380757270528'] },
    { name: 'Real Madrid', tweets: ['1780703816113115136', '1801264380757270528'] },
    { name: 'FC Barcelona', tweets: ['1780703816113115136', '1801264380757270528'] },
    { name: 'Manchester City', tweets: ['1777771746243883008', '1801264380757270528'] },
    { name: 'Atlético Madrid', tweets: ['1780703816113115136', '1777771746243883008'] },
    { name: 'Bayern Munich', tweets: ['1777771746243883008', '1801264380757270528'] }
  ];


  for (const club of clubs) {
    for (const tweetId of club.tweets) {
      await prisma.interceptedSignal.create({
        data: {
          team: club.name,
          handle: `@${club.name.replace(/\s+/g, '')}Hub`,
          text: `Intercepted intelligence regarding ${club.name} upcoming strategy.`,
          likes: '1.2K',
          retweets: '400',
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

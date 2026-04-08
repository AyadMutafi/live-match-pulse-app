const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const sentimentCount = await prisma.sentiment.count();
  const sentiments = await prisma.sentiment.findMany({ take: 5, orderBy: { timestamp: 'desc' } });
  console.log('Sentiment Count:', sentimentCount);
  console.log('Recent Sentiments:', JSON.stringify(sentiments, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());

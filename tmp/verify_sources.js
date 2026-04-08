const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const latest = await prisma.sentiment.findMany({
    orderBy: { timestamp: 'desc' },
    take: 10,
    select: { source: true, score: true, themes: true }
  });
  console.log(JSON.stringify(latest, null, 2));
}

check();

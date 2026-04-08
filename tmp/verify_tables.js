const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  try {
    const users = await prisma.user.findMany();
    console.log('User table exists. Count:', users.length);
  } catch (e) {
    console.error('User table check failed:', e.message);
  } finally {
    await prisma.$disconnect();
  }
}

check();

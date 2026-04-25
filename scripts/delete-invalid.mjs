import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  await prisma.player.deleteMany({
    where: { name: { in: ['Willy Kambwala', 'João Félix'] } }
  });
  console.log('Deleted old players');
}
main().finally(() => prisma.$disconnect());

const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');
const prisma = new PrismaClient();

async function seed() {
  const password = crypto.createHash('sha256').update('admin123').digest('hex');
  const barcaPassword = crypto.createHash('sha256').update('specialist123').digest('hex');
  
  try {
    // Check if admin already exists
    const existing = await prisma.$queryRawUnsafe(`SELECT id FROM User WHERE username = 'admin'`);
    if (existing && existing.length > 0) {
      console.log('Admin already exists.');
    } else {
      await prisma.$executeRawUnsafe(
        `INSERT INTO User (id, username, password, role, createdAt) VALUES ('admin_root', 'admin', '${password}', 'ADMIN', '${new Date().toISOString()}')`
      );
      console.log('Admin user seeded.');
    }

    // Barca Specialist
    const existingBarca = await prisma.$queryRawUnsafe(`SELECT id FROM User WHERE username = 'barca_curator'`);
    if (existingBarca && existingBarca.length > 0) {
      console.log('Barca specialist already exists.');
    } else {
      await prisma.$executeRawUnsafe(
        `INSERT INTO User (id, username, password, role, assignedTeam, createdAt) VALUES ('barca_spec_id', 'barca_curator', '${barcaPassword}', 'EDITOR', 'FC Barcelona', '${new Date().toISOString()}')`
      );
      console.log('Barca specialist seeded.');
    }
  } catch (e) {
    console.error('Raw SQL Seed failed:', e.message);
  } finally {
    await prisma.$disconnect();
  }
}

seed();

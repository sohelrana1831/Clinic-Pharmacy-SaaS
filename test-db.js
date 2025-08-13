const { PrismaClient } = require('@prisma/client');

async function testDatabase() {
  const prisma = new PrismaClient();
  
  try {
    console.log('Testing database connection...');
    const start = Date.now();
    const count = await prisma.patient.count();
    const end = Date.now();
    console.log(`Found ${count} patients in ${end - start}ms`);
    
    const patients = await prisma.patient.findMany({ take: 5 });
    console.log('Sample patients:', patients.length);
    
    console.log('Database test completed successfully');
  } catch (error) {
    console.error('Database test failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testDatabase();

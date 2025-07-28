import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const sizes = [
    { size: 'XS', price: 449 },
    { size: 'S', price: 459 },
    { size: 'M', price: 469 },
    { size: 'L', price: 479 },
    { size: 'XL', price: 489 },
    { size: 'XXL', price: 499 },
  ];

  for (const size of sizes) {
    await prisma.customiseSize.upsert({
      where: { size: size.size },
      update: {},
      create: size,
    });
  }

  console.log('✅ Customise sizes seeded successfully.');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

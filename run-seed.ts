import { SeedService } from './src/lib/services/SeedService';
import { prisma } from './src/lib/prisma';

async function main() {
  console.log("Starting seed...");
  await SeedService.resetAndSeedAll();
  console.log("Seed complete.");
  await prisma.$disconnect();
}

main().catch(console.error);

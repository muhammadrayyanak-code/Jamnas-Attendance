import { SeedService } from './src/lib/services/SeedService';

async function main() {
  console.log("Starting seed...");
  try {
    await SeedService.resetAndSeedAll();
    console.log("Seed complete!");
  } catch (error) {
    console.error("Seed error:", error);
  }
}

main();

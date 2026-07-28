import { NextResponse } from 'next/server';
import { AdminService } from '@/lib/services/AdminService';
import { SeedService } from '@/lib/services/SeedService';

export async function GET() {
  try {
    // 1. Create Admin (if none exists)
    await AdminService.initDefaultAdmin();

    // 2. Reset and seed all event days and activities
    await SeedService.resetAndSeedAll();

    return NextResponse.json({ success: true, message: 'Database seeded successfully with new schedule!' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { EventDayService } from '@/lib/services/EventDayService';
import { ActivityService } from '@/lib/services/ActivityService';
import { SeedService } from '@/lib/services/SeedService';

export async function GET() {
  try {
    await SeedService.seedDaysIfEmpty();
    const days = await EventDayService.getAllDays();
    const activities = await ActivityService.getAllActivities(true);
    return NextResponse.json({ days, activities });
  } catch (error: any) {
    return NextResponse.json({ error: error.message, stack: error.stack }, { status: 500 });
  }
}

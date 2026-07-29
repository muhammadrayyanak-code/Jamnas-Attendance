export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const cookieStore = await cookies();
  if (!cookieStore.get('admin_token')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const search = (searchParams.get('search') || '').toLowerCase();

  try {
    // 1. Fetch activities
    const localActivities = await prisma.activity.findMany({
      include: { day: true }
    });

    const activitiesMap: Record<string, any> = {};
    localActivities.forEach(act => {
      activitiesMap[act.id] = act;
    });

    // 2. Fetch all participants and their attendances
    const where = search ? {
      OR: [
        { name: { contains: search, mode: 'insensitive' as const } },
        { kwarcab: { contains: search, mode: 'insensitive' as const } },
        { regu: { contains: search, mode: 'insensitive' as const } }
      ]
    } : {};

    const rawParticipants = await prisma.participant.findMany({
      where,
      include: {
        attendances: true
      },
      orderBy: { createdAt: 'desc' }
    });

    // 3. Map attendances with activity info and calculate points
    const participantsData = rawParticipants.map(p => {
      const pAttendances = p.attendances.map(a => {
        const actInfo = activitiesMap[a.activityId];
        return {
          ...a,
          activityName: actInfo ? actInfo.name : 'Unknown Activity',
          pointValue: actInfo ? actInfo.pointValue : 0
        };
      });

      return {
        ...p,
        attendances: pAttendances,
      };
    });

    const totalParticipants = await prisma.participant.count();

    // Checkins today (attendances created today)
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const todayCheckIns = await prisma.attendance.count({
      where: {
        timestamp: { gte: startOfToday }
      }
    });

    return NextResponse.json({
      participants: participantsData,
      activities: localActivities,
      stats: { totalParticipants, todayCheckIns }
    });
  } catch (error) {
    console.error("Dashboard fetch error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

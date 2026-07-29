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
    const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
    if (!webhookUrl) {
       return NextResponse.json({ error: 'Webhook URL not configured' }, { status: 500 });
    }

    const response = await fetch(`${webhookUrl}?action=dashboard`, { cache: 'no-store' });
    const data = await response.json();

    let participantsData = data.participants || [];
    let attendancesData = data.attendances || [];
    
    // Fetch activities from local db for mapping names and points
    const localActivities = await prisma.activity.findMany({
      include: { day: true }
    });
    
    const activitiesMap: Record<string, any> = {};
    localActivities.forEach(act => {
      activitiesMap[act.id] = act;
    });

    // Map attendances to participants
    participantsData = participantsData.map((p: any) => {
      const pAttendances = attendancesData.filter((a: any) => a.name === p.name).map((a: any) => {
         const actInfo = activitiesMap[a.activityId];
         return {
            ...a,
            activityName: actInfo ? actInfo.name : 'Unknown Activity',
            pointValue: actInfo ? actInfo.pointValue : 0
         };
      });
      
      const totalPoints = pAttendances.reduce((sum: number, att: any) => sum + att.pointValue, 0);
      
      return {
        ...p,
        attendances: pAttendances,
        totalPoints
      };
    });
    
    // Apply search filter if needed
    if (search) {
      participantsData = participantsData.filter((p: any) => 
        p.name.toLowerCase().includes(search) ||
        p.kwarcab.toLowerCase().includes(search) ||
        p.regu.toLowerCase().includes(search)
      );
    }

    return NextResponse.json({
      participants: participantsData,
      activities: localActivities,
      attendances: attendancesData,
      stats: data.stats || { totalParticipants: 0, todayCheckIns: 0 }
    });
  } catch (error) {
    console.error("Dashboard fetch error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

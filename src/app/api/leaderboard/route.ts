import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const revalidate = 10; // Cache for 10 seconds to allow fast updates

export async function GET() {
  try {
    const participants = await prisma.participant.findMany({
      select: { kwarcab: true, totalPoints: true }
    });

    const kwarcabPoints: Record<string, number> = {};
    
    // Aggregate by Kwarcab
    participants.forEach(p => {
      const k = p.kwarcab.trim();
      if (!k) return;
      if (!kwarcabPoints[k]) {
        kwarcabPoints[k] = 0;
      }
      kwarcabPoints[k] += p.totalPoints;
    });

    // Convert to array and sort
    const leaderboard = Object.entries(kwarcabPoints)
      .map(([kwarcab, points]) => ({ kwarcab, points }))
      .sort((a, b) => b.points - a.points);

    return NextResponse.json({ leaderboard });
  } catch (error) {
    console.error('Leaderboard error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

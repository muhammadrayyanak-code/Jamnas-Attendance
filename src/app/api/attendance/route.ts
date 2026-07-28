import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ParticipantService } from '@/lib/services/ParticipantService';

export async function POST(req: Request) {
  try {
    const data = await req.json();

    if (!data.nta || !data.name || !data.kwarcab || !data.regu || !data.activityId) {
      return NextResponse.json({ error: 'Data tidak lengkap' }, { status: 400 });
    }

    // Use ParticipantService to find or create the participant based on NTA
    const participant = await ParticipantService.findForAttendance(
      data.nta,
      data.name,
      data.kwarcab,
      data.regu
    );

    // Verify activity exists
    const activity = await prisma.activity.findUnique({
      where: { id: data.activityId }
    });

    if (!activity) {
      return NextResponse.json({ error: 'Aktivitas tidak ditemukan' }, { status: 404 });
    }

    // Check if already checked in
    const existing = await prisma.attendance.findUnique({
      where: {
        participantId_activityId: {
          participantId: participant.id,
          activityId: data.activityId
        }
      }
    });

    if (existing) {
      return NextResponse.json({ error: 'Anda sudah presensi untuk aktivitas ini' }, { status: 400 });
    }

    // Record attendance
    await prisma.attendance.create({
      data: {
        participantId: participant.id,
        activityId: data.activityId
      }
    });

    // Recalculate total points
    await ParticipantService.calculatePoints(participant.id);

    // Send to Google Sheets (Webhook)
    const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
    if (webhookUrl) {
      try {
        const sheetRes = await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'attendance',
            nta: data.nta,
            name: data.name,
            kwarcab: data.kwarcab,
            regu: data.regu,
            activityId: data.activityId,
            activityName: activity.name
          }),
        });
        
        const sheetResult = await sheetRes.json();
        if (sheetResult.error) {
          console.warn("Google Sheets Error:", sheetResult.error);
        }
      } catch (sheetErr) {
        console.error("Failed to sync with Google Sheets:", sheetErr);
      }
    }

    return NextResponse.json({ 
      success: true, 
      participant,
      pointsAwarded: activity.pointValue 
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

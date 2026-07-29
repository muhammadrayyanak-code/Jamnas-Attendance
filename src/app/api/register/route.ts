import { NextResponse } from 'next/server';
import { ParticipantService } from '@/lib/services/ParticipantService';

export async function POST(req: Request) {
  try {
    const data = await req.json();

    if (!data.name || !data.kwarcab || !data.regu || !data.ttl || !data.asalSekolah || !data.noWa || !data.alergiMakanan) {
      return NextResponse.json({ error: 'Semua kolom wajib diisi' }, { status: 400 });
    }

    const participant = await ParticipantService.registerParticipant({
      name: data.name,
      kwarcab: data.kwarcab,
      regu: data.regu,
      agama: data.agama,
      ttl: data.ttl,
      asalSekolah: data.asalSekolah,
      noWa: data.noWa,
      alergiMakanan: data.alergiMakanan
    });

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
            action: 'register',
            ...data
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

    return NextResponse.json({ success: true, participant });
  } catch (error: any) {
    console.error("Register Error:", error);
    return NextResponse.json(
      { error: error?.message || 'Terjadi kesalahan pada server' }, 
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import ExcelJS from 'exceljs';

export async function GET(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value || request.headers.get('authorization')?.split(' ')[1];
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const dayId = searchParams.get('dayId');

  try {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Scout Attendance System';
    workbook.lastModifiedBy = 'Admin';
    workbook.created = new Date();
    workbook.modified = new Date();

    // Fetch days to export
    const whereDay = dayId && dayId !== 'all' ? { id: dayId } : {};
    const days = await prisma.eventDay.findMany({
      where: whereDay,
      orderBy: { date: 'asc' },
      include: {
        activities: {
          orderBy: { startTime: 'asc' }
        }
      }
    });

    if (days.length === 0) {
      return NextResponse.json({ error: 'Hari tidak ditemukan' }, { status: 404 });
    }

    // Fetch all participants with their attendances
    const participants = await prisma.participant.findMany({
      include: { attendances: true },
      orderBy: [
        { kwarcab: 'asc' },
        { regu: 'asc' },
        { name: 'asc' }
      ]
    });

    for (const day of days) {
      const sheetName = day.name.replace(/[\\/*?:[\]]/g, ''); // sanitize sheet name
      const sheet = workbook.addWorksheet(sheetName.substring(0, 31), {
        views: [{ state: 'frozen', xSplit: 8, ySplit: 1 }]
      });

      // Define columns
      const baseColumns = [
        { header: 'No', key: 'no', width: 5 },
        { header: 'Nama Lengkap', key: 'name', width: 30 },
        { header: 'Kwarcab', key: 'kwarcab', width: 20 },
        { header: 'Regu', key: 'regu', width: 15 },
        { header: 'Tanggal Lahir', key: 'ttl', width: 20 },
        { header: 'Asal Sekolah', key: 'asalSekolah', width: 25 },
        { header: 'No WA', key: 'noWa', width: 20 },
        { header: 'Alergi Makanan', key: 'alergiMakanan', width: 20 },
      ];

      const activityColumns = day.activities.map(act => ({
        header: act.name,
        key: act.id,
        width: 15
      }));

      const endColumns = [
        { header: 'Total Poin Hari Ini', key: 'dayPoints', width: 20 }
      ];

      sheet.columns = [...baseColumns, ...activityColumns, ...endColumns];

      // Style header row
      const headerRow = sheet.getRow(1);
      headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      headerRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF004B93' } // Dark blue
      };
      headerRow.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
      headerRow.height = 30;

      // Add data
      let rowNum = 1;
      for (const p of participants) {
        let dayPoints = 0;
        const rowData: any = {
          no: rowNum++,
          name: p.name,
          kwarcab: p.kwarcab,
          regu: p.regu,
          ttl: p.ttl || '-',
          asalSekolah: p.asalSekolah || '-',
          noWa: p.noWa ? `'${p.noWa}` : '-', // prepend quote to prevent scientific notation in excel
          alergiMakanan: p.alergiMakanan || '-'
        };

        // Check attendances for this day
        for (const act of day.activities) {
          const attended = p.attendances.some(a => a.activityId === act.id);
          if (attended) {
            rowData[act.id] = '✓ Hadir';
            dayPoints += act.pointValue;
          } else {
            rowData[act.id] = '-';
          }
        }

        rowData['dayPoints'] = dayPoints;

        const row = sheet.addRow(rowData);
        
        // Style row based on attendance
        for (let i = 0; i < day.activities.length; i++) {
          const act = day.activities[i];
          const cell = row.getCell(5 + i); // 5th column onwards
          cell.alignment = { horizontal: 'center' };
          if (cell.value === '✓ Hadir') {
            cell.font = { color: { argb: 'FF008000' }, bold: true }; // Green
          } else {
            cell.font = { color: { argb: 'FF999999' } }; // Gray
          }
        }
        
        row.getCell('dayPoints').font = { bold: true };
        row.getCell('dayPoints').alignment = { horizontal: 'center' };
      }
    }

    const buffer = await workbook.xlsx.writeBuffer();

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="Laporan_Kehadiran_${dayId === 'all' || !dayId ? 'Semua_Hari' : 'Harian'}.xlsx"`
      }
    });

  } catch (error: any) {
    console.error("Export error:", error);
    return NextResponse.json({ error: 'Gagal men-generate file Excel' }, { status: 500 });
  }
}

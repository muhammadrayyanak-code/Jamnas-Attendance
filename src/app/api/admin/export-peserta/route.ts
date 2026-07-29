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

  try {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Scout Attendance System';
    workbook.lastModifiedBy = 'Admin';
    workbook.created = new Date();
    workbook.modified = new Date();

    // Fetch all participants
    const participants = await prisma.participant.findMany({
      orderBy: [
        { kwarcab: 'asc' },
        { regu: 'asc' },
        { name: 'asc' }
      ]
    });

    const sheet = workbook.addWorksheet('Data Registrasi', {
      views: [{ state: 'frozen', xSplit: 3, ySplit: 1 }]
    });

    // Define columns
    sheet.columns = [
      { header: 'No', key: 'no', width: 5 },
      { header: 'Nama Lengkap', key: 'name', width: 30 },
      { header: 'Kwarcab', key: 'kwarcab', width: 20 },
      { header: 'Regu', key: 'regu', width: 20 },
      { header: 'Agama', key: 'agama', width: 15 },
      { header: 'Tempat, Tanggal Lahir', key: 'ttl', width: 25 },
      { header: 'Asal Sekolah / Pangkalan', key: 'asalSekolah', width: 30 },
      { header: 'No Whatsapp', key: 'noWa', width: 20 },
      { header: 'Alergi Makanan / Obat', key: 'alergiMakanan', width: 30 },
      { header: 'Total Poin', key: 'totalPoints', width: 15 },
      { header: 'Tanggal Daftar', key: 'createdAt', width: 20 },
    ];

    // Style header
    const headerRow = sheet.getRow(1);
    headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    headerRow.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    
    headerRow.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFC27A29' } // Primary color
      };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
    });
    headerRow.height = 30;

    // Add rows
    participants.forEach((p, index) => {
      const row = sheet.addRow({
        no: index + 1,
        name: p.name,
        kwarcab: p.kwarcab,
        regu: p.regu,
        agama: p.agama || '-',
        ttl: p.ttl || '-',
        asalSekolah: p.asalSekolah || '-',
        noWa: p.noWa || '-',
        alergiMakanan: p.alergiMakanan || '-',
        totalPoints: p.totalPoints,
        createdAt: p.createdAt.toLocaleString('id-ID'),
      });

      row.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin', color: { argb: 'FFDDDDDD' } },
          left: { style: 'thin', color: { argb: 'FFDDDDDD' } },
          bottom: { style: 'thin', color: { argb: 'FFDDDDDD' } },
          right: { style: 'thin', color: { argb: 'FFDDDDDD' } }
        };
      });

      // Align points to center
      row.getCell('totalPoints').alignment = { horizontal: 'center' };
      row.getCell('no').alignment = { horizontal: 'center' };
    });

    // Generate buffer
    const buffer = await workbook.xlsx.writeBuffer();

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename=Data_Registrasi_Peserta.xlsx'
      }
    });

  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

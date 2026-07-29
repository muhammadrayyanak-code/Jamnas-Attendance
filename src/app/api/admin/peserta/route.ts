export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token');
  if (!token) {
    const allCookies = cookieStore.getAll().map(c => c.name).join(', ');
    return NextResponse.json({ error: `Unauthorized. Server sees cookies: [${allCookies}]` }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search') || '';

  try {
    const participants = await prisma.participant.findMany({
      where: search ? {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { regu: { contains: search, mode: 'insensitive' } },
          { kwarcab: { contains: search, mode: 'insensitive' } }
        ]
      } : undefined,
      orderBy: [
        { kwarcab: 'asc' },
        { regu: 'asc' },
        { name: 'asc' }
      ]
    });

    return NextResponse.json({ participants });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

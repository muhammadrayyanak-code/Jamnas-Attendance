import { NextResponse } from 'next/server';
import { ActivityService } from '@/lib/services/ActivityService';
import { cookies } from 'next/headers';

async function checkAuth() {
  const cookieStore = await cookies();
  if (!cookieStore.get('admin_token')) throw new Error('Unauthorized');
}

export async function POST(request: Request) {
  try {
    await checkAuth();
    const { name, pointValue, dayId } = await request.json();
    const activity = await ActivityService.createActivity(name, parseInt(pointValue), dayId);
    return NextResponse.json({ success: true, activity });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: error.message === 'Unauthorized' ? 401 : 400 });
  }
}

export async function PUT(request: Request) {
  try {
    await checkAuth();
    const { id, name, pointValue } = await request.json();
    const activity = await ActivityService.updateActivity(id, name, parseInt(pointValue));
    return NextResponse.json({ success: true, activity });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  try {
    await checkAuth();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) throw new Error('ID required');
    await ActivityService.deleteActivity(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

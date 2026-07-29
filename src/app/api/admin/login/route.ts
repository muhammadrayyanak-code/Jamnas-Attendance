import { NextResponse } from 'next/server';
import { AdminService } from '@/lib/services/AdminService';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    await AdminService.initDefaultAdmin();
    const { username, password } = await request.json();

    const isAuthenticated = await AdminService.authenticate(username, password);

    if (isAuthenticated) {
      const cookieStore = await cookies();
      // Simple cookie based auth for this context
      cookieStore.set('admin_token', 'authenticated', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 60 * 60 * 24 * 30 // 30 days
      });
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

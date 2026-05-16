import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const ADMIN_COOKIE_NAME = 'codepilot_admin_auth';
const DEFAULT_ADMIN_EMAIL = 'happy-dadz@codepilot.dev';

export async function GET() {
  const cookieStore = await cookies();
  const adminCookie = cookieStore.get(ADMIN_COOKIE_NAME);

  if (adminCookie?.value !== 'owner') {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  return NextResponse.json({
    authenticated: true,
    user: {
      id: 'owner-admin',
      email: process.env.ADMIN_EMAIL || DEFAULT_ADMIN_EMAIL,
      role: 'admin',
      user_metadata: {
        full_name: 'Owner Admin',
      },
    },
  });
}

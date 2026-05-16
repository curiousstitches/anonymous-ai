import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const ADMIN_COOKIE_NAME = 'codepilot_admin_auth';
const DEFAULT_ADMIN_EMAIL = 'happy-dadz@codepilot.dev';
const DEFAULT_ADMIN_PASSWORD = '1234Admin';

function getAdminConfig() {
  return {
    email: process.env.ADMIN_EMAIL || DEFAULT_ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD || DEFAULT_ADMIN_PASSWORD,
  };
}

function buildAdminUser(email: string) {
  return {
    id: 'owner-admin',
    email,
    role: 'admin',
    user_metadata: {
      full_name: 'Owner Admin',
    },
  };
}

export async function POST(request: Request) {
  const body = await request.json();
  const { email, password } = body ?? {};
  const admin = getAdminConfig();

  if (typeof email !== 'string' || typeof password !== 'string') {
    return NextResponse.json({ error: 'Invalid credentials payload.' }, { status: 400 });
  }

  if (email.trim().toLowerCase() !== admin.email.toLowerCase() || password !== admin.password) {
    return NextResponse.json({ error: 'Invalid admin credentials.' }, { status: 401 });
  }

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE_NAME, 'owner', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });

  return NextResponse.json({ user: buildAdminUser(admin.email) });
}

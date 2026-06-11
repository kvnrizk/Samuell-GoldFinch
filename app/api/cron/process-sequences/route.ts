import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json(
    {
      ok: false,
      status: 'disabled',
      message:
        'Automation cron is disabled in Phase 3. Lead forms still save to Payload and send direct Resend emails.',
    },
    { status: 410 },
  );
}

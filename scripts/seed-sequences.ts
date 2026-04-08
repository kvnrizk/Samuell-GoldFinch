// ---------------------------------------------------------------------------
// Seed Default Automation Sequences
// Run with: PAYLOAD_EMAIL=x PAYLOAD_PASSWORD=y npx tsx scripts/seed-sequences.ts
//
// Connects to the local Payload REST API and creates the default automation
// sequences if none exist. Safe to re-run (skips if sequences already exist).
//
// Environment variables:
//   PAYLOAD_URL      — Base URL (default: http://localhost:3000)
//   PAYLOAD_EMAIL    — Admin user email
//   PAYLOAD_PASSWORD — Admin user password
// ---------------------------------------------------------------------------

const API_URL = process.env.PAYLOAD_URL || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
const ADMIN_EMAIL = process.env.PAYLOAD_EMAIL || '';
const ADMIN_PASSWORD = process.env.PAYLOAD_PASSWORD || '';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function login(): Promise<string> {
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    throw new Error(
      'Missing credentials. Set PAYLOAD_EMAIL and PAYLOAD_PASSWORD env vars.\n' +
      'Example: PAYLOAD_EMAIL=admin@example.com PAYLOAD_PASSWORD=secret npx tsx scripts/seed-sequences.ts',
    );
  }

  const res = await fetch(`${API_URL}/api/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Login failed (${res.status}): ${text}`);
  }

  const data = await res.json();
  const token: string = data.token;
  if (!token) throw new Error('Login succeeded but no token returned');
  console.log(`Authenticated as ${ADMIN_EMAIL}`);
  return token;
}

async function checkExistingSequences(token: string): Promise<number> {
  const res = await fetch(`${API_URL}/api/automation-sequences?limit=1&depth=0`, {
    headers: { Authorization: `JWT ${token}` },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to check existing sequences (${res.status}): ${text}`);
  }

  const data = await res.json();
  return data.totalDocs || 0;
}

async function createSequence(
  data: Record<string, unknown>,
  token: string,
): Promise<{ ok: boolean; name: string; error?: string }> {
  const name = data.name as string;

  const res = await fetch(`${API_URL}/api/automation-sequences`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `JWT ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const text = await res.text();
    return { ok: false, name, error: `(${res.status}) ${text}` };
  }

  return { ok: true, name };
}

// ---------------------------------------------------------------------------
// Default sequences
//
// NOTE on emailBody: The AutomationSequences collection uses richText (Lexical
// editor) for emailBody. Seeding Lexical JSON via the REST API is fragile, so
// we skip emailBody here. Sam can fill in email templates via the CMS admin.
//
// NOTE on triggerCollection: The collection only allows 'inquiries' or
// 'venue-inquiries' (no 'both' option). The "Status Update" sequence is split
// into two entries — one for each collection.
// ---------------------------------------------------------------------------

const defaultSequences: Array<Record<string, unknown>> = [
  {
    name: 'New Lead Alert',
    triggerType: 'on-create',
    triggerCollection: 'inquiries',
    delayHours: 0,
    channels: ['admin-alert', 'email'],
    emailSubject: 'New {{service}} inquiry from {{name}}',
    whatsappMessage: 'New {{service}} inquiry from {{name}}',
    targetAudience: 'admin',
    isActive: true,
    order: 1,
  },
  {
    name: 'Venue Lead Alert',
    triggerType: 'on-create',
    triggerCollection: 'venue-inquiries',
    delayHours: 0,
    channels: ['admin-alert', 'email', 'whatsapp'],
    emailSubject: 'New venue lead: {{venueName}} — {{budget}}/mo',
    whatsappMessage: 'New venue lead: {{venueName}} — {{budget}}/mo',
    targetAudience: 'admin',
    isActive: true,
    order: 2,
  },
  {
    name: 'Day 1 Follow-Up',
    triggerType: 'on-create',
    triggerCollection: 'inquiries',
    triggerStatus: 'new',
    delayHours: 24,
    channels: ['email'],
    emailSubject: 'We received your inquiry, {{name}}',
    // emailBody skipped — fill in via CMS (Lexical rich text)
    targetAudience: 'lead',
    isActive: true,
    order: 3,
  },
  {
    name: 'Day 3 Nudge',
    triggerType: 'on-create',
    triggerCollection: 'inquiries',
    triggerStatus: 'new',
    delayHours: 72,
    channels: ['email'],
    emailSubject: 'Following up on your {{service}} request',
    // emailBody skipped — fill in via CMS
    targetAudience: 'lead',
    isActive: true,
    order: 4,
  },
  {
    name: 'Day 7 Last Chance',
    triggerType: 'on-create',
    triggerCollection: 'inquiries',
    triggerStatus: 'new',
    delayHours: 168,
    channels: ['email'],
    emailSubject: 'Still interested in {{service}}?',
    // emailBody skipped — fill in via CMS
    targetAudience: 'lead',
    isActive: true,
    order: 5,
  },
  {
    name: 'Venue Day 1',
    triggerType: 'on-create',
    triggerCollection: 'venue-inquiries',
    triggerStatus: 'qualified',
    delayHours: 24,
    channels: ['email', 'whatsapp'],
    emailSubject: 'Thanks for your interest in Kolasi, {{name}}',
    whatsappMessage:
      'Hi {{name}}, thanks for your interest in Kolasi for {{venueName}}! Would you like to schedule a quick call to discuss? {{calendlyUrl}}',
    // emailBody skipped — fill in via CMS
    targetAudience: 'lead',
    isActive: true,
    order: 6,
  },
  {
    name: 'Venue Day 3',
    triggerType: 'on-create',
    triggerCollection: 'venue-inquiries',
    triggerStatus: 'qualified',
    delayHours: 72,
    channels: ['email'],
    emailSubject: 'Following up on {{venueName}}',
    // emailBody skipped — fill in via CMS
    targetAudience: 'lead',
    isActive: true,
    order: 7,
  },
  {
    // Status Update — General Inquiries
    name: 'Status Update (Inquiries)',
    triggerType: 'on-status-change',
    triggerCollection: 'inquiries',
    delayHours: 0,
    channels: ['admin-alert'],
    targetAudience: 'admin',
    isActive: true,
    order: 8,
  },
  {
    // Status Update — Venue Inquiries
    name: 'Status Update (Venues)',
    triggerType: 'on-status-change',
    triggerCollection: 'venue-inquiries',
    delayHours: 0,
    channels: ['admin-alert'],
    targetAudience: 'admin',
    isActive: true,
    order: 9,
  },
  {
    name: 'Deal Won',
    triggerType: 'on-status-change',
    triggerCollection: 'venue-inquiries',
    triggerStatus: 'signed',
    delayHours: 0,
    channels: ['admin-alert', 'email'],
    emailSubject: 'Deal closed: {{venueName}} — {{contractValue}}',
    whatsappMessage: '{{venueName}} signed — {{contractValue}}!',
    targetAudience: 'admin',
    isActive: true,
    order: 10,
  },
];

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log('\nSeed Automation Sequences');
  console.log(`API: ${API_URL}\n`);

  // 1. Authenticate
  const token = await login();

  // 2. Check if sequences already exist
  const existingCount = await checkExistingSequences(token);
  if (existingCount > 0) {
    console.log(
      `\nFound ${existingCount} existing sequence(s). Skipping seed to avoid duplicates.`,
    );
    console.log(
      'To re-seed, first delete all sequences in the admin panel, then run this script again.\n',
    );
    return;
  }

  // 3. Create all default sequences
  console.log(`\nCreating ${defaultSequences.length} default sequences...\n`);

  let created = 0;
  let failed = 0;

  for (let i = 0; i < defaultSequences.length; i++) {
    const seq = defaultSequences[i];
    const result = await createSequence(seq, token);

    if (result.ok) {
      created++;
      console.log(`  [${i + 1}/${defaultSequences.length}] Created: ${result.name}`);
    } else {
      failed++;
      console.error(
        `  [${i + 1}/${defaultSequences.length}] FAILED: ${result.name} — ${result.error}`,
      );
    }
  }

  // 4. Summary
  console.log('\n========================================');
  console.log('SUMMARY');
  console.log('========================================');
  console.log(`Created: ${created}/${defaultSequences.length} sequences`);
  if (failed > 0) {
    console.log(`Failed:  ${failed}/${defaultSequences.length} sequences`);
  }
  console.log('========================================');
  console.log(
    '\nNext steps:',
    '\n  1. Open the admin panel > Automation > Automation Sequences',
    '\n  2. Fill in email body templates (rich text) for lead-facing sequences',
    '\n  3. Toggle isActive on/off as needed\n',
  );
}

main().catch(console.error);

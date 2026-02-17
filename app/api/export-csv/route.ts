import { NextRequest, NextResponse } from 'next/server';
import { getPayload } from '@/lib/payload';
import { headers as getHeaders } from 'next/headers';

function escapeCSV(value: unknown): string {
  if (value == null) return '';
  const str = String(value);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export async function GET(req: NextRequest) {
  const payload = await getPayload();

  // Authenticate: require a logged-in Payload user
  const headersList = await getHeaders();
  const { user } = await payload.auth({ headers: headersList });
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const collection = searchParams.get('collection');

  if (!collection || !['inquiries', 'venue-inquiries'].includes(collection)) {
    return NextResponse.json({ error: 'Invalid collection' }, { status: 400 });
  }

  try {
    // Try to get user from cookies
    const result = await payload.find({
      collection: collection as 'inquiries' | 'venue-inquiries',
      limit: 10000,
      sort: '-createdAt',
      depth: 0,
    });

    const docs = result.docs;
    if (docs.length === 0) {
      return new NextResponse('No data to export', { status: 404 });
    }

    let headers: string[];
    let rows: string[][];

    if (collection === 'inquiries') {
      headers = ['Name', 'Email', 'Phone', 'Service', 'Event Date', 'Guest Count', 'Budget', 'Details', 'Source', 'Status', 'Internal Notes', 'Created At'];
      rows = docs.map((doc: any) => [
        escapeCSV(doc.name),
        escapeCSV(doc.email),
        escapeCSV(doc.phone),
        escapeCSV(doc.service),
        escapeCSV(doc.eventDate),
        escapeCSV(doc.guestCount),
        escapeCSV(doc.budget),
        escapeCSV(doc.details),
        escapeCSV(doc.source),
        escapeCSV(doc.status),
        escapeCSV(doc.internalNotes),
        escapeCSV(doc.createdAt ? new Date(doc.createdAt).toISOString() : ''),
      ]);
    } else {
      headers = ['Venue Name', 'Address', 'Website', 'Instagram', 'Venue Type', 'Capacity', 'Has Dance Pocket', 'Current Programming', 'Goals', 'Monthly Budget', 'Decision Maker', 'Contact Name', 'WhatsApp', 'Email', 'Timeline', 'Source', 'Status', 'Internal Notes', 'Created At'];
      rows = docs.map((doc: any) => [
        escapeCSV(doc.venueName),
        escapeCSV(doc.address),
        escapeCSV(doc.website),
        escapeCSV(doc.instagram),
        escapeCSV(doc.venueType),
        escapeCSV(doc.capacity),
        escapeCSV(doc.hasDancePocket ? 'Yes' : 'No'),
        escapeCSV(doc.currentProgramming),
        escapeCSV(Array.isArray(doc.goal) ? doc.goal.join(', ') : doc.goal),
        escapeCSV(doc.monthlyBudget),
        escapeCSV(doc.decisionMaker),
        escapeCSV(doc.contactName),
        escapeCSV(doc.contactWhatsApp),
        escapeCSV(doc.contactEmail),
        escapeCSV(doc.timeline),
        escapeCSV(doc.source),
        escapeCSV(doc.status),
        escapeCSV(doc.internalNotes),
        escapeCSV(doc.createdAt ? new Date(doc.createdAt).toISOString() : ''),
      ]);
    }

    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const filename = `${collection}-export-${new Date().toISOString().slice(0, 10)}.csv`;

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (err) {
    console.error('CSV export error:', err);
    return NextResponse.json({ error: 'Export failed' }, { status: 500 });
  }
}

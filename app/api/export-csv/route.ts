import { NextRequest, NextResponse } from 'next/server';
import { getPayload } from '@/lib/payload';
import { buildCSV, isExportCollection } from '@/lib/csv-export';
import { headers as getHeaders } from 'next/headers';

export async function GET(req: NextRequest) {
  const payload = await getPayload();

  // Authenticate: export includes PII (internal notes, phone, WhatsApp) — admin-only
  const headersList = await getHeaders();
  const { user } = await payload.auth({ headers: headersList });
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (user.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const collection = searchParams.get('collection');

  if (!collection || !isExportCollection(collection)) {
    return NextResponse.json({ error: 'Invalid collection' }, { status: 400 });
  }

  try {
    // Run the query with the authenticated req context so collection-level
    // access control is enforced (no silent elevation via local API).
    const authedReq = { ...req, user } as unknown as Parameters<typeof payload.find>[0]['req'];
    const result = await payload.find({
      collection: collection as 'inquiries' | 'venue-inquiries',
      limit: 10000,
      sort: '-createdAt',
      depth: 0,
      req: authedReq,
    });

    const docs = result.docs;
    if (docs.length === 0) {
      return new NextResponse('No data to export', { status: 404 });
    }

    const csv = buildCSV(collection, docs as unknown as Record<string, unknown>[]);
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

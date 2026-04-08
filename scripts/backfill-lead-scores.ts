// ---------------------------------------------------------------------------
// Backfill Lead Scores
// Run with: npx tsx scripts/backfill-lead-scores.ts
//
// Connects to the local Payload REST API, fetches all inquiries and venue
// inquiries, calculates lead scores, and PATCHes them back.
//
// Environment variables:
//   PAYLOAD_URL     — Base URL (default: http://localhost:3000)
//   PAYLOAD_EMAIL   — Admin user email
//   PAYLOAD_PASSWORD — Admin user password
// ---------------------------------------------------------------------------

import {
  calculateInquiryScore,
  calculateVenueScore,
  type InquiryScoreInput,
  type VenueScoreInput,
  type ScoreResult,
  type VenueScoreResult,
} from '../lib/lead-scoring';

const API_URL = process.env.PAYLOAD_URL || 'http://localhost:3000';
const ADMIN_EMAIL = process.env.PAYLOAD_EMAIL || '';
const ADMIN_PASSWORD = process.env.PAYLOAD_PASSWORD || '';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function login(): Promise<string> {
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    throw new Error(
      'Missing credentials. Set PAYLOAD_EMAIL and PAYLOAD_PASSWORD env vars.\n' +
      'Example: PAYLOAD_EMAIL=admin@example.com PAYLOAD_PASSWORD=secret npx tsx scripts/backfill-lead-scores.ts'
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

async function fetchAll(collection: string, token: string): Promise<any[]> {
  const allDocs: any[] = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const res = await fetch(
      `${API_URL}/api/${collection}?limit=100&page=${page}&depth=0`,
      { headers: { Authorization: `JWT ${token}` } },
    );

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Failed to fetch ${collection} page ${page} (${res.status}): ${text}`);
    }

    const data = await res.json();
    const docs: any[] = data.docs || [];
    allDocs.push(...docs);
    hasMore = data.hasNextPage === true;
    page++;
  }

  return allDocs;
}

async function patchDoc(
  collection: string,
  id: string,
  payload: Record<string, unknown>,
  token: string,
): Promise<boolean> {
  const res = await fetch(`${API_URL}/api/${collection}/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `JWT ${token}`,
    },
    body: JSON.stringify(payload),
  });
  return res.ok;
}

// ---------------------------------------------------------------------------
// Scoring logic (maps raw API docs to scoring inputs)
// ---------------------------------------------------------------------------

function scoreInquiry(doc: any): ScoreResult {
  const input: InquiryScoreInput = {
    service: doc.service || null,
    budget: doc.budget || null,
    eventDate: doc.eventDate || null,
    phone: doc.phone || null,
    email: doc.email || '',
    details: doc.details || null,
    guestCount: doc.guestCount || null,
  };
  return calculateInquiryScore(input);
}

function scoreVenue(doc: any): VenueScoreResult {
  const input: VenueScoreInput = {
    monthlyBudget: doc.monthlyBudget || 'under-2k',
    capacity: doc.capacity || null,
    decisionMaker: doc.decisionMaker || null,
    timeline: doc.timeline || null,
    goal: doc.goal || null,
    hasDancePocket: doc.hasDancePocket || null,
    roomPhotos: doc.roomPhotos || null,
    instagram: doc.instagram || null,
  };
  return calculateVenueScore(input);
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log(`\nBackfill Lead Scores`);
  console.log(`API: ${API_URL}\n`);

  // 1. Authenticate
  const token = await login();

  let totalInquiries = 0;
  let totalVenues = 0;
  let failedInquiries = 0;
  let failedVenues = 0;
  let inquiryScoreSum = 0;
  let venueScoreSum = 0;

  // 2. Process general inquiries
  console.log('\n--- General Inquiries ---');
  const inquiries = await fetchAll('inquiries', token);
  console.log(`Found ${inquiries.length} inquiries`);

  for (let i = 0; i < inquiries.length; i++) {
    const doc = inquiries[i];
    try {
      const result = scoreInquiry(doc);
      const ok = await patchDoc('inquiries', doc.id, {
        leadScore: result.score,
        leadTier: result.tier,
        estimatedValue: result.estimatedValue,
      }, token);

      if (ok) {
        totalInquiries++;
        inquiryScoreSum += result.score;
        console.log(
          `  Scored inquiry ${i + 1}/${inquiries.length}: ${doc.name || 'Unnamed'} — score ${result.score} (${result.tier})`
        );
      } else {
        failedInquiries++;
        console.error(`  FAILED inquiry ${i + 1}/${inquiries.length}: ${doc.name || doc.id} — PATCH returned error`);
      }
    } catch (err) {
      failedInquiries++;
      console.error(`  FAILED inquiry ${i + 1}/${inquiries.length}: ${doc.name || doc.id} — ${err}`);
    }
  }

  // 3. Process venue inquiries
  console.log('\n--- Venue Inquiries ---');
  const venues = await fetchAll('venue-inquiries', token);
  console.log(`Found ${venues.length} venue inquiries`);

  for (let i = 0; i < venues.length; i++) {
    const doc = venues[i];
    try {
      const result = scoreVenue(doc);
      const ok = await patchDoc('venue-inquiries', doc.id, {
        leadScore: result.score,
        leadTier: result.tier,
        estimatedValue: result.estimatedValue,
        monthlyValue: result.monthlyValue,
        annualValue: result.annualValue,
        // Note: contractValue is NOT set here to avoid overwriting Sam's manual edits
      }, token);

      if (ok) {
        totalVenues++;
        venueScoreSum += result.score;
        console.log(
          `  Scored venue ${i + 1}/${venues.length}: ${doc.venueName || 'Unnamed'} — score ${result.score} (${result.tier})`
        );
      } else {
        failedVenues++;
        console.error(`  FAILED venue ${i + 1}/${venues.length}: ${doc.venueName || doc.id} — PATCH returned error`);
      }
    } catch (err) {
      failedVenues++;
      console.error(`  FAILED venue ${i + 1}/${venues.length}: ${doc.venueName || doc.id} — ${err}`);
    }
  }

  // 4. Summary
  const totalScored = totalInquiries + totalVenues;
  const totalFailed = failedInquiries + failedVenues;
  const avgScore = totalScored > 0
    ? Math.round((inquiryScoreSum + venueScoreSum) / totalScored)
    : 0;

  console.log('\n========================================');
  console.log('SUMMARY');
  console.log('========================================');
  console.log(`Backfilled ${totalInquiries} inquiries, ${totalVenues} venue inquiries.`);
  if (totalFailed > 0) {
    console.log(`Failed: ${failedInquiries} inquiries, ${failedVenues} venue inquiries.`);
  }
  console.log(`Avg score: ${avgScore}`);
  console.log('========================================\n');
}

main().catch(console.error);

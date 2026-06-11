export type ExportCollection = 'inquiries' | 'venue-inquiries';

type ExportDoc = Record<string, unknown>;

interface CSVColumn {
  header: string;
  value: (doc: ExportDoc) => unknown;
}

export function escapeCSV(value: unknown): string {
  if (value == null) return '';
  const str = String(value);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function isoDate(value: unknown): string {
  if (!value) return '';
  return new Date(String(value)).toISOString();
}

const columns: Record<ExportCollection, CSVColumn[]> = {
  inquiries: [
    { header: 'Name', value: (doc) => doc.name },
    { header: 'Email', value: (doc) => doc.email },
    { header: 'Phone', value: (doc) => doc.phone },
    { header: 'Service', value: (doc) => doc.service },
    { header: 'Event Date', value: (doc) => doc.eventDate },
    { header: 'Guest Count', value: (doc) => doc.guestCount },
    { header: 'Budget', value: (doc) => doc.budget },
    { header: 'Details', value: (doc) => doc.details },
    { header: 'Source', value: (doc) => doc.source },
    { header: 'Status', value: (doc) => doc.status },
    { header: 'Internal Notes', value: (doc) => doc.internalNotes },
    { header: 'Created At', value: (doc) => isoDate(doc.createdAt) },
  ],
  'venue-inquiries': [
    { header: 'Venue Name', value: (doc) => doc.venueName },
    { header: 'Address', value: (doc) => doc.address },
    { header: 'Website', value: (doc) => doc.website },
    { header: 'Instagram', value: (doc) => doc.instagram },
    { header: 'Venue Type', value: (doc) => doc.venueType },
    { header: 'Capacity', value: (doc) => doc.capacity },
    { header: 'Has Dance Pocket', value: (doc) => (doc.hasDancePocket ? 'Yes' : 'No') },
    { header: 'Current Programming', value: (doc) => doc.currentProgramming },
    { header: 'Goals', value: (doc) => (Array.isArray(doc.goal) ? doc.goal.join(', ') : doc.goal) },
    { header: 'Monthly Budget', value: (doc) => doc.monthlyBudget },
    { header: 'Decision Maker', value: (doc) => doc.decisionMaker },
    { header: 'Contact Name', value: (doc) => doc.contactName },
    { header: 'WhatsApp', value: (doc) => doc.contactWhatsApp },
    { header: 'Email', value: (doc) => doc.contactEmail },
    { header: 'Timeline', value: (doc) => doc.timeline },
    { header: 'Source', value: (doc) => doc.source },
    { header: 'Status', value: (doc) => doc.status },
    { header: 'Internal Notes', value: (doc) => doc.internalNotes },
    { header: 'Created At', value: (doc) => isoDate(doc.createdAt) },
  ],
};

export function isExportCollection(collection: string): collection is ExportCollection {
  return collection === 'inquiries' || collection === 'venue-inquiries';
}

export function getCSVColumns(collection: ExportCollection) {
  return columns[collection];
}

export function buildCSV(collection: ExportCollection, docs: ExportDoc[]): string {
  const collectionColumns = getCSVColumns(collection);
  const headers = collectionColumns.map((column) => escapeCSV(column.header));
  const rows = docs.map((doc) => collectionColumns.map((column) => escapeCSV(column.value(doc))));

  return [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
}

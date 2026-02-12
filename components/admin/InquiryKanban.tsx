'use client';

import { useEffect, useState, useCallback } from 'react';

interface InquiryDoc {
  id: string;
  name?: string;
  venueName?: string;
  contactName?: string;
  email?: string;
  contactEmail?: string;
  service?: string;
  monthlyBudget?: string;
  status: string;
  createdAt: string;
  type: 'inquiry' | 'venue';
}

interface Column {
  id: string;
  label: string;
  color: string;
}

const inquiryColumns: Column[] = [
  { id: 'new', label: 'New', color: '#c8a96e' },
  { id: 'contacted', label: 'Contacted', color: '#3b82f6' },
  { id: 'booked', label: 'Booked', color: '#22c55e' },
  { id: 'closed', label: 'Closed', color: '#6b7280' },
];

const venueColumns: Column[] = [
  { id: 'new', label: 'New', color: '#c8a96e' },
  { id: 'qualified', label: 'Qualified', color: '#8b5cf6' },
  { id: 'call-booked', label: 'Call Booked', color: '#3b82f6' },
  { id: 'proposal-sent', label: 'Proposal Sent', color: '#f97316' },
  { id: 'signed', label: 'Signed', color: '#22c55e' },
  { id: 'disqualified', label: 'Disqualified', color: '#ef4444' },
];

const serviceLabels: Record<string, string> = {
  'wedding-film': 'Wedding',
  'editorial-commercial': 'Editorial',
  'event-production': 'Event',
  'dj-performance': 'DJ',
  'hybrid-package': 'Hybrid',
};

const budgetLabels: Record<string, string> = {
  'under-2k': '<2K',
  '2k-5k': '2-5K',
  '5k-10k': '5-10K',
  '10k-plus': '10K+',
};

function timeAgo(dateStr: string): string {
  const days = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

export default function InquiryKanban() {
  const [view, setView] = useState<'inquiry' | 'venue'>('inquiry');
  const [docs, setDocs] = useState<InquiryDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  const columns = view === 'inquiry' ? inquiryColumns : venueColumns;
  const collection = view === 'inquiry' ? 'inquiries' : 'venue-inquiries';

  const fetchDocs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/${collection}?limit=100&sort=-createdAt&depth=0`);
      const data = await res.json();
      setDocs((data.docs || []).map((d: any) => ({ ...d, type: view })));
    } catch (err) {
      console.error('Failed to fetch:', err);
    } finally {
      setLoading(false);
    }
  }, [collection, view]);

  useEffect(() => { fetchDocs(); }, [fetchDocs]);

  async function moveCard(docId: string, newStatus: string) {
    setUpdating(docId);
    try {
      await fetch(`/api/${collection}/${docId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      setDocs((prev) => prev.map((d) => d.id === docId ? { ...d, status: newStatus } : d));
    } catch (err) {
      console.error('Failed to update status:', err);
    } finally {
      setUpdating(null);
    }
  }

  return (
    <div style={{ marginBottom: '2rem' }}>
      {/* Header with tab toggle */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--theme-text)', margin: 0 }}>
          Pipeline
        </h2>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {(['inquiry', 'venue'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setView(tab)}
              style={{
                padding: '6px 14px',
                fontSize: '0.75rem',
                fontWeight: 600,
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                background: view === tab ? '#c8a96e' : 'var(--theme-elevation-100)',
                color: view === tab ? '#09090b' : 'var(--theme-elevation-600)',
                transition: 'all 0.15s',
              }}
            >
              {tab === 'inquiry' ? 'General' : 'Venues'}
            </button>
          ))}
        </div>
      </div>

      {/* Kanban board */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns.length}, minmax(160px, 1fr))`,
        gap: '0.75rem',
        overflowX: 'auto',
      }}>
        {columns.map((col) => {
          const colDocs = docs.filter((d) => d.status === col.id);
          return (
            <div key={col.id} style={{
              background: 'var(--theme-elevation-50)',
              borderRadius: '8px',
              border: '1px solid var(--theme-elevation-150)',
              minHeight: '200px',
            }}>
              {/* Column header */}
              <div style={{
                padding: '0.75rem',
                borderBottom: `2px solid ${col.color}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: col.color }}>
                  {col.label}
                </span>
                <span style={{
                  fontSize: '0.625rem',
                  fontWeight: 700,
                  padding: '2px 6px',
                  borderRadius: '9999px',
                  background: `${col.color}20`,
                  color: col.color,
                }}>
                  {loading ? '...' : colDocs.length}
                </span>
              </div>

              {/* Cards */}
              <div style={{ padding: '0.5rem' }}>
                {colDocs.map((doc) => {
                  const displayName = doc.type === 'venue' ? doc.venueName : doc.name;
                  const subtitle = doc.type === 'venue'
                    ? `${budgetLabels[doc.monthlyBudget || ''] || doc.monthlyBudget || ''}/mo`
                    : serviceLabels[doc.service || ''] || doc.service || '';
                  const isUpdating = updating === doc.id;
                  const editUrl = `/admin/collections/${collection}/${doc.id}`;

                  return (
                    <div key={doc.id} style={{
                      padding: '0.75rem',
                      marginBottom: '0.5rem',
                      borderRadius: '6px',
                      background: 'var(--theme-elevation-0)',
                      border: '1px solid var(--theme-elevation-100)',
                      opacity: isUpdating ? 0.5 : 1,
                      transition: 'opacity 0.2s',
                    }}>
                      <a href={editUrl} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <div style={{ fontSize: '0.8125rem', fontWeight: 500, marginBottom: '2px' }}>
                          {displayName || 'Unnamed'}
                        </div>
                        <div style={{ fontSize: '0.6875rem', color: 'var(--theme-elevation-500)' }}>
                          {subtitle} &middot; {timeAgo(doc.createdAt)}
                        </div>
                      </a>
                      {/* Move buttons */}
                      <div style={{ display: 'flex', gap: '4px', marginTop: '6px', flexWrap: 'wrap' }}>
                        {columns
                          .filter((c) => c.id !== col.id)
                          .map((target) => (
                            <button
                              key={target.id}
                              onClick={() => moveCard(doc.id, target.id)}
                              disabled={isUpdating}
                              style={{
                                fontSize: '0.5625rem',
                                padding: '1px 6px',
                                borderRadius: '4px',
                                border: `1px solid ${target.color}40`,
                                background: 'transparent',
                                color: target.color,
                                cursor: isUpdating ? 'wait' : 'pointer',
                                transition: 'background 0.15s',
                              }}
                              onMouseOver={(e) => (e.currentTarget.style.background = `${target.color}15`)}
                              onMouseOut={(e) => (e.currentTarget.style.background = 'transparent')}
                            >
                              &rarr; {target.label}
                            </button>
                          ))}
                      </div>
                    </div>
                  );
                })}
                {!loading && colDocs.length === 0 && (
                  <div style={{ padding: '1rem', textAlign: 'center', fontSize: '0.75rem', color: 'var(--theme-elevation-300)' }}>
                    Empty
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

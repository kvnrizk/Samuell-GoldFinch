'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';

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
  // Lead scoring fields
  leadScore?: number;
  leadTier?: string;
  estimatedValue?: number;
  contractValue?: number;
  monthlyValue?: number;
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

// Tier-based badge colors
const tierColors: Record<string, { bg: string; text: string }> = {
  hot:  { bg: '#ef4444', text: '#ffffff' },
  warm: { bg: '#c8a96e', text: '#09090b' },
  cool: { bg: '#3b82f6', text: '#ffffff' },
  cold: { bg: '#6b7280', text: '#ffffff' },
};

// Currency formatter for column value subtotals
const eurFormatter = new Intl.NumberFormat('fr-FR', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0,
});

function timeAgo(dateStr: string): string {
  const days = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

/** Get the best value estimate for a doc (contractValue > estimatedValue) */
function getDocValue(doc: InquiryDoc): number {
  if (doc.type === 'venue') {
    return doc.contractValue || doc.estimatedValue || 0;
  }
  return doc.estimatedValue || 0;
}

/** Sort docs by leadScore descending; docs without a score go to the bottom */
function sortByScore(a: InquiryDoc, b: InquiryDoc): number {
  const scoreA = a.leadScore ?? -1;
  const scoreB = b.leadScore ?? -1;
  return scoreB - scoreA;
}

/** Infer tier from score when leadTier is missing */
function getTierForDoc(doc: InquiryDoc): string | null {
  if (doc.leadTier) return doc.leadTier;
  if (doc.leadScore == null || doc.leadScore <= 0) return null;
  if (doc.leadScore >= 80) return 'hot';
  if (doc.leadScore >= 60) return 'warm';
  if (doc.leadScore >= 40) return 'cool';
  return 'cold';
}

export default function InquiryKanban() {
  const [view, setView] = useState<'inquiry' | 'venue'>('inquiry');
  const [docs, setDocs] = useState<InquiryDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

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

  // Pre-compute column data: sorted docs + value subtotals
  const columnData = useMemo(() => {
    const map: Record<string, { docs: InquiryDoc[]; totalValue: number }> = {};
    for (const col of columns) {
      const colDocs = docs.filter((d) => d.status === col.id).sort(sortByScore);
      const totalValue = colDocs.reduce((sum, d) => sum + getDocValue(d), 0);
      map[col.id] = { docs: colDocs, totalValue };
    }
    return map;
  }, [docs, columns]);

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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: isMobile ? '0.5rem' : '0' }}>
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
          const { docs: colDocs, totalValue } = columnData[col.id] || { docs: [], totalValue: 0 };
          return (
            <div key={col.id} style={{
              background: 'var(--theme-elevation-50)',
              borderRadius: '8px',
              border: '1px solid var(--theme-elevation-150)',
              minHeight: '200px',
              minWidth: '200px',
            }}>
              {/* Column header */}
              <div style={{
                padding: '0.75rem',
                borderBottom: `2px solid ${col.color}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: col.color }}>
                    {col.label}
                  </span>
                  {totalValue > 0 && (
                    <span style={{ fontSize: '0.5625rem', color: 'var(--theme-elevation-400)' }}>
                      {eurFormatter.format(totalValue)}
                    </span>
                  )}
                </div>
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

                  // Score badge data
                  const tier = getTierForDoc(doc);
                  const showBadge = doc.leadScore != null && doc.leadScore > 0 && tier != null;
                  const badgeColors = tier ? tierColors[tier] || tierColors.cold : tierColors.cold;

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
                        <div style={{
                          fontSize: '0.8125rem',
                          fontWeight: 500,
                          marginBottom: '2px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '6px',
                        }}>
                          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {displayName || 'Unnamed'}
                          </span>
                          {showBadge && (
                            <span style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              width: '24px',
                              height: '24px',
                              borderRadius: '50%',
                              fontSize: '0.5625rem',
                              fontWeight: 700,
                              background: badgeColors.bg,
                              color: badgeColors.text,
                              flexShrink: 0,
                            }}>
                              {doc.leadScore}
                            </span>
                          )}
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

/* eslint-disable @next/next/no-html-link-for-pages */
'use client';

import { useEffect, useState } from 'react';

/* ---------- Types ---------- */

interface InquiryDoc {
  id: string;
  status?: string;
  leadScore?: number;
  leadTier?: string;
  estimatedValue?: number;
  createdAt: string;
  updatedAt: string;
}

interface VenueDoc {
  id: string;
  status?: string;
  leadScore?: number;
  leadTier?: string;
  estimatedValue?: number;
  monthlyValue?: number;
  contractValue?: number;
  annualValue?: number;
  createdAt: string;
  updatedAt: string;
}

interface RevenueData {
  pipelineValue: number;
  pipelineOpenDeals: number;
  weightedPipeline: number;
  monthlyRecurring: number;
  activeVenues: number;
  signedThisMonth: number;
  signedThisMonthDeals: number;
  funnelStages: { stage: string; label: string; count: number; value: number }[];
  funnelDisqualified: { count: number; value: number };
  funnelTotal: number;
  funnelSignedCount: number;
  scoreTiers: { tier: string; label: string; count: number; color: string }[];
  scoreAvg: number;
  scoreMedian: number;
}

/* ---------- Helpers ---------- */

const CLOSED_STATUSES = new Set(['closed', 'booked', 'disqualified', 'signed']);
const SIGNED_STATUSES = new Set(['booked', 'signed']);

const currencyFmt = new Intl.NumberFormat('fr-FR', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0,
});

function median(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0 ? sorted[mid] : Math.round((sorted[mid - 1] + sorted[mid]) / 2);
}

function isCurrentMonth(dateStr: string): boolean {
  const d = new Date(dateStr);
  const now = new Date();
  return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
}

/* ---------- Pipeline funnel stages (venue inquiries only) ---------- */

const VENUE_FUNNEL_STAGES = [
  { stage: 'new', label: 'New' },
  { stage: 'qualified', label: 'Qualified' },
  { stage: 'call-booked', label: 'Call Booked' },
  { stage: 'proposal-sent', label: 'Proposal Sent' },
  { stage: 'signed', label: 'Signed' },
];

/* ---------- Process data ---------- */

function processData(inquiries: InquiryDoc[], venues: VenueDoc[]): RevenueData {
  const allDocs: (InquiryDoc | VenueDoc)[] = [...inquiries, ...venues];

  // ---- KPI 1: Pipeline Value (open deals from both collections) ----
  let pipelineValue = 0;
  let pipelineOpenDeals = 0;
  for (const doc of allDocs) {
    if (!doc.status || !CLOSED_STATUSES.has(doc.status)) {
      pipelineValue += doc.estimatedValue || 0;
      pipelineOpenDeals++;
    }
  }

  // ---- KPI 2: Weighted Pipeline ----
  let weightedPipeline = 0;
  for (const doc of allDocs) {
    if (!doc.status || !CLOSED_STATUSES.has(doc.status)) {
      const score = doc.leadScore || 0;
      const value = doc.estimatedValue || 0;
      weightedPipeline += value * score / 100;
    }
  }

  // ---- KPI 3: Monthly Recurring (venue signed only) ----
  let monthlyRecurring = 0;
  let activeVenues = 0;
  for (const v of venues) {
    if (v.status === 'signed') {
      monthlyRecurring += v.monthlyValue || 0;
      activeVenues++;
    }
  }

  // ---- KPI 4: Signed This Month (both collections) ----
  let signedThisMonth = 0;
  let signedThisMonthDeals = 0;
  for (const doc of allDocs) {
    if (doc.status && SIGNED_STATUSES.has(doc.status) && isCurrentMonth(doc.updatedAt)) {
      signedThisMonth += doc.estimatedValue || 0;
      signedThisMonthDeals++;
    }
  }

  // ---- Pipeline Funnel (venue inquiries only) ----
  const stageCounts: Record<string, { count: number; value: number }> = {};
  for (const s of VENUE_FUNNEL_STAGES) {
    stageCounts[s.stage] = { count: 0, value: 0 };
  }
  let disqualifiedCount = 0;
  let disqualifiedValue = 0;
  let funnelTotal = 0;
  let funnelSignedCount = 0;

  for (const v of venues) {
    const st = v.status || 'new';
    funnelTotal++;
    if (st === 'disqualified') {
      disqualifiedCount++;
      disqualifiedValue += v.estimatedValue || 0;
    } else if (stageCounts[st]) {
      stageCounts[st].count++;
      stageCounts[st].value += v.estimatedValue || 0;
      if (st === 'signed') funnelSignedCount++;
    }
  }

  const funnelStages = VENUE_FUNNEL_STAGES.map((s) => ({
    stage: s.stage,
    label: s.label,
    count: stageCounts[s.stage].count,
    value: stageCounts[s.stage].value,
  }));

  // ---- Lead Score Distribution (last 30 days, both collections) ----
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const recentScores: number[] = [];
  for (const doc of allDocs) {
    if (new Date(doc.createdAt) >= thirtyDaysAgo && typeof doc.leadScore === 'number') {
      recentScores.push(doc.leadScore);
    }
  }

  const tierDefs = [
    { tier: 'hot', label: 'Hot (80-100)', color: '#ef4444', min: 80, max: 100 },
    { tier: 'warm', label: 'Warm (60-79)', color: '#c8a96e', min: 60, max: 79 },
    { tier: 'cool', label: 'Cool (40-59)', color: '#3b82f6', min: 40, max: 59 },
    { tier: 'cold', label: 'Cold (0-39)', color: '#6b7280', min: 0, max: 39 },
  ];

  const scoreTiers = tierDefs.map((t) => ({
    tier: t.tier,
    label: t.label,
    count: recentScores.filter((s) => s >= t.min && s <= t.max).length,
    color: t.color,
  }));

  const scoreAvg =
    recentScores.length > 0
      ? Math.round(recentScores.reduce((a, b) => a + b, 0) / recentScores.length)
      : 0;
  const scoreMedian = median(recentScores);

  return {
    pipelineValue,
    pipelineOpenDeals,
    weightedPipeline,
    monthlyRecurring,
    activeVenues,
    signedThisMonth,
    signedThisMonthDeals,
    funnelStages,
    funnelDisqualified: { count: disqualifiedCount, value: disqualifiedValue },
    funnelTotal,
    funnelSignedCount,
    scoreTiers,
    scoreAvg,
    scoreMedian,
  };
}

/* ==========================================================================
   Component
   ========================================================================== */

export default function RevenueDashboard() {
  const [data, setData] = useState<RevenueData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  /* ---- Responsive ---- */
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  /* ---- Fetch data ---- */
  useEffect(() => {
    async function fetchData() {
      try {
        const [inqRes, vInqRes] = await Promise.all([
          fetch('/api/inquiries?limit=500&depth=0'),
          fetch('/api/venue-inquiries?limit=500&depth=0'),
        ]);
        const [inqData, vInqData] = await Promise.all([inqRes.json(), vInqRes.json()]);
        const inquiries: InquiryDoc[] = inqData.docs || [];
        const venues: VenueDoc[] = vInqData.docs || [];
        setData(processData(inquiries, venues));
      } catch (err) {
        console.error('Failed to fetch revenue data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  /* ---- Loading state ---- */
  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--theme-elevation-400)' }}>
        Loading revenue dashboard...
      </div>
    );
  }

  if (!data) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--theme-elevation-400)' }}>
        Failed to load revenue data.
      </div>
    );
  }

  /* ---- KPI card definitions ---- */
  const kpiCards = [
    {
      label: 'Pipeline Value',
      value: currencyFmt.format(data.pipelineValue),
      subtitle: `${data.pipelineOpenDeals} open deal${data.pipelineOpenDeals !== 1 ? 's' : ''}`,
      hoverColor: '#c8a96e',
    },
    {
      label: 'Weighted Pipeline',
      value: currencyFmt.format(data.weightedPipeline),
      subtitle: 'Score-adjusted',
      hoverColor: '#c8a96e',
    },
    {
      label: 'Monthly Recurring',
      value: currencyFmt.format(data.monthlyRecurring),
      subtitle: `${data.activeVenues} active venue${data.activeVenues !== 1 ? 's' : ''}`,
      hoverColor: '#22c55e',
    },
    {
      label: 'Signed This Month',
      value: currencyFmt.format(data.signedThisMonth),
      subtitle: `${data.signedThisMonthDeals} deal${data.signedThisMonthDeals !== 1 ? 's' : ''}`,
      hoverColor: '#22c55e',
    },
  ];

  /* ---- Funnel helpers ---- */
  const funnelMaxCount = Math.max(...data.funnelStages.map((s) => s.count), data.funnelDisqualified.count, 1);
  const conversionRate =
    data.funnelTotal > 0 ? ((data.funnelSignedCount / data.funnelTotal) * 100).toFixed(1) : '0.0';

  const funnelBarColor = (stage: string): string => {
    if (stage === 'signed') return '#22c55e';
    if (stage === 'disqualified') return '#ef4444';
    return '#c8a96e';
  };

  /* ---- Score tier helpers ---- */
  const scoreTotalCount = data.scoreTiers.reduce((a, t) => a + t.count, 0);
  const scoreMaxCount = Math.max(...data.scoreTiers.map((t) => t.count), 1);

  return (
    <div style={{ marginBottom: '2rem' }}>
      {/* ================================================================
          Header with title + CSV export buttons
          ================================================================ */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1rem',
          flexWrap: 'wrap',
          gap: isMobile ? '0.5rem' : '0',
        }}
      >
        <h2
          style={{
            fontSize: '1.125rem',
            fontWeight: 600,
            color: 'var(--theme-text)',
            margin: 0,
          }}
        >
          Revenue Dashboard
        </h2>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <a
            href="/api/export-csv?collection=inquiries"
            style={{
              padding: '6px 12px',
              fontSize: '0.6875rem',
              fontWeight: 600,
              borderRadius: '6px',
              background: '#c8a96e',
              color: '#09090b',
              textDecoration: 'none',
              transition: 'opacity 0.15s',
            }}
            onMouseOver={(e) => (e.currentTarget.style.opacity = '0.85')}
            onMouseOut={(e) => (e.currentTarget.style.opacity = '1')}
          >
            Export Inquiries CSV
          </a>
          <a
            href="/api/export-csv?collection=venue-inquiries"
            style={{
              padding: '6px 12px',
              fontSize: '0.6875rem',
              fontWeight: 600,
              borderRadius: '6px',
              background: '#22c55e',
              color: '#09090b',
              textDecoration: 'none',
              transition: 'opacity 0.15s',
            }}
            onMouseOver={(e) => (e.currentTarget.style.opacity = '0.85')}
            onMouseOut={(e) => (e.currentTarget.style.opacity = '1')}
          >
            Export Venues CSV
          </a>
        </div>
      </div>

      {/* ================================================================
          Section 1: Revenue KPI Cards
          ================================================================ */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: isMobile
            ? 'repeat(auto-fill, minmax(140px, 1fr))'
            : 'repeat(auto-fill, minmax(180px, 1fr))',
          gap: isMobile ? '0.75rem' : '1rem',
          marginBottom: '1.5rem',
        }}
      >
        {kpiCards.map((card) => (
          <div
            key={card.label}
            style={{
              padding: isMobile ? '0.875rem' : '1.25rem',
              borderRadius: '8px',
              border: '1px solid var(--theme-elevation-150)',
              background: 'var(--theme-elevation-50)',
              transition: 'border-color 0.2s',
            }}
            onMouseOver={(e) => (e.currentTarget.style.borderColor = card.hoverColor)}
            onMouseOut={(e) => (e.currentTarget.style.borderColor = 'var(--theme-elevation-150)')}
          >
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 500,
                color: 'var(--theme-elevation-500)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                display: 'block',
                marginBottom: '0.5rem',
              }}
            >
              {card.label}
            </span>
            <div
              style={{
                fontSize: isMobile ? '1.5rem' : '2rem',
                fontWeight: 700,
                color: 'var(--theme-text)',
                lineHeight: 1.1,
              }}
            >
              {card.value}
            </div>
            <span
              style={{
                fontSize: '0.6875rem',
                color: 'var(--theme-elevation-500)',
                marginTop: '0.25rem',
                display: 'block',
              }}
            >
              {card.subtitle}
            </span>
          </div>
        ))}
      </div>

      {/* ================================================================
          Sections 2 & 3 in a responsive grid
          ================================================================ */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '1rem',
        }}
      >
        {/* ==============================================================
            Section 2: Pipeline Funnel (venue inquiries only)
            ============================================================== */}
        <div
          style={{
            border: '1px solid var(--theme-elevation-150)',
            borderRadius: '8px',
            padding: '1rem',
            background: 'var(--theme-elevation-50)',
          }}
        >
          <h3
            style={{
              fontSize: '0.8125rem',
              fontWeight: 600,
              marginBottom: '0.75rem',
              color: 'var(--theme-text)',
            }}
          >
            Pipeline Funnel (Venues)
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {data.funnelStages.map((s) => (
              <div key={s.stage} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span
                  style={{
                    fontSize: '0.6875rem',
                    width: '90px',
                    textAlign: 'right',
                    color: 'var(--theme-elevation-500)',
                    flexShrink: 0,
                  }}
                >
                  {s.label}
                </span>
                <div
                  style={{
                    flex: 1,
                    height: '20px',
                    background: 'var(--theme-elevation-100)',
                    borderRadius: '4px',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${(s.count / funnelMaxCount) * 100}%`,
                      background: funnelBarColor(s.stage),
                      borderRadius: '4px',
                      transition: 'width 0.5s ease',
                      minWidth: s.count > 0 ? '20px' : '0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                      paddingRight: '6px',
                    }}
                  >
                    {s.count > 0 && (
                      <span style={{ fontSize: '0.5625rem', fontWeight: 700, color: '#fff', whiteSpace: 'nowrap' }}>
                        {s.count}
                      </span>
                    )}
                  </div>
                </div>
                <span
                  style={{
                    fontSize: '0.625rem',
                    color: 'var(--theme-elevation-500)',
                    flexShrink: 0,
                    minWidth: '60px',
                    textAlign: 'right',
                  }}
                >
                  {currencyFmt.format(s.value)}
                </span>
              </div>
            ))}

            {/* Disqualified — separated */}
            <div
              style={{
                borderTop: '1px dashed var(--theme-elevation-150)',
                paddingTop: '6px',
                marginTop: '4px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span
                  style={{
                    fontSize: '0.6875rem',
                    width: '90px',
                    textAlign: 'right',
                    color: 'var(--theme-elevation-500)',
                    flexShrink: 0,
                  }}
                >
                  Disqualified
                </span>
                <div
                  style={{
                    flex: 1,
                    height: '20px',
                    background: 'var(--theme-elevation-100)',
                    borderRadius: '4px',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${(data.funnelDisqualified.count / funnelMaxCount) * 100}%`,
                      background: '#ef4444',
                      borderRadius: '4px',
                      transition: 'width 0.5s ease',
                      minWidth: data.funnelDisqualified.count > 0 ? '20px' : '0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                      paddingRight: '6px',
                    }}
                  >
                    {data.funnelDisqualified.count > 0 && (
                      <span style={{ fontSize: '0.5625rem', fontWeight: 700, color: '#fff', whiteSpace: 'nowrap' }}>
                        {data.funnelDisqualified.count}
                      </span>
                    )}
                  </div>
                </div>
                <span
                  style={{
                    fontSize: '0.625rem',
                    color: 'var(--theme-elevation-500)',
                    flexShrink: 0,
                    minWidth: '60px',
                    textAlign: 'right',
                  }}
                >
                  {currencyFmt.format(data.funnelDisqualified.value)}
                </span>
              </div>
            </div>
          </div>

          {/* Conversion rate */}
          <div
            style={{
              marginTop: '0.75rem',
              paddingTop: '0.5rem',
              borderTop: '1px solid var(--theme-elevation-150)',
              fontSize: '0.6875rem',
              color: 'var(--theme-elevation-500)',
            }}
          >
            Conversion: <strong style={{ color: 'var(--theme-text)' }}>{conversionRate}%</strong>{' '}
            (signed / total)
          </div>
        </div>

        {/* ==============================================================
            Section 3: Lead Score Distribution (last 30 days)
            ============================================================== */}
        <div
          style={{
            border: '1px solid var(--theme-elevation-150)',
            borderRadius: '8px',
            padding: '1rem',
            background: 'var(--theme-elevation-50)',
          }}
        >
          <h3
            style={{
              fontSize: '0.8125rem',
              fontWeight: 600,
              marginBottom: '0.75rem',
              color: 'var(--theme-text)',
            }}
          >
            Lead Score Distribution (Last 30 Days)
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {scoreTotalCount === 0 && (
              <div
                style={{
                  fontSize: '0.75rem',
                  color: 'var(--theme-elevation-400)',
                  textAlign: 'center',
                  padding: '1rem',
                }}
              >
                No scored leads in the last 30 days
              </div>
            )}

            {data.scoreTiers.map((t) => {
              const pct = scoreTotalCount > 0 ? ((t.count / scoreTotalCount) * 100).toFixed(0) : '0';
              return (
                <div key={t.tier} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span
                    style={{
                      fontSize: '0.6875rem',
                      width: '90px',
                      textAlign: 'right',
                      color: 'var(--theme-elevation-500)',
                      flexShrink: 0,
                    }}
                  >
                    {t.label}
                  </span>
                  <div
                    style={{
                      flex: 1,
                      height: '20px',
                      background: 'var(--theme-elevation-100)',
                      borderRadius: '4px',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        height: '100%',
                        width: `${(t.count / scoreMaxCount) * 100}%`,
                        background: t.color,
                        borderRadius: '4px',
                        transition: 'width 0.5s ease',
                        minWidth: t.count > 0 ? '20px' : '0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        paddingRight: '6px',
                      }}
                    >
                      {t.count > 0 && (
                        <span style={{ fontSize: '0.5625rem', fontWeight: 700, color: '#fff', whiteSpace: 'nowrap' }}>
                          {t.count}
                        </span>
                      )}
                    </div>
                  </div>
                  <span
                    style={{
                      fontSize: '0.625rem',
                      color: 'var(--theme-elevation-500)',
                      flexShrink: 0,
                      minWidth: '30px',
                      textAlign: 'right',
                    }}
                  >
                    {pct}%
                  </span>
                </div>
              );
            })}
          </div>

          {/* Average + Median */}
          {scoreTotalCount > 0 && (
            <div
              style={{
                marginTop: '0.75rem',
                paddingTop: '0.5rem',
                borderTop: '1px solid var(--theme-elevation-150)',
                fontSize: '0.6875rem',
                color: 'var(--theme-elevation-500)',
              }}
            >
              Avg score: <strong style={{ color: 'var(--theme-text)' }}>{data.scoreAvg}</strong>
              {' \u00B7 '}
              Median: <strong style={{ color: 'var(--theme-text)' }}>{data.scoreMedian}</strong>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

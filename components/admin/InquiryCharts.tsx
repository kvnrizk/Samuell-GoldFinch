/* eslint-disable @next/next/no-html-link-for-pages */
'use client';

import { useEffect, useState } from 'react';

interface ChartData {
  inquiriesByMonth: Record<string, number>;
  inquiriesByService: Record<string, number>;
  inquiriesByStatus: Record<string, number>;
  venueByBudget: Record<string, number>;
}

const serviceLabels: Record<string, string> = {
  'wedding-film': 'Wedding',
  'editorial-commercial': 'Editorial',
  'event-production': 'Event',
  'dj-performance': 'DJ',
  'hybrid-package': 'Hybrid',
};

const statusLabels: Record<string, string> = {
  new: 'New',
  contacted: 'Contacted',
  booked: 'Booked',
  closed: 'Closed',
};

const budgetLabels: Record<string, string> = {
  'under-2k': '<2K',
  '2k-5k': '2-5K',
  '5k-10k': '5-10K',
  '10k-plus': '10K+',
};

const COLORS = ['#c8a96e', '#3b82f6', '#22c55e', '#8b5cf6', '#f97316', '#ec4899', '#06b6d4'];

function BarChart({ data, labels, title }: { data: Record<string, number>; labels?: Record<string, string>; title: string }) {
  const entries = Object.entries(data);
  const maxVal = Math.max(...entries.map(([, v]) => v), 1);

  return (
    <div style={{
      border: '1px solid var(--theme-elevation-150)',
      borderRadius: '8px',
      padding: '1rem',
      background: 'var(--theme-elevation-50)',
    }}>
      <h3 style={{ fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.75rem', color: 'var(--theme-text)' }}>
        {title}
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {entries.length === 0 && (
          <div style={{ fontSize: '0.75rem', color: 'var(--theme-elevation-400)', textAlign: 'center', padding: '1rem' }}>
            No data yet
          </div>
        )}
        {entries.map(([key, value], i) => (
          <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.6875rem', width: '60px', textAlign: 'right', color: 'var(--theme-elevation-500)', flexShrink: 0 }}>
              {labels?.[key] || key}
            </span>
            <div style={{ flex: 1, height: '20px', background: 'var(--theme-elevation-100)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: `${(value / maxVal) * 100}%`,
                background: COLORS[i % COLORS.length],
                borderRadius: '4px',
                transition: 'width 0.5s ease',
                minWidth: value > 0 ? '20px' : '0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                paddingRight: '6px',
              }}>
                <span style={{ fontSize: '0.5625rem', fontWeight: 700, color: '#fff' }}>
                  {value}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function InquiryCharts() {
  const [data, setData] = useState<ChartData>({
    inquiriesByMonth: {},
    inquiriesByService: {},
    inquiriesByStatus: {},
    venueByBudget: {},
  });
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const [inqRes, vInqRes] = await Promise.all([
          fetch('/api/inquiries?limit=500&depth=0'),
          fetch('/api/venue-inquiries?limit=500&depth=0'),
        ]);
        const [inqData, vInqData] = await Promise.all([inqRes.json(), vInqRes.json()]);
        const inquiries = inqData.docs || [];
        const venueInquiries = vInqData.docs || [];

        // Inquiries by month (last 6 months)
        const byMonth: Record<string, number> = {};
        const now = new Date();
        for (let i = 5; i >= 0; i--) {
          const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
          const key = d.toLocaleDateString('en-GB', { month: 'short', year: '2-digit' });
          byMonth[key] = 0;
        }
        for (const inq of [...inquiries, ...venueInquiries]) {
          const d = new Date(inq.createdAt);
          const key = d.toLocaleDateString('en-GB', { month: 'short', year: '2-digit' });
          if (key in byMonth) byMonth[key]++;
        }

        // By service
        const byService: Record<string, number> = {};
        for (const inq of inquiries) {
          const svc = inq.service || 'other';
          byService[svc] = (byService[svc] || 0) + 1;
        }

        // By status
        const byStatus: Record<string, number> = {};
        for (const inq of inquiries) {
          const st = inq.status || 'new';
          byStatus[st] = (byStatus[st] || 0) + 1;
        }

        // Venue by budget
        const byBudget: Record<string, number> = {};
        for (const inq of venueInquiries) {
          const b = inq.monthlyBudget || 'unknown';
          byBudget[b] = (byBudget[b] || 0) + 1;
        }

        setData({
          inquiriesByMonth: byMonth,
          inquiriesByService: byService,
          inquiriesByStatus: byStatus,
          venueByBudget: byBudget,
        });
      } catch (err) {
        console.error('Failed to fetch chart data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--theme-elevation-400)' }}>Loading charts...</div>;
  }

  return (
    <div style={{ marginBottom: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: isMobile ? '0.5rem' : '0' }}>
        <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--theme-text)', margin: 0 }}>
          Analytics
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
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile
          ? 'repeat(auto-fill, minmax(240px, 1fr))'
          : 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '1rem',
      }}>
        <BarChart data={data.inquiriesByMonth} title="Inquiries by Month (All)" />
        <BarChart data={data.inquiriesByService} labels={serviceLabels} title="By Service Type" />
        <BarChart data={data.inquiriesByStatus} labels={statusLabels} title="By Status" />
        <BarChart data={data.venueByBudget} labels={budgetLabels} title="Venue Inquiries by Budget" />
      </div>
    </div>
  );
}

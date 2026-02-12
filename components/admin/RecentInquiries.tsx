/* eslint-disable @next/next/no-html-link-for-pages */
'use client';

import { useEffect, useState } from 'react';

interface Inquiry {
  id: string;
  name: string;
  email: string;
  service?: string;
  status: string;
  createdAt: string;
  source: string;
}

interface VenueInquiry {
  id: string;
  venueName: string;
  contactName: string;
  contactEmail: string;
  monthlyBudget: string;
  status: string;
  createdAt: string;
}

const statusColors: Record<string, string> = {
  new: '#c8a96e',
  contacted: '#3b82f6',
  booked: '#22c55e',
  closed: '#6b7280',
  qualified: '#8b5cf6',
  'call-booked': '#3b82f6',
  'proposal-sent': '#f97316',
  signed: '#22c55e',
  disqualified: '#ef4444',
};

const statusLabels: Record<string, string> = {
  new: 'New',
  contacted: 'Contacted',
  booked: 'Booked',
  closed: 'Closed',
  qualified: 'Qualified',
  'call-booked': 'Call Booked',
  'proposal-sent': 'Proposal Sent',
  signed: 'Signed',
  disqualified: 'Disqualified',
};

const serviceLabels: Record<string, string> = {
  'wedding-film': 'Wedding Film',
  'editorial-commercial': 'Editorial / Commercial',
  'event-production': 'Event Production',
  'dj-performance': 'DJ Performance',
  'hybrid-package': 'Hybrid Package',
};

const budgetLabels: Record<string, string> = {
  'under-2k': 'Under 2K',
  '2k-5k': '2K-5K',
  '5k-10k': '5K-10K',
  '10k-plus': '10K+',
};

function timeAgo(dateStr: string): string {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span style={{
      fontSize: '0.625rem',
      fontWeight: 600,
      padding: '2px 8px',
      borderRadius: '9999px',
      background: `${statusColors[status] || '#6b7280'}20`,
      color: statusColors[status] || '#6b7280',
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
    }}>
      {statusLabels[status] || status}
    </span>
  );
}

export default function RecentInquiries() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [venueInquiries, setVenueInquiries] = useState<VenueInquiry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRecent() {
      try {
        const [inqRes, vInqRes] = await Promise.all([
          fetch('/api/inquiries?limit=5&sort=-createdAt&depth=0'),
          fetch('/api/venue-inquiries?limit=5&sort=-createdAt&depth=0'),
        ]);
        const [inqData, vInqData] = await Promise.all([inqRes.json(), vInqRes.json()]);
        setInquiries(inqData.docs || []);
        setVenueInquiries(vInqData.docs || []);
      } catch (err) {
        console.error('Failed to fetch recent inquiries:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchRecent();
  }, []);

  const rowStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0.75rem 1rem',
    borderBottom: '1px solid var(--theme-elevation-100)',
    textDecoration: 'none',
    color: 'inherit',
    transition: 'background 0.15s',
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
      {/* General Inquiries */}
      <div style={{ border: '1px solid var(--theme-elevation-150)', borderRadius: '8px', overflow: 'hidden', background: 'var(--theme-elevation-50)' }}>
        <div style={{ padding: '1rem', borderBottom: '1px solid var(--theme-elevation-150)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3 style={{ fontSize: '0.875rem', fontWeight: 600, margin: 0 }}>Recent Inquiries</h3>
          <a href="/admin/collections/inquiries" style={{ fontSize: '0.75rem', color: '#c8a96e', textDecoration: 'none' }}>View all</a>
        </div>
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--theme-elevation-400)' }}>Loading...</div>
        ) : inquiries.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--theme-elevation-400)', fontSize: '0.875rem' }}>No inquiries yet</div>
        ) : (
          inquiries.map((inq) => (
            <a
              key={inq.id}
              href={`/admin/collections/inquiries/${inq.id}`}
              style={rowStyle}
              onMouseOver={(e) => (e.currentTarget.style.background = 'var(--theme-elevation-100)')}
              onMouseOut={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              <div>
                <div style={{ fontSize: '0.875rem', fontWeight: 500 }}>{inq.name}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--theme-elevation-500)' }}>
                  {serviceLabels[inq.service || ''] || inq.service || 'General'} &middot; {timeAgo(inq.createdAt)}
                </div>
              </div>
              <StatusBadge status={inq.status} />
            </a>
          ))
        )}
      </div>

      {/* Venue Inquiries */}
      <div style={{ border: '1px solid var(--theme-elevation-150)', borderRadius: '8px', overflow: 'hidden', background: 'var(--theme-elevation-50)' }}>
        <div style={{ padding: '1rem', borderBottom: '1px solid var(--theme-elevation-150)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3 style={{ fontSize: '0.875rem', fontWeight: 600, margin: 0 }}>Recent Venue Inquiries</h3>
          <a href="/admin/collections/venue-inquiries" style={{ fontSize: '0.75rem', color: '#22c55e', textDecoration: 'none' }}>View all</a>
        </div>
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--theme-elevation-400)' }}>Loading...</div>
        ) : venueInquiries.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--theme-elevation-400)', fontSize: '0.875rem' }}>No venue inquiries yet</div>
        ) : (
          venueInquiries.map((inq) => (
            <a
              key={inq.id}
              href={`/admin/collections/venue-inquiries/${inq.id}`}
              style={rowStyle}
              onMouseOver={(e) => (e.currentTarget.style.background = 'var(--theme-elevation-100)')}
              onMouseOut={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              <div>
                <div style={{ fontSize: '0.875rem', fontWeight: 500 }}>{inq.venueName}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--theme-elevation-500)' }}>
                  {budgetLabels[inq.monthlyBudget] || inq.monthlyBudget}/mo &middot; {inq.contactName} &middot; {timeAgo(inq.createdAt)}
                </div>
              </div>
              <StatusBadge status={inq.status} />
            </a>
          ))
        )}
      </div>
    </div>
  );
}

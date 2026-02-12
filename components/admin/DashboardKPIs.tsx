'use client';

import { useEffect, useState } from 'react';

interface KPIData {
  inquiries: { total: number; new: number };
  venueInquiries: { total: number; new: number };
  projects: number;
  events: number;
  artists: number;
  posts: number;
  testimonials: number;
}

const defaultKPI: KPIData = {
  inquiries: { total: 0, new: 0 },
  venueInquiries: { total: 0, new: 0 },
  projects: 0,
  events: 0,
  artists: 0,
  posts: 0,
  testimonials: 0,
};

export default function DashboardKPIs() {
  const [data, setData] = useState<KPIData>(defaultKPI);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    async function fetchKPIs() {
      try {
        const [
          inquiriesRes,
          newInquiriesRes,
          venueInqRes,
          newVenueInqRes,
          projectsRes,
          eventsRes,
          artistsRes,
          postsRes,
          testimonialsRes,
        ] = await Promise.all([
          fetch('/api/inquiries?limit=0&depth=0'),
          fetch('/api/inquiries?limit=0&depth=0&where[status][equals]=new'),
          fetch('/api/venue-inquiries?limit=0&depth=0'),
          fetch('/api/venue-inquiries?limit=0&depth=0&where[status][equals]=new'),
          fetch('/api/blaze-projects?limit=0&depth=0'),
          fetch('/api/kolasi-events?limit=0&depth=0'),
          fetch('/api/artists?limit=0&depth=0'),
          fetch('/api/posts?limit=0&depth=0'),
          fetch('/api/testimonials?limit=0&depth=0'),
        ]);

        const [inq, newInq, vInq, newVInq, proj, evt, art, post, test] = await Promise.all([
          inquiriesRes.json(),
          newInquiriesRes.json(),
          venueInqRes.json(),
          newVenueInqRes.json(),
          projectsRes.json(),
          eventsRes.json(),
          artistsRes.json(),
          postsRes.json(),
          testimonialsRes.json(),
        ]);

        setData({
          inquiries: { total: inq.totalDocs || 0, new: newInq.totalDocs || 0 },
          venueInquiries: { total: vInq.totalDocs || 0, new: newVInq.totalDocs || 0 },
          projects: proj.totalDocs || 0,
          events: evt.totalDocs || 0,
          artists: art.totalDocs || 0,
          posts: post.totalDocs || 0,
          testimonials: test.totalDocs || 0,
        });
      } catch (err) {
        console.error('Failed to fetch KPIs:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchKPIs();
  }, []);

  const cards = [
    { label: 'Inquiries', value: data.inquiries.total, badge: data.inquiries.new > 0 ? `${data.inquiries.new} new` : '', color: '#c8a96e', href: '/admin/collections/inquiries' },
    { label: 'Venue Inquiries', value: data.venueInquiries.total, badge: data.venueInquiries.new > 0 ? `${data.venueInquiries.new} new` : '', color: '#22c55e', href: '/admin/collections/venue-inquiries' },
    { label: 'Projects', value: data.projects, badge: '', color: '#3b82f6', href: '/admin/collections/blaze-projects' },
    { label: 'Events', value: data.events, badge: '', color: '#8b5cf6', href: '/admin/collections/kolasi-events' },
    { label: 'Artists', value: data.artists, badge: '', color: '#ec4899', href: '/admin/collections/artists' },
    { label: 'Journal Posts', value: data.posts, badge: '', color: '#f97316', href: '/admin/collections/posts' },
    { label: 'Testimonials', value: data.testimonials, badge: '', color: '#06b6d4', href: '/admin/collections/testimonials' },
  ];

  return (
    <div style={{ marginBottom: '2rem' }}>
      <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--theme-text)' }}>
        Dashboard Overview
      </h2>
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile
          ? 'repeat(auto-fill, minmax(140px, 1fr))'
          : 'repeat(auto-fill, minmax(180px, 1fr))',
        gap: isMobile ? '0.75rem' : '1rem',
      }}>
        {cards.map((card) => (
          <a
            key={card.label}
            href={card.href}
            style={{
              display: 'block',
              padding: isMobile ? '0.875rem' : '1.25rem',
              borderRadius: '8px',
              border: '1px solid var(--theme-elevation-150)',
              background: 'var(--theme-elevation-50)',
              textDecoration: 'none',
              transition: 'border-color 0.2s',
            }}
            onMouseOver={(e) => (e.currentTarget.style.borderColor = card.color)}
            onMouseOut={(e) => (e.currentTarget.style.borderColor = 'var(--theme-elevation-150)')}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--theme-elevation-500)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {card.label}
              </span>
              {card.badge && (
                <span style={{
                  fontSize: '0.625rem',
                  fontWeight: 600,
                  padding: '2px 6px',
                  borderRadius: '9999px',
                  background: card.color,
                  color: '#fff',
                }}>
                  {card.badge}
                </span>
              )}
            </div>
            <div style={{ fontSize: isMobile ? '1.5rem' : '2rem', fontWeight: 700, color: loading ? 'var(--theme-elevation-300)' : 'var(--theme-text)' }}>
              {loading ? '—' : card.value}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

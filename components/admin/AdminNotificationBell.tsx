'use client';

import { useEffect, useRef, useState } from 'react';

interface AdminAlert {
  id: string;
  title: string;
  message?: string;
  type: string;
  severity: 'info' | 'warning' | 'urgent';
  inquiry?: string | { id: string };
  venueInquiry?: string | { id: string };
  isRead: boolean;
  createdAt: string;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function getAlertLink(alert: AdminAlert): string | null {
  if (alert.inquiry) {
    const id = typeof alert.inquiry === 'string' ? alert.inquiry : alert.inquiry.id;
    return `/admin/collections/inquiries/${id}`;
  }
  if (alert.venueInquiry) {
    const id = typeof alert.venueInquiry === 'string' ? alert.venueInquiry : alert.venueInquiry.id;
    return `/admin/collections/venue-inquiries/${id}`;
  }
  return null;
}

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return text.slice(0, max).trimEnd() + '...';
}

// Styles
const containerStyle: React.CSSProperties = {
  position: 'relative',
  marginBottom: '24px',
};

const bellStyle: React.CSSProperties = {
  background: '#141414',
  border: '1px solid #262626',
  borderRadius: '8px',
  padding: '10px 16px',
  color: '#e7e5e4',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  fontSize: '14px',
};

const badgeStyle: React.CSSProperties = {
  background: '#c8a96e',
  color: '#09090b',
  borderRadius: '10px',
  padding: '1px 7px',
  fontSize: '12px',
  fontWeight: 700,
};

const urgentBadgeStyle: React.CSSProperties = {
  ...badgeStyle,
  background: '#ef4444',
  color: '#fff',
};

const dropdownStyle: React.CSSProperties = {
  position: 'absolute',
  top: '100%',
  left: 0,
  right: 0,
  maxWidth: '480px',
  marginTop: '8px',
  background: '#141414',
  border: '1px solid #262626',
  borderRadius: '12px',
  boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
  zIndex: 50,
  maxHeight: '480px',
  overflowY: 'auto' as const,
};

const alertItemStyle: React.CSSProperties = {
  padding: '12px 16px',
  borderBottom: '1px solid #1a1a1a',
  display: 'flex',
  gap: '10px',
  alignItems: 'flex-start',
};

const severityDotStyle = (severity: string): React.CSSProperties => ({
  width: '10px',
  height: '10px',
  borderRadius: '50%',
  marginTop: '4px',
  flexShrink: 0,
  background: severity === 'urgent' ? '#ef4444' : severity === 'warning' ? '#c8a96e' : '#3b82f6',
});

const footerStyle: React.CSSProperties = {
  padding: '10px 16px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderTop: '1px solid #262626',
};

const footerButtonStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  color: '#c8a96e',
  cursor: 'pointer',
  fontSize: '13px',
  fontWeight: 500,
  padding: '4px 0',
};

const footerLinkStyle: React.CSSProperties = {
  color: '#c8a96e',
  fontSize: '13px',
  fontWeight: 500,
  textDecoration: 'none',
};

const emptyStyle: React.CSSProperties = {
  padding: '24px 16px',
  textAlign: 'center' as const,
  color: '#a1a1aa',
  fontSize: '14px',
};

export default function AdminNotificationBell() {
  const [alerts, setAlerts] = useState<AdminAlert[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchAlerts = async () => {
    try {
      const res = await fetch(
        '/api/admin-alerts?where[isRead][equals]=false&sort=-createdAt&limit=10&depth=0',
      );
      if (res.ok) {
        const json = await res.json();
        setAlerts(json.docs || []);
      }
    } catch (err) {
      console.error('Failed to fetch admin alerts:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch alerts on mount + poll every 60s
  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 60000);
    return () => clearInterval(interval);
  }, []);

  // Click outside to close
  useEffect(() => {
    if (!isOpen) return;

    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen]);

  const unreadCount = alerts.length;
  const hasUrgent = alerts.some((a) => a.severity === 'urgent');

  const handleMarkAllRead = async () => {
    if (marking || alerts.length === 0) return;
    setMarking(true);
    try {
      for (const alert of alerts) {
        await fetch(`/api/admin-alerts/${alert.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ isRead: true }),
        });
      }
      await fetchAlerts();
    } catch (err) {
      console.error('Failed to mark alerts as read:', err);
    } finally {
      setMarking(false);
    }
  };

  return (
    <div style={containerStyle} ref={dropdownRef}>
      {/* Bell Button */}
      <button
        type="button"
        style={bellStyle}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
      >
        <span style={{ fontSize: '18px' }} aria-hidden="true">
          {'\uD83D\uDD14'}
        </span>
        {!loading && unreadCount > 0 && (
          <span style={hasUrgent ? urgentBadgeStyle : badgeStyle}>{unreadCount}</span>
        )}
        {!loading && unreadCount === 0 && (
          <span style={{ color: '#a1a1aa', fontSize: '13px' }}>No new alerts</span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div style={dropdownStyle}>
          {alerts.length === 0 ? (
            <div style={emptyStyle}>All caught up — no unread alerts.</div>
          ) : (
            <>
              {alerts.map((alert) => {
                const link = getAlertLink(alert);
                return (
                  <div key={alert.id} style={alertItemStyle}>
                    {/* Severity dot */}
                    <div style={severityDotStyle(alert.severity)} />

                    {/* Content */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontWeight: 600,
                          fontSize: '13px',
                          color: '#e7e5e4',
                          marginBottom: '2px',
                        }}
                      >
                        {alert.title}
                      </div>
                      {alert.message && (
                        <div
                          style={{
                            fontSize: '12px',
                            color: '#a1a1aa',
                            marginBottom: '4px',
                            lineHeight: 1.4,
                          }}
                        >
                          {truncate(alert.message, 80)}
                        </div>
                      )}
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <span style={{ fontSize: '11px', color: '#71717a' }}>
                          {timeAgo(alert.createdAt)}
                        </span>
                        {link && (
                          <a
                            href={link}
                            style={{
                              fontSize: '12px',
                              color: '#c8a96e',
                              textDecoration: 'none',
                              fontWeight: 500,
                            }}
                            onClick={() => setIsOpen(false)}
                          >
                            {'View \u2192'}
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Footer */}
              <div style={footerStyle}>
                <button
                  type="button"
                  style={{
                    ...footerButtonStyle,
                    opacity: marking ? 0.5 : 1,
                  }}
                  onClick={handleMarkAllRead}
                  disabled={marking}
                >
                  {marking ? 'Marking...' : 'Mark all read'}
                </button>
                {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
                <a href="/admin/collections/admin-alerts" style={footerLinkStyle}>
                  {'View all alerts \u2192'}
                </a>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

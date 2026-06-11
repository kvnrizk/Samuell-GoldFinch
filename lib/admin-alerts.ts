import type { BasePayload } from 'payload';

type AlertType =
  | 'new-lead'
  | 'hot-lead'
  | 'stale-lead'
  | 'status-change'
  | 'deal-closed'
  | 'sequence-failed'
  | 'system';

type AlertSeverity = 'info' | 'warning' | 'urgent';

interface CreateAdminAlertInput {
  payload: BasePayload;
  title: string;
  message?: string;
  type: AlertType;
  severity?: AlertSeverity;
  inquiry?: string;
  venueInquiry?: string;
}

export async function createAdminAlert({
  payload,
  title,
  message,
  type,
  severity = 'info',
  inquiry,
  venueInquiry,
}: CreateAdminAlertInput) {
  try {
    await payload.create({
      collection: 'admin-alerts',
      overrideAccess: true,
      data: {
        title: title.slice(0, 200),
        ...(message ? { message: message.slice(0, 2000) } : {}),
        type,
        severity,
        ...(inquiry ? { inquiry } : {}),
        ...(venueInquiry ? { venueInquiry } : {}),
      },
    } as Parameters<BasePayload['create']>[0]);
  } catch (err) {
    console.error('[admin-alerts] Failed to create admin alert:', err);
  }
}

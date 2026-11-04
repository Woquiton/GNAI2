export type EmailDeliveryStatus =
    | 'not_requested'
    | 'queued'
    | 'draft'
    | 'received'
    | 'processing'
    | 'sent'
    | 'bounced'
    | 'failed'
    | 'unconfirmed'
    | 'no_email'
    | 'not_sent';

export interface EmailDeliverySummary {
    status: EmailDeliveryStatus;
    label: string;
    sent_at_label: string | null;
}

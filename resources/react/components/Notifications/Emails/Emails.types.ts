import type { TableListPage } from '@/components/Tables/TableList/TableList';
import type {
    EmailDeliveryStatus,
    EmailDeliverySummary,
} from '@/components/UI/EmailDeliveryIndicator/EmailDeliveryIndicator.types';

export type EmailStatus = Exclude<EmailDeliveryStatus, 'not_requested'>;
export type EmailFilters = Record<'search' | 'status' | 'context' | 'date_from' | 'date_to', string>;

export interface EmailRecord {
    id: string;
    subject: string;
    recipient_name: string | null;
    recipient_email: string | null;
    context_label: string;
    purpose_label: string;
    delivery: Omit<EmailDeliverySummary, 'status'> & { status: EmailStatus };
    attempts: number;
    created_at_label: string | null;
}

export interface EmailPaginator extends TableListPage {
    data: EmailRecord[];
}

export interface EmailIndexProps {
    emails: EmailPaginator;
    filters: EmailFilters;
    counts: Record<string, number>;
    statusOptions: Record<EmailStatus, string>;
    contextOptions: Record<string, string>;
}

export interface EmailDetails extends EmailRecord {
    last_attempt_at_label: string | null;
    content: {
        greeting: string | null;
        paragraphs: string[];
        rows: { label: string; value: string }[];
        outro: string | null;
        links_omitted: boolean;
    };
}

export interface EmailShowProps {
    email: EmailDetails;
}

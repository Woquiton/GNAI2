import type { TableListPage } from '@/components/Tables/TableList/TableList';
import type {
    EmailDeliveryStatus,
    EmailDeliverySummary,
} from '@/components/UI/EmailDeliveryIndicator/EmailDeliveryIndicator.types';

export type EmailStatus = Exclude<EmailDeliveryStatus, 'not_requested'>;
export type EmailFilters = Record<
    'search' | 'status' | 'context' | 'date_from' | 'date_to' | 'folder' | 'label',
    string
>;

export interface EmailMailbox {
    receivingEnabled: boolean;
    folderSyncEnabled: boolean;
    folders: Record<string, string>;
    folderCounts: Record<string, number>;
    labels: Record<string, { name: string; color: string; is_active: boolean }>;
}

export interface EmailAttachment {
    index: number;
    name: string;
    size: number;
    url: string;
}

export interface EmailRecord {
    direction: 'incoming' | 'outgoing';
    correspondent_name: string | null;
    correspondent_email: string | null;
    id: string;
    subject: string;
    recipient_name: string | null;
    recipient_email: string | null;
    context_label: string;
    purpose_label: string;
    delivery: Omit<EmailDeliverySummary, 'status'> & { status: EmailStatus };
    attempts: number;
    created_at_label: string | null;
    preview: string;
    starred: boolean;
    is_read: boolean;
    folder: string | null;
    folder_sync: 'gmail' | 'local';
    label: string | null;
    label_label: string | null;
    label_color: string | null;
    has_attachments: boolean;
}

export interface EmailPaginator extends TableListPage {
    data: EmailRecord[];
}

export interface EmailIndexProps {
    mailbox: EmailMailbox;
    canSend: boolean;
    emails: EmailPaginator;
    filters: EmailFilters;
    counts: Record<string, number>;
    statusOptions: Record<EmailStatus, string>;
    contextOptions: Record<string, string>;
}

export interface EmailDetails extends EmailRecord {
    notices: string[];
    in_reply_to: { id: string; subject: string } | null;
    last_attempt_at_label: string | null;
    bounce_status: string | null;
    rejections: { recipient: string; code: string }[];
    sender_name: string | null;
    sender_address: string | null;
    to: string[];
    cc: string[];
    bcc: string[];
    body_html: string | null;
    attachments: EmailAttachment[];
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
    thread: EmailDetails[];
    mailbox: EmailMailbox;
    canSend: boolean;
    replyComposer: EmailComposeProps['composer'] | null;
}

export interface EmailComposeProps {
    mailbox: EmailMailbox;
    canSend: boolean;
    composer: {
        key: string;
        draft_id: string | null;
        sender: string;
        to: string;
        cc: string;
        bcc: string;
        subject: string;
        body: string;
        attachments: EmailAttachment[];
        source_id: string | null;
        reply_mode: string | null;
    };
}

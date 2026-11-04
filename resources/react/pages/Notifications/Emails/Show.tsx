import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';
import EmailThread from '@/components/Notifications/Emails/Details/EmailThread';
import EmailDetailsActions from '@/components/Notifications/Emails/Details/EmailDetailsActions';
import EmailMailboxLayout from '@/components/Notifications/Emails/EmailMailboxLayout';
import EmailToolbar from '@/components/Notifications/Emails/List/EmailToolbar';
import MailboxTrashModal from '@/components/Notifications/Emails/MailboxTrashModal';
import EmailQuickReply from '@/components/Notifications/Emails/Form/EmailQuickReply';
import { useMailboxActions } from '@/components/Notifications/Emails/useMailboxActions';
import { emailBreadcrumb } from '@/components/Notifications/Emails/Emails.routes';
import { EMAIL_THREAD_COLLECTIONS } from '@/components/Notifications/Emails/Emails.constants';
import type { EmailShowProps } from '@/components/Notifications/Emails/Emails.types';
import { emailDetailsTour } from '@/components/Notifications/Emails/emailTours';
import { useEmailDeliveryPolling } from '@/components/UI/EmailDeliveryIndicator/useEmailDeliveryPolling';

export default function EmailShow({
    email,
    thread,
    mailbox,
    canSend,
    replyComposer,
}: EmailShowProps): React.JSX.Element {
    useEmailDeliveryPolling(
        thread.some((message) => ['queued', 'processing'].includes(message.delivery.status)),
        EMAIL_THREAD_COLLECTIONS,
    );
    const actions = useMailboxActions();
    const draft = email.delivery.status === 'draft';
    const sent = ['sent', 'bounced'].includes(email.delivery.status);
    const replyMessageNumber =
        thread.findIndex((message) => message.id === replyComposer?.source_id) + 1;
    const folder =
        email.folder ||
        (email.direction === 'incoming' ? 'inbox' : draft ? 'drafts' : sent ? 'sent' : 'outbox');

    return (
        <BusinessPage
            title="Ler e-mail"
            documentTitle={email.subject || 'Sem assunto'}
            breadcrumbItems={emailBreadcrumb('Ler')}
            tour={emailDetailsTour}
            busy={actions.processing}
        >
            <EmailMailboxLayout mailbox={mailbox} canSend={canSend} folder={folder} joined>
                <EmailToolbar
                    selected={1}
                    processing={actions.processing}
                    labels={mailbox.labels}
                    folder={email.folder || undefined}
                    canMove={!mailbox.folderSyncEnabled || canSend}
                    onOrganize={(operation, label) =>
                        actions.organize(operation, [email.id], label)
                    }
                />
                <EmailThread messages={thread} selectedId={email.id} canSend={canSend} />
                {replyComposer ? (
                    <EmailQuickReply
                        key={replyComposer.source_id}
                        composer={replyComposer}
                        sourceId={replyComposer.source_id || email.id}
                        messageNumber={thread.length > 1 ? replyMessageNumber : undefined}
                    />
                ) : (
                    <EmailDetailsActions email={email} canSend={canSend} />
                )}
            </EmailMailboxLayout>
            <MailboxTrashModal actions={actions} folderSyncEnabled={mailbox.folderSyncEnabled} />
        </BusinessPage>
    );
}

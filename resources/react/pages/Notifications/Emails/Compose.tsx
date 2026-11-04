import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';
import EmailMailboxLayout from '@/components/Notifications/Emails/EmailMailboxLayout';
import EmailComposeForm from '@/components/Notifications/Emails/Form/EmailComposeForm';
import { emailBreadcrumb } from '@/components/Notifications/Emails/Emails.routes';
import type { EmailComposeProps } from '@/components/Notifications/Emails/Emails.types';
import { emailComposeTour } from '@/components/Notifications/Emails/emailTours';

export default function EmailCompose({
    composer,
    mailbox,
    canSend,
}: EmailComposeProps): React.JSX.Element {
    const identity = composer.draft_id
        ? `draft:${composer.draft_id}`
        : `new:${composer.source_id ?? ''}:${composer.reply_mode ?? ''}`;

    return (
        <BusinessPage
            title="Escrever e-mail"
            breadcrumbItems={emailBreadcrumb('Escrever')}
            tour={emailComposeTour}
        >
            <EmailMailboxLayout
                mailbox={mailbox}
                canSend={canSend}
                folder={composer.draft_id ? 'drafts' : ''}
            >
                <EmailComposeForm key={identity} composer={composer} />
            </EmailMailboxLayout>
        </BusinessPage>
    );
}

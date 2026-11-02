import MailboxSidebar from '@/catalog/components/UI/MailboxSidebar/MailboxSidebar';
import MailToolbar from '@/catalog/components/UI/MailToolbar/MailToolbar';
import MailList from '@/catalog/components/UI/MailList/MailList';
import MailMessage from '@/catalog/components/UI/MailMessage/MailMessage';
import MailCompose from '@/catalog/components/UI/MailCompose/MailCompose';
import './Mailbox.css';
export default function Mailbox({
    kind,
}: {
    kind: 'inbox' | 'email-read' | 'email-compose';
}): React.JSX.Element {
    return (
        <div className="mailbox">
            <aside className="mailbox__sidebar">
                <MailboxSidebar composing={kind === 'email-compose'} inboxPage={kind === 'inbox'} />
            </aside>
            <div className="mailbox__content">
                {kind !== 'email-compose' && <MailToolbar />}
                {kind === 'inbox' ? (
                    <MailList />
                ) : kind === 'email-read' ? (
                    <MailMessage />
                ) : (
                    <MailCompose />
                )}
            </div>
        </div>
    );
}

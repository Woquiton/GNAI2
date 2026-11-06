import type { ReactNode } from 'react';
import CardBox from '@/components/UI/CardBox/CardBox';
import type { EmailMailbox } from './Emails.types';
import EmailFolders from './List/EmailFolders';
import '@styles/components/Notifications/Emails/List/EmailInbox.css';

export default function EmailMailboxLayout({
    mailbox,
    canSend,
    folder,
    label,
    children,
    joined = false,
}: {
    mailbox: EmailMailbox;
    canSend: boolean;
    folder?: string;
    label?: string;
    children: ReactNode;
    joined?: boolean;
}): React.JSX.Element {
    const Container = joined ? CardBox : 'div';

    return (
        <Container className={joined ? 'emailInbox emailInbox--joined' : 'emailInbox'}>
            <EmailFolders mailbox={mailbox} canSend={canSend} folder={folder} label={label} />
            <div className="emailInbox__content">{children}</div>
        </Container>
    );
}

import { Link } from '@inertiajs/react';
import Button from '@/components/UI/Button/Button';
import type { EmailMailbox } from '../Emails.types';
import { emailUrls } from '../Emails.routes';
import { EMAIL_TOUR_TARGETS } from '../emailTours';

function folderIcon(folder: string): string {
    switch (folder) {
        case 'inbox':
            return 'fa fa-inbox';
        case 'starred':
            return 'fa fa-star-o';
        case 'drafts':
            return 'fa fa-file-text-o';
        case 'outbox':
            return 'fa fa-upload';
        case 'sent':
            return 'fa fa-paper-plane-o';
        case 'archive':
            return 'fa fa-archive';
        case 'spam':
            return 'fa fa-exclamation-circle';
        case 'trash':
            return 'fa fa-trash-o';
        default:
            return 'fa fa-inbox';
    }
}

export default function EmailFolders({
    mailbox,
    canSend,
    folder = '',
    label = '',
}: {
    mailbox: EmailMailbox;
    canSend: boolean;
    folder?: string;
    label?: string;
}): React.JSX.Element {
    return (
        <aside className="emailInbox__sidebar" data-tour={EMAIL_TOUR_TARGETS.folders}>
            {!mailbox.folderSyncEnabled ? (
                <p className="emailInbox__muted">
                    Organização pessoal no Gnai. Ative Sincronizar pastas com o Gmail em
                    Configurações → E-mail para integrar Spam, Lixeira, Arquivar e Restaurar.
                </p>
            ) : null}
            {canSend ? (
                <Button
                    href={emailUrls.compose}
                    label="Escrever"
                    title="Escrever e-mail"
                    tone="danger"
                    outline
                    rounded
                    block
                    leftIconClass="fa fa-pencil"
                />
            ) : null}
            <nav className="emailInbox__folders" aria-label="Pastas de e-mail">
                {Object.entries(mailbox.folders).map(([value, name]) => {
                    const active = folder === value && !label;
                    return (
                        <Link
                            key={value}
                            href={`${emailUrls.index}?folder=${value}`}
                            className={active ? 'is-active' : undefined}
                            aria-current={active ? 'page' : undefined}
                        >
                            <i className={folderIcon(value)} aria-hidden="true" />
                            <span>{name}</span>
                            <span className="emailInbox__folderCount">
                                {mailbox.folderCounts[value] ?? 0}
                            </span>
                        </Link>
                    );
                })}
            </nav>
            <h2 className="emailInbox__folderTitle">Marcadores</h2>
            <nav className="emailInbox__folders" aria-label="Marcadores de e-mail">
                {Object.entries(mailbox.labels).map(([value, tag]) => (
                    <Link
                        key={value}
                        href={`${emailUrls.index}?label=${value}`}
                        className={label === value ? 'is-active' : undefined}
                        aria-current={label === value ? 'page' : undefined}
                    >
                        <i
                            className="fa fa-circle emailInbox__marker"
                            style={{ color: tag.color }}
                            aria-hidden="true"
                        />
                        <span>
                            {tag.name}
                            {!tag.is_active ? ' (Inativa)' : ''}
                        </span>
                    </Link>
                ))}
            </nav>
        </aside>
    );
}

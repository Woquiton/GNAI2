import { usePage } from '@inertiajs/react';
import { useState } from 'react';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';
import {
    EMAIL_INBOX_COLLECTIONS,
    emptyEmailFilters,
} from '@/components/Notifications/Emails/Emails.constants';
import { emailBreadcrumb, emailUrls } from '@/components/Notifications/Emails/Emails.routes';
import type { EmailIndexProps } from '@/components/Notifications/Emails/Emails.types';
import EmailFilters from '@/components/Notifications/Emails/List/EmailFilters';
import EmailMailboxLayout from '@/components/Notifications/Emails/EmailMailboxLayout';
import EmailToolbar from '@/components/Notifications/Emails/List/EmailToolbar';
import MailboxTrashModal from '@/components/Notifications/Emails/MailboxTrashModal';
import { useMailboxActions } from '@/components/Notifications/Emails/useMailboxActions';
import { useInboxSync } from '@/components/Notifications/Emails/useInboxSync';
import EmailList from '@/components/Notifications/Emails/List/EmailList';
import { emailInboxTour, EMAIL_TOUR_TARGETS } from '@/components/Notifications/Emails/emailTours';
import { TableListCard, useTableListFilters } from '@/components/Tables/TableList/TableList';
import Button from '@/components/UI/Button/Button';
import { useEmailDeliveryPolling } from '@/components/UI/EmailDeliveryIndicator/useEmailDeliveryPolling';
import '@/components/Notifications/Emails/List/EmailInbox.css';

export default function EmailIndex({
    emails,
    filters: initialFilters,
    counts,
    statusOptions,
    contextOptions,
    mailbox,
    canSend,
}: EmailIndexProps): React.JSX.Element {
    const errors = usePage().props.errors as Record<string, string | undefined>;
    const filters = useTableListFilters({
        url: emailUrls.index,
        initialFilters,
        emptyFilters: emptyEmailFilters,
        failureText: 'Não foi possível atualizar a Inbox.',
    });
    const hasPendingEmail = emails.data.some((email) =>
        ['queued', 'processing'].includes(email.delivery.status),
    );
    const [selection, setSelection] = useState<string[]>([]);
    const selected = selection.filter((id) => emails.data.some((email) => email.id === id));
    const mailboxActions = useMailboxActions(() => setSelection([]));
    const inboxSync = useInboxSync();
    useEmailDeliveryPolling(
        (hasPendingEmail || mailbox.receivingEnabled || mailbox.folderSyncEnabled) &&
            !inboxSync.processing &&
            !mailboxActions.processing,
        EMAIL_INBOX_COLLECTIONS,
        hasPendingEmail ? 5000 : 30000,
    );
    const countedStatuses = Object.fromEntries(
        Object.entries(statusOptions).map(([value, label]) => [
            value,
            `${label} (${counts[value] ?? 0})`,
        ]),
    );

    function selectMessage(id: string, checked: boolean): void {
        setSelection((values) =>
            checked ? [...new Set([...values, id])] : values.filter((value) => value !== id),
        );
    }

    function refresh(): void {
        filters.cancelScheduled();
        filters.visit(filters.values, emails.current_page);
    }

    return (
        <BusinessPage
            title="Inbox"
            subtitle="Escreva mensagens e acompanhe os e-mails desta instalação."
            breadcrumbItems={emailBreadcrumb()}
            tour={emailInboxTour}
            busy={mailboxActions.processing || inboxSync.processing}
            actions={
                <>
                    {mailbox.receivingEnabled ? (
                        <Button
                            label={
                                inboxSync.processing && inboxSync.scope === 'replies'
                                    ? 'Buscando respostas...'
                                    : 'Buscar respostas'
                            }
                            title="Buscar respostas recebidas no Gmail"
                            tone="primary"
                            leftIconClass="fa fa-download"
                            data-tour={EMAIL_TOUR_TARGETS.sync}
                            disabled={
                                inboxSync.processing || filters.loading || mailboxActions.processing
                            }
                            onClick={() => inboxSync.sync('replies')}
                        />
                    ) : null}
                    {mailbox.folderSyncEnabled ? (
                        <Button
                            label={
                                inboxSync.processing && inboxSync.scope === 'folders'
                                    ? 'Sincronizando pastas...'
                                    : 'Sincronizar pastas'
                            }
                            title="Conferir as pastas atuais das mensagens no Gmail"
                            tone="primary"
                            leftIconClass="fa fa-refresh"
                            data-tour={EMAIL_TOUR_TARGETS.folderSync}
                            disabled={
                                inboxSync.processing || filters.loading || mailboxActions.processing
                            }
                            onClick={() => inboxSync.sync('folders')}
                        />
                    ) : null}
                    <Button
                        label="Atualizar"
                        title="Atualizar e-mails"
                        tone="list-action"
                        leftIconClass="fa fa-refresh"
                        disabled={filters.loading || inboxSync.processing}
                        onClick={refresh}
                    />
                </>
            }
        >
            <EmailMailboxLayout
                mailbox={mailbox}
                canSend={canSend}
                folder={filters.values.folder}
                label={filters.values.label}
            >
                {!mailbox.receivingEnabled ? (
                    <p className="emailInbox__muted">
                        Para receber respostas dos alunos, ative Importar respostas do Gmail em
                        Configurações → E-mail.
                    </p>
                ) : null}
                <EmailToolbar
                    selected={selected.length}
                    allSelected={emails.data.length > 0 && selected.length === emails.data.length}
                    onSelectAll={(checked) =>
                        setSelection(checked ? emails.data.map((email) => email.id) : [])
                    }
                    processing={mailboxActions.processing || inboxSync.processing}
                    labels={mailbox.labels}
                    folder={filters.values.folder}
                    canMove={!mailbox.folderSyncEnabled || canSend}
                    onOrganize={(operation, label) =>
                        mailboxActions.organize(operation, selected, label)
                    }
                    onRefresh={refresh}
                />
                <TableListCard
                    aria-label="Envios de e-mail"
                    loading={filters.loading}
                    loadingLabel="Atualizando e-mails"
                >
                    <EmailFilters
                        values={filters.values}
                        statusOptions={countedStatuses}
                        contextOptions={contextOptions}
                        errors={errors}
                        onUpdate={filters.update}
                        onClear={filters.clear}
                        onSubmit={filters.submit}
                    />
                    <EmailList
                        emails={emails}
                        loading={filters.loading}
                        onPageSelect={filters.selectPage}
                        selected={selected}
                        onSelect={selectMessage}
                        onStar={(email) =>
                            mailboxActions.organize(email.starred ? 'unstar' : 'star', [email.id])
                        }
                        processing={mailboxActions.processing || inboxSync.processing}
                        canSend={canSend}
                    />
                </TableListCard>
            </EmailMailboxLayout>
            <MailboxTrashModal
                actions={mailboxActions}
                folderSyncEnabled={mailbox.folderSyncEnabled}
            />
        </BusinessPage>
    );
}

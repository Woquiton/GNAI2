import { usePage } from '@inertiajs/react';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';
import {
    EMAIL_INBOX_COLLECTIONS,
    emptyEmailFilters,
} from '@/components/Notifications/Emails/Emails.constants';
import { emailBreadcrumb, emailUrls } from '@/components/Notifications/Emails/Emails.routes';
import type { EmailIndexProps } from '@/components/Notifications/Emails/Emails.types';
import EmailFilters from '@/components/Notifications/Emails/List/EmailFilters';
import EmailFolders from '@/components/Notifications/Emails/List/EmailFolders';
import EmailList from '@/components/Notifications/Emails/List/EmailList';
import { emailInboxTour } from '@/components/Notifications/Emails/emailTours';
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
}: EmailIndexProps): React.JSX.Element {
    const errors = usePage().props.errors as Record<string, string | undefined>;
    const filters = useTableListFilters({
        url: emailUrls.index,
        initialFilters,
        emptyFilters: emptyEmailFilters,
        failureText: 'Não foi possível atualizar a Central de E-mails.',
    });
    const hasPendingEmail = emails.data.some((email) =>
        ['queued', 'processing'].includes(email.delivery.status),
    );
    useEmailDeliveryPolling(hasPendingEmail, EMAIL_INBOX_COLLECTIONS);

    function refresh(): void {
        filters.cancelScheduled();
        filters.visit(filters.values, emails.current_page);
    }

    return (
        <BusinessPage
            title="Central de E-mails"
            subtitle="Histórico dos envios e acompanhamento dos resultados."
            breadcrumbItems={emailBreadcrumb()}
            tour={emailInboxTour}
            actions={
                <Button
                    label="Atualizar"
                    title="Atualizar e-mails"
                    tone="list-action"
                    leftIconClass="fa fa-refresh"
                    disabled={filters.loading}
                    onClick={refresh}
                />
            }
        >
            <div className="emailInbox">
                <EmailFolders
                    counts={counts}
                    statusOptions={statusOptions}
                    status={filters.values.status}
                    onSelect={(status) => filters.update('status', status)}
                />
                <div className="emailInbox__content">
                    <TableListCard
                        aria-label="Envios de e-mail"
                        loading={filters.loading}
                        loadingLabel="Atualizando e-mails"
                    >
                        <EmailFilters
                            values={filters.values}
                            statusOptions={statusOptions}
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
                        />
                    </TableListCard>
                </div>
            </div>
        </BusinessPage>
    );
}

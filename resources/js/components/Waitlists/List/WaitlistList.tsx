import { useMemo } from 'react';
import { useEmailDeliveryPolling } from '@/components/UI/EmailDeliveryIndicator/useEmailDeliveryPolling';
import {
    TableListFooter,
    TableListRowActions,
    TableListScroll,
    TableListTable,
    type TableListColumn,
} from '@/components/Tables/TableList/TableList';
import { waitlistUrls } from '../Waitlists.routes';
import type {
    WaitlistListPermissions,
    WaitlistPaginator,
    WaitlistRecord,
} from '../Waitlists.types';
import { waitlistColumns } from './waitlistColumns';

interface WaitlistListProps {
    waitlists: WaitlistPaginator;
    permissions: WaitlistListPermissions;
    loading: boolean;
    processing: boolean;
    onDelete: (waitlist: WaitlistRecord) => void;
    onPageSelect: (page: number) => void;
}

export default function WaitlistList({
    waitlists,
    permissions,
    loading,
    processing,
    onDelete,
    onPageSelect,
}: WaitlistListProps): React.JSX.Element {
    const hasPendingEmail = waitlists.data.some((waitlist) =>
        ['queued', 'processing'].includes(waitlist.registration_email.status),
    );
    useEmailDeliveryPolling(hasPendingEmail, 'waitlists');

    const columns = useMemo<TableListColumn<WaitlistRecord>[]>(
        () => [
            ...waitlistColumns,
            {
                id: 'actions',
                label: 'Ações',
                width: '8%',
                fixed: 'end',
                render: (waitlist) => (
                    <TableListRowActions
                        view={
                            permissions.show && {
                                href: waitlistUrls.show(waitlist.id),
                                label: `Visualizar solicitação de ${waitlist.item_name}`,
                            }
                        }
                        remove={
                            permissions.destroy && {
                                label: `Excluir solicitação de ${waitlist.item_name}`,
                                disabled: processing,
                                onClick: () => onDelete(waitlist),
                            }
                        }
                    />
                ),
            },
        ],
        [permissions.show, permissions.destroy, processing, onDelete],
    );

    return (
        <>
            <TableListScroll aria-label="Tabela de solicitações da fila de espera">
                <TableListTable
                    className="waitlistList"
                    columns={columns}
                    rows={waitlists.data}
                    rowKey={(waitlist) => waitlist.id}
                    page={waitlists}
                    emptyMessage="Nenhuma solicitação registrada."
                />
            </TableListScroll>
            <TableListFooter
                page={waitlists}
                disabled={loading}
                paginationLabel="Páginas da fila de espera"
                onSelect={onPageSelect}
            />
        </>
    );
}

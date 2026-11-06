import { useMemo } from 'react';
import {
    TableListFooter,
    TableListRowActions,
    TableListScroll,
    TableListTable,
    type TableListColumn,
} from '@/components/Tables/TableList/TableList';
import { supportRequestUrls } from '../SupportRequests.routes';
import type {
    SupportRequestPaginator,
    SupportRequestPermissions,
    SupportRequestSummary,
} from '../SupportRequests.types';
import { supportRequestColumns } from './supportRequestColumns';

export default function SupportRequestList({
    requests,
    can,
    loading,
    processing,
    onDelete,
    onPageSelect,
}: {
    requests: SupportRequestPaginator;
    can: SupportRequestPermissions;
    loading: boolean;
    processing: boolean;
    onDelete: (record: SupportRequestSummary) => void;
    onPageSelect: (page: number) => void;
}): React.JSX.Element {
    const columns = useMemo<TableListColumn<SupportRequestSummary>[]>(
        () => [
            ...supportRequestColumns,
            {
                id: 'actions',
                label: 'Ações',
                width: '12%',
                fixed: 'end',
                render: (record) => (
                    <TableListRowActions
                        view={
                            can.view && {
                                href: supportRequestUrls.show(record.id),
                                label: `Visualizar solicitação #${record.id}`,
                            }
                        }
                        remove={
                            can.delete && {
                                label: `Excluir solicitação #${record.id}`,
                                disabled: processing,
                                onClick: () => onDelete(record),
                            }
                        }
                    />
                ),
            },
        ],
        [can.view, can.delete, processing, onDelete],
    );

    return (
        <>
            <TableListScroll aria-label="Solicitações de atendimento">
                <TableListTable
                    columns={columns}
                    rows={requests.data}
                    rowKey={(record) => record.id}
                    page={requests}
                    emptyMessage="Nenhuma solicitação encontrada."
                />
            </TableListScroll>
            <TableListFooter
                page={requests}
                disabled={loading}
                paginationLabel="Paginação de solicitações"
                onSelect={onPageSelect}
            />
        </>
    );
}

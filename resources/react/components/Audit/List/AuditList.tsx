import { useMemo } from 'react';
import { TableListFooter, TableListRowActions, TableListScroll, TableListTable, type TableListColumn } from '@/components/Tables/TableList/TableList';
import Button from '@/components/UI/Button/Button';
import type { AuditPaginator, AuditRecord } from '../Audit.types';
import { auditColumns } from './auditColumns';

interface AuditListProps {
    records: AuditPaginator;
    filtered: boolean;
    loading: boolean;
    onSelect: (record: AuditRecord) => void;
    onPageSelect: (page: number) => void;
}

export default function AuditList({
    records,
    filtered,
    loading,
    onSelect,
    onPageSelect,
}: AuditListProps): React.JSX.Element {
    const columns = useMemo<TableListColumn<AuditRecord>[]>(
        () => [
            ...auditColumns,
            {
                id: 'actions',
                label: 'Ações',
                width: '10%',
                fixed: 'end',
                render: (record) => (
                    <TableListRowActions>
                        <Button
                            size="sm"
                            tone="dark-blue"
                            iconOnly
                            leftIconClass="fa fa-eye"
                            title="Visualizar"
                            aria-label={`Ver detalhes: ${record.plain.summary}`}
                            onClick={() => onSelect(record)}
                        />
                    </TableListRowActions>
                ),
            },
        ],
        [onSelect],
    );
    const emptyMessage = filtered
        ? 'Nenhum registro com esses filtros.'
        : 'Nenhuma alteração registrada ainda.';

    return (
        <>
            <TableListScroll aria-label="Tabela do histórico de alterações">
                <TableListTable
                    className="auditList"
                    columns={columns}
                    rows={records.data}
                    rowKey={(record) => record.id}
                    page={records}
                    emptyMessage={emptyMessage}
                />
            </TableListScroll>
            <TableListFooter
                page={records}
                disabled={loading}
                paginationLabel="Paginação do histórico de alterações"
                onSelect={onPageSelect}
            />
        </>
    );
}

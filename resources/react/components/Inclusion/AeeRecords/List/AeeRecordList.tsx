import { useMemo } from 'react';
import {
    TableListFooter,
    TableListRowActions,
    TableListScroll,
    TableListTable,
    type TableListColumn,
} from '@/components/Tables/TableList/TableList';
import Button from '@/components/UI/Button/Button';
import { dateLabel } from '@/utils/formatters';
import { aeeRecordUrls } from '../AeeRecords.routes';
import type { AeeListRecord, AeeRecordPaginator } from '../AeeRecords.types';
import { aeeRecordColumns } from './aeeRecordColumns';

interface AeeRecordListProps {
    aeeRecords: AeeRecordPaginator;
    canView: boolean;
    loading: boolean;
    onPageSelect: (page: number) => void;
}

/** Tabela e paginação das listagens gerais de atendimentos especializados. */
export default function AeeRecordList({
    aeeRecords,
    canView,
    loading,
    onPageSelect,
}: AeeRecordListProps): React.JSX.Element {
    const columns = useMemo<TableListColumn<AeeListRecord>[]>(
        () => [
            ...aeeRecordColumns,
            {
                id: 'actions',
                label: 'Ações',
                width: '13%',
                fixed: 'end',
                render: (record) => {
                    const date = dateLabel(record.attendance_session?.session_date);

                    return (
                        <TableListRowActions
                            view={
                                canView && {
                                    href: aeeRecordUrls.show(record.id),
                                    label: `Visualizar atendimento de ${date}`,
                                }
                            }
                            emptyLabel="Sem ações"
                        >
                            {canView ? (
                                <Button
                                    href={aeeRecordUrls.pdf(record.id)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    size="sm"
                                    tone="cancel"
                                    iconOnly
                                    leftIconClass="fa fa-file-pdf-o"
                                    aria-label={`Gerar PDF do atendimento de ${date}`}
                                />
                            ) : null}
                        </TableListRowActions>
                    );
                },
            },
        ],
        [canView],
    );

    return (
        <>
            <TableListScroll aria-label="Tabela de atendimentos especializados">
                <TableListTable
                    columns={columns}
                    rows={aeeRecords.data}
                    rowKey={(record) => record.id}
                    page={aeeRecords}
                    emptyMessage="Nenhum atendimento especializado encontrado."
                />
            </TableListScroll>
            <TableListFooter
                page={aeeRecords}
                disabled={loading}
                paginationLabel="Paginação de atendimentos especializados"
                onSelect={onPageSelect}
            />
        </>
    );
}

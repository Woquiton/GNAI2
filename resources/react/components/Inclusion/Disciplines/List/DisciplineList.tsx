import { useMemo } from 'react';
import {
    TableListFooter,
    TableListRowActions,
    TableListScroll,
    TableListTable,
    type TableListColumn,
} from '@/components/Tables/TableList/TableList';
import { disciplineUrls } from '../Disciplines.routes';
import type {
    DisciplineListPermissions,
    DisciplinePaginator,
    DisciplineRecord,
} from '../Disciplines.types';
import { disciplineColumns } from './disciplineColumns';

interface DisciplineListProps {
    disciplines: DisciplinePaginator;
    permissions: DisciplineListPermissions;
    loading: boolean;
    processing: boolean;
    onDelete: (discipline: DisciplineRecord) => void;
    onPageSelect: (page: number) => void;
}

export default function DisciplineList({
    disciplines,
    permissions,
    loading,
    processing,
    onDelete,
    onPageSelect,
}: DisciplineListProps): React.JSX.Element {
    const columns = useMemo<TableListColumn<DisciplineRecord>[]>(
        () => [
            ...disciplineColumns,
            {
                id: 'actions',
                label: 'Ações',
                width: '15%',
                fixed: 'end',
                render: (discipline) => (
                    <TableListRowActions
                        emptyLabel="Sem ações"
                        view={
                            permissions.view && {
                                href: disciplineUrls.show(discipline.id),
                                label: `Visualizar ${discipline.name}`,
                            }
                        }
                        remove={
                            permissions.delete && {
                                label: `Excluir ${discipline.name}`,
                                disabled: processing,
                                onClick: () => onDelete(discipline),
                            }
                        }
                    />
                ),
            },
        ],
        [permissions.view, permissions.delete, processing, onDelete],
    );

    return (
        <>
            <TableListScroll aria-label="Tabela de disciplinas">
                <TableListTable
                    className="disciplineList"
                    columns={columns}
                    rows={disciplines.data}
                    rowKey={(discipline) => discipline.id}
                    page={disciplines}
                    emptyMessage="Nenhuma disciplina encontrada."
                />
            </TableListScroll>
            <TableListFooter
                page={disciplines}
                disabled={loading}
                paginationLabel="Paginação de disciplinas"
                onSelect={onPageSelect}
            />
        </>
    );
}

import { useMemo } from 'react';
import {
    TableListFooter,
    TableListRowActions,
    TableListScroll,
    TableListTable,
    type TableListColumn,
} from '@/components/Tables/TableList/TableList';
import { pendencyUrls } from '../Pendencies.routes';
import type {
    PendencyListRecord,
    PendencyListVariant,
    PendencyPaginator,
    PendencyPriorityOption,
} from '../Pendencies.types';
import { pendencyColumns } from './pendencyColumns';

interface PendencyListProps {
    variant: PendencyListVariant;
    pendencies: PendencyPaginator;
    priorities: PendencyPriorityOption[];
    permissions: { view: boolean; delete: boolean };
    loading: boolean;
    processing: boolean;
    /** Exclusão, somente na listagem geral. */
    onDelete?: (pendency: PendencyListRecord) => void;
    onPageSelect: (page: number) => void;
}

/** Tabela e paginação da listagem geral e de "Minhas Pendências". */
export default function PendencyList({
    variant,
    pendencies,
    priorities,
    permissions,
    loading,
    processing,
    onDelete,
    onPageSelect,
}: PendencyListProps): React.JSX.Element {
    const isMine = variant === 'my';
    const columns = useMemo<TableListColumn<PendencyListRecord>[]>(() => {
        const priorityByValue = new Map(priorities.map((priority) => [priority.value, priority]));

        return [
            ...pendencyColumns(variant, priorityByValue),
            {
                id: 'actions',
                label: 'Ações',
                width: '12%',
                fixed: 'end',
                render: (pendency) => (
                    <TableListRowActions
                        view={
                            permissions.view && {
                                href: pendencyUrls.show(pendency.id),
                                label: `Visualizar pendência ${pendency.title}`,
                            }
                        }
                        remove={
                            permissions.delete &&
                            onDelete !== undefined && {
                                label: `Excluir pendência ${pendency.title}`,
                                disabled: processing,
                                onClick: () => onDelete(pendency),
                            }
                        }
                    />
                ),
            },
        ];
    }, [variant, priorities, permissions.view, permissions.delete, processing, onDelete]);
    const emptyMessage = isMine
        ? 'Nenhuma pendência encontrada para você.'
        : 'Nenhuma pendência encontrada.';

    return (
        <>
            <TableListScroll aria-label="Tabela de pendências">
                <TableListTable
                    columns={columns}
                    rows={pendencies.data}
                    rowKey={(pendency) => pendency.id}
                    page={pendencies}
                    emptyMessage={emptyMessage}
                />
            </TableListScroll>
            <TableListFooter
                page={pendencies}
                disabled={loading}
                paginationLabel="Paginação de pendências"
                onSelect={onPageSelect}
            />
        </>
    );
}

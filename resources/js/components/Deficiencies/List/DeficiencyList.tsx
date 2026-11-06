import { useMemo } from 'react';
import {
    TableListFooter,
    TableListRowActions,
    TableListScroll,
    TableListTable,
    type TableListColumn,
} from '@/components/Tables/TableList/TableList';
import { deficiencyUrls } from '../Deficiencies.routes';
import type {
    DeficiencyListPermissions,
    DeficiencyPaginator,
    DeficiencyRecord,
} from '../Deficiencies.types';
import { deficiencyColumns } from './deficiencyColumns';
import '@styles/components/Deficiencies/List/DeficiencyList.css';

interface DeficiencyListProps {
    deficiencies: DeficiencyPaginator;
    permissions: DeficiencyListPermissions;
    loading: boolean;
    deleting: boolean;
    onDelete: (deficiency: DeficiencyRecord) => void;
    onPageSelect: (page: number) => void;
}

/** Tabela de perfis com visualizar e excluir; ativar/desativar fica na visualização. */
export default function DeficiencyList({
    deficiencies,
    permissions,
    loading,
    deleting,
    onDelete,
    onPageSelect,
}: DeficiencyListProps): React.JSX.Element {
    const columns = useMemo<TableListColumn<DeficiencyRecord>[]>(
        () => [
            ...deficiencyColumns,
            {
                id: 'actions',
                label: 'Ações',
                width: '22%',
                fixed: 'end',
                render: (deficiency) => (
                    <TableListRowActions
                        emptyLabel="Sem ações"
                        view={
                            permissions.view && {
                                href: deficiencyUrls.show(deficiency.id),
                                label: `Visualizar ${deficiency.name}`,
                            }
                        }
                        remove={
                            permissions.delete && {
                                label: `Excluir ${deficiency.name}`,
                                disabled: deleting,
                                onClick: () => onDelete(deficiency),
                            }
                        }
                    />
                ),
            },
        ],
        [permissions.view, permissions.delete, deleting, onDelete],
    );

    return (
        <>
            <TableListScroll aria-label="Tabela de perfis de atendimento">
                <TableListTable
                    columns={columns}
                    rows={deficiencies.data}
                    rowKey={(deficiency) => deficiency.id}
                    page={deficiencies}
                    emptyMessage="Nenhum perfil encontrado."
                />
            </TableListScroll>
            <TableListFooter
                page={deficiencies}
                disabled={loading}
                paginationLabel="Paginação de perfis de atendimento"
                onSelect={onPageSelect}
            />
        </>
    );
}

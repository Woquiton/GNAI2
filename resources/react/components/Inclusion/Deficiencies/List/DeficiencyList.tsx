import { useMemo } from 'react';
import {
    TableListFooter,
    TableListRowActions,
    TableListScroll,
    TableListTable,
    type TableListColumn,
} from '@/components/Tables/TableList/TableList';
import Button from '@/components/UI/Button/Button';
import { deficiencyUrls } from '../Deficiencies.routes';
import type {
    DeficiencyListPermissions,
    DeficiencyPaginator,
    DeficiencyRecord,
} from '../Deficiencies.types';
import { deficiencyColumns } from './deficiencyColumns';
import './DeficiencyList.css';

interface DeficiencyListProps {
    deficiencies: DeficiencyPaginator;
    permissions: DeficiencyListPermissions;
    loading: boolean;
    deleting: boolean;
    togglingStatus: boolean;
    onToggleActive: (deficiency: DeficiencyRecord) => void;
    onDelete: (deficiency: DeficiencyRecord) => void;
    onPageSelect: (page: number) => void;
}

/** Tabela de perfis com visualizar, ativar/desativar (sem confirmação) e excluir. */
export default function DeficiencyList({
    deficiencies,
    permissions,
    loading,
    deleting,
    togglingStatus,
    onToggleActive,
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
                    >
                        {permissions.update ? (
                            <Button
                                size="sm"
                                tone="inverse"
                                iconOnly
                                leftIconClass={
                                    deficiency.is_active ? 'fa fa-toggle-on' : 'fa fa-toggle-off'
                                }
                                aria-label={`${deficiency.is_active ? 'Desativar' : 'Ativar'} ${deficiency.name}`}
                                disabled={togglingStatus}
                                onClick={() => onToggleActive(deficiency)}
                            />
                        ) : null}
                    </TableListRowActions>
                ),
            },
        ],
        [
            permissions.view,
            permissions.update,
            permissions.delete,
            deleting,
            togglingStatus,
            onToggleActive,
            onDelete,
        ],
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

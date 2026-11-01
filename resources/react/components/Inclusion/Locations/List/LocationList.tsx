import { useMemo } from 'react';
import {
    TableListFooter,
    TableListRowActions,
    TableListScroll,
    TableListTable,
    type TableListColumn,
} from '@/components/Tables/TableList/TableList';
import { locationUrls } from '../Locations.routes';
import type {
    LocationListPermissions,
    LocationPaginator,
    LocationRecord,
} from '../Locations.types';
import { locationColumns } from './locationColumns';

interface LocationListProps {
    locations: LocationPaginator;
    permissions: LocationListPermissions;
    loading: boolean;
    processing: boolean;
    onDelete: (location: LocationRecord) => void;
    onPageSelect: (page: number) => void;
}

export default function LocationList({
    locations,
    permissions,
    loading,
    processing,
    onDelete,
    onPageSelect,
}: LocationListProps): React.JSX.Element {
    const columns = useMemo<TableListColumn<LocationRecord>[]>(
        () => [
            ...locationColumns,
            {
                id: 'actions',
                label: 'Ações',
                width: '15%',
                fixed: 'end',
                render: (location) => (
                    <TableListRowActions
                        emptyLabel="Sem ações"
                        view={
                            permissions.show && {
                                href: locationUrls.show(location.id),
                                label: `Visualizar ${location.name}`,
                            }
                        }
                        remove={
                            permissions.destroy && {
                                label: `Excluir ${location.name}`,
                                disabled: processing,
                                onClick: () => onDelete(location),
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
            <TableListScroll aria-label="Tabela de pontos de referência">
                <TableListTable
                    columns={columns}
                    rows={locations.data}
                    rowKey={(location) => location.id}
                    page={locations}
                    emptyMessage="Nenhum ponto de referência encontrado."
                />
            </TableListScroll>
            <TableListFooter
                page={locations}
                disabled={loading}
                paginationLabel="Paginação de pontos de referência"
                onSelect={onPageSelect}
            />
        </>
    );
}

import { useMemo } from 'react';
import {
    TableListFooter,
    TableListRowActions,
    TableListScroll,
    TableListTable,
    type TableListColumn,
} from '@/components/Tables/TableList/TableList';
import { accessibilityFeatureUrls } from '../AccessibilityFeatures.routes';
import type {
    AccessibilityFeatureListPermissions,
    AccessibilityFeaturePaginator,
    AccessibilityFeatureRecord,
} from '../AccessibilityFeatures.types';
import { accessibilityFeatureColumns } from './accessibilityFeatureColumns';

interface AccessibilityFeatureListProps {
    features: AccessibilityFeaturePaginator;
    permissions: AccessibilityFeatureListPermissions;
    loading: boolean;
    processing: boolean;
    onDelete: (feature: AccessibilityFeatureRecord) => void;
    onPageSelect: (page: number) => void;
}

export default function AccessibilityFeatureList({
    features,
    permissions,
    loading,
    processing,
    onDelete,
    onPageSelect,
}: AccessibilityFeatureListProps): React.JSX.Element {
    const columns = useMemo<TableListColumn<AccessibilityFeatureRecord>[]>(
        () => [
            ...accessibilityFeatureColumns,
            {
                id: 'actions',
                label: 'Ações',
                width: '20%',
                fixed: 'end',
                render: (feature) => (
                    <TableListRowActions
                        emptyLabel="Sem ações"
                        view={
                            permissions.show && {
                                href: accessibilityFeatureUrls.show(feature.id),
                                label: `Visualizar ${feature.name}`,
                            }
                        }
                        remove={
                            permissions.destroy && {
                                label: `Excluir ${feature.name}`,
                                disabled: processing,
                                onClick: () => onDelete(feature),
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
            <TableListScroll aria-label="Tabela de recursos de acessibilidade">
                <TableListTable
                    columns={columns}
                    rows={features.data}
                    rowKey={(feature) => feature.id}
                    page={features}
                    emptyMessage="Nenhum recurso de acessibilidade cadastrado."
                />
            </TableListScroll>
            <TableListFooter
                page={features}
                disabled={loading}
                paginationLabel="Paginação de recursos de acessibilidade"
                onSelect={onPageSelect}
            />
        </>
    );
}

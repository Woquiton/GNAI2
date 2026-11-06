import { formatTableListText, type TableListColumn } from '@/components/Tables/TableList/TableList';
import TableLabel from '@/components/UI/TableLabel/TableLabel';
import type { AccessibilityFeatureRecord } from '../AccessibilityFeatures.types';

/** Colunas da listagem; a descrição começa oculta no seletor de colunas. */
export const accessibilityFeatureColumns: TableListColumn<AccessibilityFeatureRecord>[] = [
    {
        id: 'name',
        label: 'Nome',
        width: '56%',
        fixed: 'start',
        render: (feature) => feature.name,
    },
    {
        id: 'status',
        label: 'Status',
        width: '24%',
        render: (feature) => (
            <TableLabel tone={feature.is_active ? 'success' : 'inverse'}>
                {feature.is_active ? 'Ativo' : 'Inativo'}
            </TableLabel>
        ),
    },
    {
        id: 'description',
        label: 'Descrição',
        width: '16%',
        defaultVisible: false,
        render: (feature) => formatTableListText(feature.description),
    },
];

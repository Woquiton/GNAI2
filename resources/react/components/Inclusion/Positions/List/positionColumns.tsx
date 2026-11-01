import { formatTableListText, type TableListColumn } from '@/components/Tables/TableList/TableList';
import TableLabel from '@/components/UI/TableLabel/TableLabel';
import type { PositionSummary } from '../Positions.types';

/** Colunas da listagem; a descrição começa oculta no seletor de colunas. */
export const positionColumns: TableListColumn<PositionSummary>[] = [
    {
        id: 'name',
        label: 'Cargo',
        width: '58%',
        fixed: 'start',
        render: (position) => <strong>{position.name}</strong>,
    },
    {
        id: 'status',
        label: 'Status',
        width: '20%',
        render: (position) => (
            <TableLabel tone={position.is_active ? 'success' : 'inverse'}>
                {position.is_active ? 'Ativo' : 'Inativo'}
            </TableLabel>
        ),
    },
    {
        id: 'description',
        label: 'Descrição',
        width: '16%',
        defaultVisible: false,
        render: (position) => formatTableListText(position.description),
    },
];

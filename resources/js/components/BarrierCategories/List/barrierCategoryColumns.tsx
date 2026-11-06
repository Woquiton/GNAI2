import { formatTableListText, type TableListColumn } from '@/components/Tables/TableList/TableList';
import TableLabel from '@/components/UI/TableLabel/TableLabel';
import type { BarrierCategoryRecord } from '../BarrierCategories.types';

/** Colunas da listagem; descrição e mapa começam ocultos no seletor de colunas. */
export const barrierCategoryColumns: TableListColumn<BarrierCategoryRecord>[] = [
    {
        id: 'name',
        label: 'Nome',
        width: '42%',
        fixed: 'start',
        render: (category) => category.name,
    },
    {
        id: 'count',
        label: 'Vínculos',
        width: '20%',
        render: (category) => category.barriers_count ?? 0,
    },
    {
        id: 'status',
        label: 'Status',
        width: '18%',
        render: (category) => (
            <TableLabel tone={category.is_active ? 'success' : 'inverse'}>
                {category.is_active ? 'Ativo' : 'Inativo'}
            </TableLabel>
        ),
    },
    {
        id: 'description',
        label: 'Descrição',
        width: '16%',
        defaultVisible: false,
        render: (category) => formatTableListText(category.description),
    },
    {
        id: 'map',
        label: 'Permite marcar no mapa',
        width: '16%',
        defaultVisible: false,
        render: (category) => (category.blocks_map ? 'Não' : 'Sim'),
    },
];

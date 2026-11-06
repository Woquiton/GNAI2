import { formatTableListText, type TableListColumn } from '@/components/Tables/TableList/TableList';
import TableLabel from '@/components/UI/TableLabel/TableLabel';
import type { DisciplineRecord } from '../Disciplines.types';

/** Colunas da listagem; a descrição começa oculta no seletor de colunas. */
export const disciplineColumns: TableListColumn<DisciplineRecord>[] = [
    {
        id: 'name',
        label: 'Nome',
        width: '60%',
        fixed: 'start',
        render: (discipline) => discipline.name,
    },
    {
        id: 'status',
        label: 'Status',
        width: '25%',
        render: (discipline) => (
            <TableLabel tone={discipline.is_active ? 'success' : 'inverse'}>
                {discipline.is_active ? 'Ativo' : 'Inativo'}
            </TableLabel>
        ),
    },
    {
        id: 'description',
        label: 'Descrição',
        width: '16%',
        defaultVisible: false,
        render: (discipline) => formatTableListText(discipline.description),
    },
];

import type { TableListColumn } from '@/components/Tables/TableList/TableList';
import TableLabel from '@/components/UI/TableLabel/TableLabel';
import type { TagRecord } from '../Tags.types';

export const tagColumns: TableListColumn<TagRecord>[] = [
    {
        id: 'name',
        label: 'Nome',
        width: '60%',
        fixed: 'start',
        render: (tag) => tag.name,
    },
    {
        id: 'status',
        label: 'Status',
        width: '20%',
        render: (tag) => (
            <TableLabel tone={tag.is_active ? 'success' : 'inverse'}>
                {tag.is_active ? 'Ativo' : 'Inativo'}
            </TableLabel>
        ),
    },
];

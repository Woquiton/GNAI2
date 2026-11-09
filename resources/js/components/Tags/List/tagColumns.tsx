import type { TableListColumn } from '@/components/Tables/TableList/TableList';
import TableLabel from '@/components/UI/TableLabel/TableLabel';
import TagName from '../TagName';
import type { TagRecord } from '../Tags.types';

export const tagColumns: TableListColumn<TagRecord>[] = [
    {
        id: 'name',
        label: 'Nome',
        width: '30%',
        fixed: 'start',
        render: (tag) => <TagName name={tag.name} special={Boolean(tag.system_key)} />,
    },
    {
        id: 'module',
        label: 'Módulo',
        width: '20%',
        render: (tag) => tag.module_label,
    },
    {
        id: 'color',
        label: 'Cor',
        width: '15%',
        render: (tag) => (
            <span>
                <i className="fa fa-circle" style={{ color: tag.color }} aria-hidden="true" />{' '}
                {tag.color}
            </span>
        ),
    },
    {
        id: 'status',
        label: 'Status',
        width: '15%',
        render: (tag) => (
            <TableLabel tone={tag.is_active ? 'success' : 'inverse'}>
                {tag.is_active ? 'Ativo' : 'Inativo'}
            </TableLabel>
        ),
    },
];

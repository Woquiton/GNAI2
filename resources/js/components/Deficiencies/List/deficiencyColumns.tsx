import { formatTableListText, type TableListColumn } from '@/components/Tables/TableList/TableList';
import TableLabel from '@/components/UI/TableLabel/TableLabel';
import type { DeficiencyRecord } from '../Deficiencies.types';

/** Colunas da listagem; CID e descrição começam ocultos no seletor de colunas. */
export const deficiencyColumns: TableListColumn<DeficiencyRecord>[] = [
    {
        id: 'name',
        label: 'Nome / CID',
        width: '58%',
        fixed: 'start',
        render: (deficiency) => (
            <span className="deficiencyList__identity">
                <span>{deficiency.name}</span>
                <small>{deficiency.cid_code || 'S/ CID'}</small>
            </span>
        ),
    },
    {
        id: 'status',
        label: 'Status',
        width: '20%',
        render: (deficiency) => (
            <TableLabel tone={deficiency.is_active ? 'success' : 'inverse'}>
                {deficiency.is_active ? 'Ativo' : 'Inativo'}
            </TableLabel>
        ),
    },
    {
        id: 'cid',
        label: 'Código CID',
        width: '16%',
        defaultVisible: false,
        render: (deficiency) => deficiency.cid_code || 'Não informado',
    },
    {
        id: 'description',
        label: 'Descrição',
        width: '16%',
        defaultVisible: false,
        render: (deficiency) => formatTableListText(deficiency.description),
    },
];

import { formatTableListText, type TableListColumn } from '@/components/Tables/TableList/TableList';
import TableLabel from '@/components/UI/TableLabel/TableLabel';
import type { LocationRecord } from '../Locations.types';

const NOT_INFORMED = 'Não informado';

/** Colunas da listagem; as complementares começam ocultas no seletor de colunas. */
export const locationColumns: TableListColumn<LocationRecord>[] = [
    {
        id: 'name',
        label: 'Nome',
        width: '29%',
        fixed: 'start',
        render: (location) => location.name || 'N/A',
    },
    {
        id: 'institution',
        label: 'Instituição',
        width: '25%',
        render: (location) => location.institution?.name || 'N/A',
    },
    {
        id: 'type',
        label: 'Tipo',
        width: '18%',
        render: (location) => location.type || NOT_INFORMED,
    },
    {
        id: 'status',
        label: 'Status',
        width: '13%',
        render: (location) => (
            <TableLabel tone={location.is_active ? 'success' : 'inverse'}>
                {location.is_active ? 'Ativo' : 'Inativo'}
            </TableLabel>
        ),
    },
    {
        id: 'description',
        label: 'Descrição',
        width: '16%',
        defaultVisible: false,
        render: (location) => formatTableListText(location.description),
    },
    {
        id: 'latitude',
        label: 'Latitude',
        width: '16%',
        defaultVisible: false,
        render: (location) => location.latitude ?? NOT_INFORMED,
    },
    {
        id: 'longitude',
        label: 'Longitude',
        width: '16%',
        defaultVisible: false,
        render: (location) => location.longitude ?? NOT_INFORMED,
    },
];

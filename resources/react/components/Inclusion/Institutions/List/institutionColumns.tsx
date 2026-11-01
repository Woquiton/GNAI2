import { formatTableListText, type TableListColumn } from '@/components/Tables/TableList/TableList';
import TableLabel from '@/components/UI/TableLabel/TableLabel';
import type { InstitutionRecord } from '../Institutions.types';

const NOT_INFORMED = 'Não informado';

/** Colunas da listagem; as complementares começam ocultas no seletor de colunas. */
export const institutionColumns: TableListColumn<InstitutionRecord>[] = [
    {
        id: 'name',
        label: 'Nome',
        width: '39%',
        fixed: 'start',
        render: (institution) => institution.name,
    },
    {
        id: 'location',
        label: 'Localização',
        width: '28%',
        render: (institution) => `${institution.city} - ${institution.state}`,
    },
    {
        id: 'status',
        label: 'Status',
        width: '15%',
        render: (institution) => (
            <TableLabel tone={institution.is_active ? 'success' : 'inverse'}>
                {institution.is_active ? 'Ativo' : 'Inativo'}
            </TableLabel>
        ),
    },
    {
        id: 'shortName',
        label: 'Sigla',
        width: '16%',
        defaultVisible: false,
        render: (institution) => institution.short_name || NOT_INFORMED,
    },
    {
        id: 'district',
        label: 'Bairro',
        width: '16%',
        defaultVisible: false,
        render: (institution) => institution.district || NOT_INFORMED,
    },
    {
        id: 'address',
        label: 'Endereço',
        width: '16%',
        defaultVisible: false,
        render: (institution) => formatTableListText(institution.address),
    },
    {
        id: 'zoom',
        label: 'Zoom padrão',
        width: '16%',
        defaultVisible: false,
        render: (institution) => institution.default_zoom,
    },
    {
        id: 'latitude',
        label: 'Latitude',
        width: '16%',
        defaultVisible: false,
        render: (institution) => institution.latitude ?? NOT_INFORMED,
    },
    {
        id: 'longitude',
        label: 'Longitude',
        width: '16%',
        defaultVisible: false,
        render: (institution) => institution.longitude ?? NOT_INFORMED,
    },
];

import {
    formatTableListDate,
    TableListPersonCell,
    type TableListColumn,
} from '@/components/Tables/TableList/TableList';
import TableLabel from '@/components/UI/TableLabel/TableLabel';
import { NOT_INFORMED } from '../Professionals.constants';
import type { ProfessionalListRecord } from '../Professionals.types';

interface ProfessionalStatusMaps {
    labels: Record<string, string>;
    tones: Record<string, string>;
}

/** Colunas de dados; matrícula, telefone, ingresso e site começam ocultas no seletor. */
export function professionalColumns({
    labels,
    tones,
}: ProfessionalStatusMaps): TableListColumn<ProfessionalListRecord>[] {
    return [
        {
            id: 'name',
            label: 'Nome',
            width: '32%',
            fixed: 'start',
            render: ({ person }) => (
                <TableListPersonCell name={person.name} photoUrl={person.photo_url} />
            ),
        },
        {
            id: 'email',
            label: 'E-mail',
            width: '26%',
            render: (professional) => professional.person.email || NOT_INFORMED,
        },
        {
            id: 'position',
            label: 'Cargo',
            width: '17%',
            render: (professional) => professional.position?.name || NOT_INFORMED,
        },
        {
            id: 'status',
            label: 'Status',
            width: '11%',
            render: ({ status }) =>
                status ? (
                    <TableLabel tone={tones[status] ?? 'inverse'}>
                        {labels[status] ?? status}
                    </TableLabel>
                ) : (
                    NOT_INFORMED
                ),
        },
        {
            id: 'registration',
            label: 'Matrícula',
            width: '16%',
            defaultVisible: false,
            render: (professional) => professional.registration || NOT_INFORMED,
        },
        {
            id: 'phone',
            label: 'Telefone',
            width: '16%',
            defaultVisible: false,
            render: (professional) => professional.person.phone || NOT_INFORMED,
        },
        {
            id: 'entry',
            label: 'Ingresso',
            width: '16%',
            defaultVisible: false,
            render: (professional) => formatTableListDate(professional.entry_date),
        },
        {
            id: 'website',
            label: 'Aparece no site',
            width: '14%',
            defaultVisible: false,
            render: (professional) => (professional.show_on_website ? 'Sim' : 'Não'),
        },
    ];
}

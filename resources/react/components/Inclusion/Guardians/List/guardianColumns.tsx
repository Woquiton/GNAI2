import PersonIdentity from '@/components/Inclusion/People/PersonIdentity';
import { formatTableListDate, type TableListColumn } from '@/components/Tables/TableList/TableList';
import type { GuardianRecord } from '../Guardians.types';

const NOT_INFORMED = 'Não informado';

/** Colunas da listagem; e-mail, telefone e nascimento começam ocultos no seletor de colunas. */
export function guardianColumns(
    relationships: Record<string, string>,
): TableListColumn<GuardianRecord>[] {
    return [
        {
            id: 'name',
            label: 'Responsável',
            width: '30%',
            fixed: 'start',
            render: (guardian) => (
                <PersonIdentity name={guardian.person.name} photoUrl={guardian.person.photo_url} />
            ),
        },
        {
            id: 'document',
            label: 'CPF',
            width: '16%',
            render: (guardian) => guardian.person.document || NOT_INFORMED,
        },
        {
            id: 'relationship',
            label: 'Vínculo',
            width: '14%',
            render: (guardian) =>
                guardian.relationship
                    ? (relationships[guardian.relationship] ?? guardian.relationship)
                    : NOT_INFORMED,
        },
        {
            id: 'contact',
            label: 'Contato',
            width: '26%',
            render: (guardian) => guardian.person.email || guardian.person.phone || NOT_INFORMED,
        },
        {
            id: 'email',
            label: 'E-mail',
            width: '16%',
            defaultVisible: false,
            render: (guardian) => guardian.person.email || NOT_INFORMED,
        },
        {
            id: 'phone',
            label: 'Telefone',
            width: '16%',
            defaultVisible: false,
            render: (guardian) => guardian.person.phone || NOT_INFORMED,
        },
        {
            id: 'birth',
            label: 'Nascimento',
            width: '16%',
            defaultVisible: false,
            render: (guardian) => formatTableListDate(guardian.person.birth_date),
        },
    ];
}

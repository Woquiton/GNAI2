import { formatTableListText, type TableListColumn } from '@/components/Tables/TableList/TableList';
import TableLabel from '@/components/UI/TableLabel/TableLabel';
import { UNKNOWN_PROFILE } from '../StudentDeficiencies.constants';
import type { StudentDeficiencyListRecord } from '../StudentDeficiencies.types';

export function profileName(profile: StudentDeficiencyListRecord): string {
    return profile.deficiency?.name ?? UNKNOWN_PROFILE;
}

function SeverityLabel({ profile }: { profile: StudentDeficiencyListRecord }): React.ReactNode {
    if (!profile.severity_label) {
        return 'Não informada';
    }

    return (
        <TableLabel tone={profile.severity_color ?? 'inverse'}>{profile.severity_label}</TableLabel>
    );
}

/** Colunas de dados; observações começam ocultas no seletor de colunas. */
export const studentDeficiencyColumns: TableListColumn<StudentDeficiencyListRecord>[] = [
    { id: 'name', label: 'Nome', width: '46%', fixed: 'start', render: profileName },
    {
        id: 'severity',
        label: 'Severidade',
        width: '26%',
        render: (profile) => <SeverityLabel profile={profile} />,
    },
    {
        id: 'notes',
        label: 'Observações',
        width: '16%',
        defaultVisible: false,
        render: (profile) => formatTableListText(profile.notes),
    },
];

import TableLabel from '@/components/UI/TableLabel/TableLabel';

/** Indicador Sim/Não da situação do aluno e das necessidades do PAEE. */
export default function TeacherPortalYesNo({ value }: { value: boolean }): React.JSX.Element {
    return <TableLabel tone={value ? 'success' : 'danger'}>{value ? 'Sim' : 'Não'}</TableLabel>;
}

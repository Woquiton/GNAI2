import type { AttendanceDetailsValues } from '@/components/Inclusion/Sessions/Form/AttendanceDetailsFields';

/**
 * Estado do atendimento pedagógico. O cabeçalho (data, horário, local e aluno) só é enviado no
 * registro direto e, sem o aluno, na edição; a criação pelo agendamento envia o id dele.
 */
export interface PedagogicalRecordFormData extends AttendanceDetailsValues {
    with_guardians: boolean;
    guardian_ids: number[];
    follow_up_reason: string;
    duration: string;
    is_present: boolean;
    absence_reason: string;
    systematic_pedagogical_follow_up_record: string;
    strategies_and_resources_adopted: string;
    referrals_made: string;
    complementary_observations: string;
}

/** Campos exibidos quando o aluno esteve presente ou houve responsáveis participantes. */
export type PedagogicalContentField =
    | 'systematic_pedagogical_follow_up_record'
    | 'strategies_and_resources_adopted'
    | 'referrals_made'
    | 'complementary_observations';

export interface PedagogicalRecordFormData {
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

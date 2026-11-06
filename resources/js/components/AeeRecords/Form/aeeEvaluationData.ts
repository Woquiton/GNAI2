import { isBlankText } from '@/components/AttendanceRecordTabs/useAttendanceRecordTabs';
import type { AeeStudentEvaluationRecord } from '../AeeRecords.types';
import type { AeeEvaluationFormData } from './AeeRecordForm.types';

type EvaluationPayload = Record<string, string | number | boolean | number[] | null>;

const absenceFields = ['absence_reason'] as const;
const presenceFields = [
    'student_participation',
    'adaptations_made',
    'development_evaluation',
    'progress_indicators',
    'recommendations',
    'next_session_adjustments',
] as const;

export function emptyEvaluation(studentId: number): AeeEvaluationFormData {
    return {
        student_id: studentId,
        is_present: true,
        with_guardians: false,
        guardian_ids: [],
        absence_reason: '',
        student_participation: '',
        adaptations_made: '',
        development_evaluation: '',
        progress_indicators: '',
        recommendations: '',
        next_session_adjustments: '',
    };
}

export function evaluationFromRecord(
    evaluation: AeeStudentEvaluationRecord,
): AeeEvaluationFormData {
    return {
        student_id: evaluation.student_id,
        is_present: Boolean(evaluation.is_present),
        with_guardians: Boolean(evaluation.with_guardians),
        guardian_ids: (evaluation.guardians ?? []).map((guardian) => Number(guardian.id)),
        absence_reason: evaluation.absence_reason ?? '',
        student_participation: evaluation.student_participation ?? '',
        adaptations_made: evaluation.adaptations_made ?? '',
        development_evaluation: evaluation.development_evaluation ?? '',
        progress_indicators: evaluation.progress_indicators ?? '',
        recommendations: evaluation.recommendations ?? '',
        next_session_adjustments: evaluation.next_session_adjustments ?? '',
    };
}

/**
 * Obrigatórios sem resposta na avaliação, conforme a presença: participação e desenvolvimento
 * (e os responsáveis, se marcados) para o aluno presente; o motivo da ausência para o ausente.
 */
export function pendingEvaluationFields(evaluation: AeeEvaluationFormData): number {
    if (!evaluation.is_present) {
        return isBlankText(evaluation.absence_reason) ? 1 : 0;
    }

    return (
        [evaluation.student_participation, evaluation.development_evaluation].filter((value) =>
            isBlankText(value),
        ).length + (evaluation.with_guardians && evaluation.guardian_ids.length === 0 ? 1 : 0)
    );
}

/**
 * Reproduz o legado: os campos ocultos pela presença/ausência do aluno
 * eram limpos e desabilitados, chegando ao backend sem valor.
 */
export function evaluationPayload(evaluation: AeeEvaluationFormData): EvaluationPayload {
    // A participação de responsáveis só existe com o aluno presente (como no Blade).
    const withGuardians = evaluation.is_present && evaluation.with_guardians;
    const payload: EvaluationPayload = {
        ...evaluation,
        with_guardians: withGuardians,
        guardian_ids: withGuardians ? evaluation.guardian_ids : [],
    };
    const hidden = evaluation.is_present ? absenceFields : presenceFields;

    hidden.forEach((field) => {
        payload[field] = null;
    });

    return payload;
}

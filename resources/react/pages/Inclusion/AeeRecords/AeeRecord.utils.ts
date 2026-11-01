import type {
    AeeEvaluationFormData,
    AeeStudentEvaluationRecord,
} from "./AeeRecord.types";

export const aeeBase = "/inclusao";
export const sessionShowUrl = (id: number): string => `${aeeBase}/agendamentos/${id}/visualizar`;
export const aeeRecordShowUrl = (id: number): string => `${aeeBase}/atendimentos-aee/${id}/visualizar`;
export const aeeRecordPdfUrl = (id: number): string => `${aeeBase}/atendimentos-aee/${id}/pdf`;
export const aeeRecordsIndexUrl = `${aeeBase}/atendimentos-aee`;
export const myAeeRecordsUrl = `${aeeBase}/meus-atendimentos-aee`;
export const studentAeeRecordsUrl = (studentId: number): string => `${aeeBase}/alunos/${studentId}/atendimentos-aee`;
export const studentAeeEvaluationUrl = (
    studentId: number,
    evaluationId: number,
    action = "visualizar",
): string => `${studentAeeRecordsUrl(studentId)}/${evaluationId}${action ? `/${action}` : ""}`;

export const absenceFields = ["absence_reason"] as const;
export const presenceFields = [
    "student_participation",
    "adaptations_made",
    "development_evaluation",
    "progress_indicators",
    "recommendations",
    "next_session_adjustments",
] as const;

export function emptyEvaluation(studentId: number): AeeEvaluationFormData {
    return {
        student_id: studentId,
        is_present: true,
        with_guardians: false,
        guardian_ids: [],
        absence_reason: "",
        student_participation: "",
        adaptations_made: "",
        development_evaluation: "",
        progress_indicators: "",
        recommendations: "",
        next_session_adjustments: "",
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
        absence_reason: evaluation.absence_reason ?? "",
        student_participation: evaluation.student_participation ?? "",
        adaptations_made: evaluation.adaptations_made ?? "",
        development_evaluation: evaluation.development_evaluation ?? "",
        progress_indicators: evaluation.progress_indicators ?? "",
        recommendations: evaluation.recommendations ?? "",
        next_session_adjustments: evaluation.next_session_adjustments ?? "",
    };
}

/**
 * Reproduz o legado: os campos ocultos pela presença/ausência do aluno
 * eram limpos e desabilitados, chegando ao backend sem valor.
 */
export function evaluationPayload(
    evaluation: AeeEvaluationFormData,
): Record<string, string | number | boolean | number[] | null> {
    // A participação de responsáveis só existe com o aluno presente (como no Blade).
    const withGuardians = evaluation.is_present && evaluation.with_guardians;
    const payload: Record<string, string | number | boolean | number[] | null> = {
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

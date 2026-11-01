import { useForm } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import { useFormSubmission } from '@/components/Forms/FormLayout/useFormSubmission';
import { AEE_RECORD_SAVE_FAILURE_TEXT, aeeStudentName } from '../AeeRecords.constants';
import { aeeRecordUrls } from '../AeeRecords.routes';
import type { AeeRecordRecord, AeeSession } from '../AeeRecords.types';
import { emptyEvaluation, evaluationFromRecord, evaluationPayload } from './aeeEvaluationData';
import type {
    AeeEvaluationFormData,
    AeeEvaluationTab,
    AeeRecordFormData,
} from './AeeRecordForm.types';

interface UseAeeRecordFormOptions {
    session: AeeSession;
    aeeRecord?: AeeRecordRecord;
}

/** Na edição, as abas seguem as avaliações salvas; no cadastro, os alunos do agendamento. */
function evaluationTabs(session: AeeSession, aeeRecord?: AeeRecordRecord): AeeEvaluationTab[] {
    if (aeeRecord) {
        return (aeeRecord.student_evaluations ?? []).map((evaluation) => ({
            key: `student-${evaluation.student_id}`,
            studentId: evaluation.student_id,
            name: aeeStudentName(evaluation.student, evaluation.student_id),
        }));
    }

    return (session.students ?? []).map((student) => ({
        key: `student-${student.id}`,
        studentId: student.id,
        name: aeeStudentName(student, student.id),
    }));
}

function initialData(session: AeeSession, aeeRecord?: AeeRecordRecord): AeeRecordFormData {
    return {
        attendance_session_id: aeeRecord?.attendance_session_id ?? session.id,
        duration: aeeRecord?.duration ?? '',
        activities_performed: aeeRecord?.activities_performed ?? '',
        strategies_used: aeeRecord?.strategies_used ?? '',
        resources_used: aeeRecord?.resources_used ?? '',
        general_observations: aeeRecord?.general_observations ?? '',
        evaluations: aeeRecord
            ? (aeeRecord.student_evaluations ?? []).map(evaluationFromRecord)
            : (session.students ?? []).map((student) => emptyEvaluation(student.id)),
    };
}

/**
 * Estado e envio do registro do atendimento com as avaliações de cada aluno. Após erros de
 * validação restritos a uma avaliação, a aba desse aluno é aberta e o primeiro campo inválido
 * recebe o foco.
 */
export function useAeeRecordForm({ session, aeeRecord }: UseAeeRecordFormOptions) {
    const students = useMemo(() => evaluationTabs(session, aeeRecord), [session, aeeRecord]);
    const form = useForm<AeeRecordFormData>(initialData(session, aeeRecord));
    const submission = useFormSubmission(form);
    const errors = form.errors as Record<string, string | undefined>;
    const [tabFocus, setTabFocus] = useState<{ id?: string; version: number }>({
        id: students[0]?.key,
        version: 0,
    });

    const collectionErrors = Object.entries(errors)
        .filter(
            ([key, message]) =>
                message && (key === 'evaluations' || /^evaluations\.\d+\.student_id$/.test(key)),
        )
        .map(([, message]) => message as string);

    function evaluationErrorFor(index: number, field: string): string | undefined {
        return errors[`evaluations.${index}.${field}`];
    }

    function evaluationHasErrors(index: number): boolean {
        return Object.keys(errors).some(
            (key) => key.startsWith(`evaluations.${index}.`) && errors[key],
        );
    }

    function updateEvaluation(index: number, changes: Partial<AeeEvaluationFormData>): void {
        form.setData((data) => ({
            ...data,
            evaluations: data.evaluations.map((evaluation, position) =>
                position === index ? { ...evaluation, ...changes } : evaluation,
            ),
        }));
    }

    function focusInvalidEvaluation(received: Record<string, string>): void {
        const invalidIndex = form.data.evaluations.findIndex((_, index) =>
            Object.keys(received).some((key) => key.startsWith(`evaluations.${index}.`)),
        );
        const generalInvalid = Object.keys(received).some((key) => !key.startsWith('evaluations'));

        if (!generalInvalid && invalidIndex >= 0 && students[invalidIndex]) {
            const id = students[invalidIndex].key;
            setTabFocus((current) => ({ id, version: current.version + 1 }));
        }

        requestAnimationFrame(() => {
            submission.formRef.current
                ?.querySelector<HTMLElement>('[aria-invalid="true"]')
                ?.focus();
        });
    }

    function save(): void {
        submission.submit({
            url: aeeRecord ? aeeRecordUrls.update(aeeRecord.id) : aeeRecordUrls.store,
            method: aeeRecord ? 'put' : 'post',
            failureText: AEE_RECORD_SAVE_FAILURE_TEXT,
            transform: () => {
                const data = form.data;
                return {
                    ...data,
                    evaluations: data.evaluations.map(evaluationPayload),
                };
            },
            options: {
                onError: focusInvalidEvaluation,
            },
        });
    }

    return {
        form,
        errors,
        formRef: submission.formRef,
        students,
        tabFocus,
        collectionErrors,
        evaluationErrorFor,
        evaluationHasErrors,
        updateEvaluation,
        save,
    };
}

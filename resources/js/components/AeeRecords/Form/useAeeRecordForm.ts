import { useForm } from '@inertiajs/react';
import { useState } from 'react';
import { useEditorFailure } from '@/components/Forms/FormLayout/useEditorFailure';
import { useFormSubmission } from '@/components/Forms/FormLayout/useFormSubmission';
import {
    type AttendanceRecordTabId,
    isBlankText,
    pendingAttendanceDetails,
    useAttendanceRecordTabs,
} from '@/components/AttendanceRecordTabs/useAttendanceRecordTabs';
import type { AttendanceDetailsField } from '@/components/Sessions/Form/AttendanceDetailsFields';
import { adjustEndTime, personName } from '@/components/Sessions/Form/SessionForm.utils';
import { useStudentRows } from '@/components/Sessions/Form/useStudentRows';
import {
    GROUP_SESSION,
    INDIVIDUAL_SESSION,
    localDate,
} from '@/components/Sessions/Sessions.constants';
import type {
    AttendanceCorrectionProps,
    SessionOptionMap,
} from '@/components/Sessions/Sessions.types';
import { AEE_RECORD_SAVE_FAILURE_TEXT, aeeStudentName } from '../AeeRecords.constants';
import { aeeRecordUrls } from '../AeeRecords.routes';
import type { AeeRecordCreateDirectProps, AeeRecordRecord, AeeSession } from '../AeeRecords.types';
import {
    emptyEvaluation,
    evaluationFromRecord,
    evaluationPayload,
    pendingEvaluationFields,
} from './aeeEvaluationData';
import type {
    AeeEvaluationFormData,
    AeeEvaluationTab,
    AeeRecordFormData,
} from './AeeRecordForm.types';

/**
 * Registro a partir de um agendamento, edição (com correção de data, horário e local) ou registro
 * direto de um atendimento já realizado, que cria o agendamento junto.
 */
export type UseAeeRecordFormOptions =
    | { mode: 'session'; session: AeeSession }
    | {
          mode: 'edit';
          session: AeeSession;
          aeeRecord: AeeRecordRecord;
          correction: AttendanceCorrectionProps;
      }
    | { mode: 'direct'; direct: AeeRecordCreateDirectProps };

const emptyRecordFields = {
    duration: '',
    activities_performed: '',
    strategies_used: '',
    resources_used: '',
    general_observations: '',
};

const emptyDetails = {
    session_date: '',
    start_time: '',
    end_time: '',
    location: '',
    type: INDIVIDUAL_SESSION,
};

function initialData(options: UseAeeRecordFormOptions): AeeRecordFormData {
    if (options.mode === 'direct') {
        return {
            ...emptyDetails,
            ...emptyRecordFields,
            // Atendimento já realizado: começa no dia de hoje, a data mais comum.
            session_date: localDate(),
            attendance_session_id: null,
            student_ids: [''],
            evaluations: [],
        };
    }

    const { session } = options;
    const studentIds = (session.students ?? []).map((student) => String(student.id));

    if (options.mode === 'session') {
        return {
            ...emptyDetails,
            ...emptyRecordFields,
            attendance_session_id: session.id,
            student_ids: studentIds,
            evaluations: (session.students ?? []).map((student) => emptyEvaluation(student.id)),
        };
    }

    const { aeeRecord } = options;

    return {
        ...emptyDetails,
        ...options.correction.attendanceForm,
        attendance_session_id: aeeRecord.attendance_session_id,
        student_ids: studentIds,
        duration: aeeRecord.duration ?? '',
        activities_performed: aeeRecord.activities_performed ?? '',
        strategies_used: aeeRecord.strategies_used ?? '',
        resources_used: aeeRecord.resources_used ?? '',
        general_observations: aeeRecord.general_observations ?? '',
        evaluations: (aeeRecord.student_evaluations ?? []).map(evaluationFromRecord),
    };
}

/** Na edição, as abas seguem as avaliações salvas; no cadastro, os alunos do agendamento. */
function savedEvaluationTabs(options: UseAeeRecordFormOptions): AeeEvaluationTab[] {
    if (options.mode === 'edit') {
        return (options.aeeRecord.student_evaluations ?? []).map((evaluation) => ({
            key: `student-${evaluation.student_id}`,
            studentId: evaluation.student_id,
            name: aeeStudentName(evaluation.student, evaluation.student_id),
        }));
    }

    if (options.mode === 'session') {
        return (options.session.students ?? []).map((student) => ({
            key: `student-${student.id}`,
            studentId: student.id,
            name: aeeStudentName(student, student.id),
        }));
    }

    return [];
}

/** Alunos escolhidos no registro direto, sem linhas vazias nem repetições. */
function selectedStudentIds(studentIds: string[]): number[] {
    return [...new Set(studentIds.filter(Boolean).map(Number))];
}

/** Uma avaliação por aluno escolhido, preservando o que já foi preenchido. */
function syncEvaluations(
    studentIds: string[],
    evaluations: AeeEvaluationFormData[],
): AeeEvaluationFormData[] {
    return selectedStudentIds(studentIds).map(
        (id) =>
            evaluations.find((evaluation) => evaluation.student_id === id) ?? emptyEvaluation(id),
    );
}

/** Obrigatórios sem resposta em cada aba, para a bolinha vermelha. */
function pendingByTab(
    mode: UseAeeRecordFormOptions['mode'],
    data: AeeRecordFormData,
): Record<AttendanceRecordTabId, number> {
    return {
        details: mode === 'session' ? 0 : pendingAttendanceDetails(data, mode === 'direct'),
        general: [data.duration, data.activities_performed].filter((value) => isBlankText(value))
            .length,
        evaluations: data.evaluations.reduce(
            (total, evaluation) => total + pendingEvaluationFields(evaluation),
            0,
        ),
    };
}

function recordPayload(data: AeeRecordFormData): Record<string, unknown> {
    return {
        duration: data.duration,
        activities_performed: data.activities_performed,
        strategies_used: data.strategies_used,
        resources_used: data.resources_used,
        general_observations: data.general_observations,
        evaluations: data.evaluations.map(evaluationPayload),
    };
}

/** Somente o cabeçalho previsto em cada operação acompanha o registro. */
function payload(mode: UseAeeRecordFormOptions['mode'], data: AeeRecordFormData) {
    const schedule = {
        session_date: data.session_date,
        start_time: data.start_time,
        end_time: data.end_time,
        location: data.location,
    };

    if (mode === 'session') {
        return { attendance_session_id: data.attendance_session_id, ...recordPayload(data) };
    }

    if (mode === 'edit') {
        return { ...schedule, ...recordPayload(data) };
    }

    return {
        student_ids: data.student_ids.filter(Boolean),
        type: data.type,
        ...schedule,
        ...recordPayload(data),
    };
}

/** Horários de término aceitos, para acompanhar o início escolhido. */
function endTimesFor(options: UseAeeRecordFormOptions): SessionOptionMap {
    if (options.mode === 'edit') return options.correction.endTimes;
    if (options.mode === 'direct') return options.direct.endTimes;

    return {};
}

function submitUrl(options: UseAeeRecordFormOptions): string {
    if (options.mode === 'edit') return aeeRecordUrls.update(options.aeeRecord.id);
    if (options.mode === 'direct') return aeeRecordUrls.directStore;

    return aeeRecordUrls.store;
}

/**
 * Estado e envio do registro do atendimento com as avaliações de cada aluno. Após erros de
 * validação, a primeira etapa com erros é aberta (e, se forem só de uma avaliação, a aba desse
 * aluno) e o primeiro campo inválido recebe o foco. No registro direto, as avaliações acompanham
 * os alunos escolhidos.
 */
export function useAeeRecordForm(options: UseAeeRecordFormOptions) {
    const form = useForm<AeeRecordFormData>(initialData(options));
    const submission = useFormSubmission(form);
    const { editorFailed, reportEditorFailure } = useEditorFailure(form);
    const errors = form.errors as Record<string, string | undefined>;
    // Pelo agendamento, os dados do atendimento já estão definidos e não têm aba.
    const tabs = useAttendanceRecordTabs(
        options.mode === 'session'
            ? ['general', 'evaluations']
            : ['details', 'general', 'evaluations'],
        errors,
        submission.formRef,
    );
    const direct = options.mode === 'direct' ? options.direct : undefined;
    const studentRows = useStudentRows(form.data.student_ids, (studentIds) =>
        form.setData((data) => ({
            ...data,
            student_ids: studentIds,
            evaluations: syncEvaluations(studentIds, data.evaluations),
        })),
    );
    const students: AeeEvaluationTab[] = direct
        ? selectedStudentIds(form.data.student_ids).map((id) => ({
              key: `student-${id}`,
              studentId: id,
              name: personName(direct.students.find((student) => student.id === id)),
          }))
        : savedEvaluationTabs(options);
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

    function changeDetail(field: AttendanceDetailsField, value: string): void {
        form.setData(field, value);
    }

    function changeStartTime(value: string): void {
        form.setData((data) => ({
            ...data,
            start_time: value,
            end_time: adjustEndTime(endTimesFor(options), value, data.end_time),
        }));
    }

    function changeStudent(index: number, value: string): void {
        studentRows.change(index, value);
        form.clearErrors('student_ids', `student_ids.${index}` as const);
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

        tabs.revealErrors(received);
    }

    function save(): void {
        submission.submit({
            url: submitUrl(options),
            method: options.mode === 'edit' ? 'put' : 'post',
            failureText: AEE_RECORD_SAVE_FAILURE_TEXT,
            blocked: editorFailed,
            transform: () => payload(options.mode, form.data),
            options: {
                onError: focusInvalidEvaluation,
            },
        });
    }

    return {
        form,
        errors,
        formRef: submission.formRef,
        tabs,
        pending: pendingByTab(options.mode, form.data),
        students,
        studentRows,
        canAddStudents: form.data.type === GROUP_SESSION,
        tabFocus,
        collectionErrors,
        evaluationErrorFor,
        evaluationHasErrors,
        updateEvaluation,
        changeDetail,
        changeStartTime,
        changeStudent,
        editorFailed,
        reportEditorFailure,
        save,
    };
}

import { useForm } from '@inertiajs/react';
import { useEditorFailure } from '@/components/Forms/FormLayout/useEditorFailure';
import { useFormSubmission } from '@/components/Forms/FormLayout/useFormSubmission';
import {
    type AttendanceRecordTabId,
    isBlankText,
    pendingAttendanceDetails,
    useAttendanceRecordTabs,
} from '@/components/Inclusion/AttendanceRecordTabs/useAttendanceRecordTabs';
import type { AttendanceDetailsField } from '@/components/Inclusion/Sessions/Form/AttendanceDetailsFields';
import { adjustEndTime } from '@/components/Inclusion/Sessions/Form/SessionForm.utils';
import { useStudentRows } from '@/components/Inclusion/Sessions/Form/useStudentRows';
import { localDate } from '@/components/Inclusion/Sessions/Sessions.constants';
import type {
    AttendanceCorrectionProps,
    SessionOptionMap,
} from '@/components/Inclusion/Sessions/Sessions.types';
import { pedagogicalRecordFailureTexts } from '../PedagogicalRecords.constants';
import { pedagogicalRecordUrls } from '../PedagogicalRecords.routes';
import type {
    PedagogicalRecordCreateDirectProps,
    PedagogicalRecordFormContext,
    PedagogicalRecordFormRecord,
    PedagogicalRecordGuardianOption,
} from '../PedagogicalRecords.types';
import type {
    PedagogicalContentField,
    PedagogicalRecordFormData,
} from './PedagogicalRecordForm.types';

/**
 * Registro a partir de um agendamento, edição (com correção de data, horário e local) ou registro
 * direto de um atendimento já realizado, que cria o agendamento junto.
 */
export type UsePedagogicalRecordFormOptions =
    | { mode: 'session'; context: PedagogicalRecordFormContext }
    | {
          mode: 'edit';
          context: PedagogicalRecordFormContext;
          record: PedagogicalRecordFormRecord;
          correction: AttendanceCorrectionProps;
          /** Aluno de origem: salvar preserva o retorno ao prontuário. */
          returnStudentId?: number;
      }
    | { mode: 'direct'; direct: PedagogicalRecordCreateDirectProps };

const pedagogicalContentFields: PedagogicalContentField[] = [
    'systematic_pedagogical_follow_up_record',
    'strategies_and_resources_adopted',
    'referrals_made',
    'complementary_observations',
];

const clearedPedagogicalContent: Record<PedagogicalContentField, string> = {
    systematic_pedagogical_follow_up_record: '',
    strategies_and_resources_adopted: '',
    referrals_made: '',
    complementary_observations: '',
};

const emptyDetails = {
    session_date: '',
    start_time: '',
    end_time: '',
    location: '',
};

function initialData(options: UsePedagogicalRecordFormOptions): PedagogicalRecordFormData {
    const record = options.mode === 'edit' ? options.record : undefined;
    const context = options.mode === 'direct' ? undefined : options.context;
    const studentId = context?.student_id ? String(context.student_id) : '';

    return {
        ...emptyDetails,
        ...(options.mode === 'edit' ? options.correction.attendanceForm : {}),
        // Atendimento já realizado: o registro direto começa no dia de hoje.
        ...(options.mode === 'direct' ? { session_date: localDate() } : {}),
        student_ids: [studentId],
        with_guardians: (record?.guardians?.length ?? 0) > 0,
        guardian_ids: record?.guardians?.map((guardian) => guardian.id) ?? [],
        follow_up_reason: record?.follow_up_reason ?? context?.session_objective ?? '',
        duration: record?.duration ?? '',
        is_present: record?.is_present ?? true,
        absence_reason: record?.absence_reason ?? '',
        systematic_pedagogical_follow_up_record:
            record?.systematic_pedagogical_follow_up_record ?? '',
        strategies_and_resources_adopted: record?.strategies_and_resources_adopted ?? '',
        referrals_made: record?.referrals_made ?? '',
        complementary_observations: record?.complementary_observations ?? '',
    };
}

/** Envia somente os campos visíveis: ausência e conteúdo pedagógico dependem das escolhas. */
function payload(
    options: UsePedagogicalRecordFormOptions,
    data: PedagogicalRecordFormData,
): Record<string, unknown> {
    const values: Record<string, unknown> = {
        with_guardians: data.with_guardians,
        follow_up_reason: data.follow_up_reason,
        duration: data.duration,
        is_present: data.is_present,
    };

    if (options.mode === 'session') {
        values.attendance_session_id = options.context.session_id;
    } else {
        Object.assign(values, {
            session_date: data.session_date,
            start_time: data.start_time,
            end_time: data.end_time,
            location: data.location,
        });
    }

    if (options.mode === 'direct') {
        values.student_ids = data.student_ids.filter(Boolean);
    }

    if (data.with_guardians) {
        values.guardian_ids = data.guardian_ids;
    }

    if (!data.is_present) {
        values.absence_reason = data.absence_reason;
    }

    if (data.is_present || data.with_guardians) {
        pedagogicalContentFields.forEach((field) => {
            values[field] = data[field];
        });
    }

    return values;
}

/**
 * Obrigatórios sem resposta em cada aba, para a bolinha vermelha. Os responsáveis marcados ficam
 * com os dados do atendimento; motivo da ausência e registro sistemático dependem da presença e da
 * participação de responsáveis, como no backend.
 */
function pendingByTab(
    mode: UsePedagogicalRecordFormOptions['mode'],
    data: PedagogicalRecordFormData,
): Record<AttendanceRecordTabId, number> {
    const pendingGuardians = data.with_guardians && data.guardian_ids.length === 0 ? 1 : 0;
    const followUp = [
        data.follow_up_reason,
        data.duration,
        ...(!data.is_present ? [data.absence_reason] : []),
        ...(data.is_present || data.with_guardians
            ? [data.systematic_pedagogical_follow_up_record]
            : []),
    ].filter((value) => isBlankText(value)).length;

    if (mode === 'session') {
        return { details: 0, general: followUp + pendingGuardians, evaluations: 0 };
    }

    return {
        details: pendingAttendanceDetails(data, mode === 'direct') + pendingGuardians,
        general: followUp,
        evaluations: 0,
    };
}

function submitUrl(options: UsePedagogicalRecordFormOptions): string {
    if (options.mode === 'edit') {
        return pedagogicalRecordUrls.update(options.record.id, options.returnStudentId);
    }

    return options.mode === 'direct'
        ? pedagogicalRecordUrls.directStore
        : pedagogicalRecordUrls.store;
}

/** Horários de término aceitos, para acompanhar o início escolhido. */
function endTimesFor(options: UsePedagogicalRecordFormOptions): SessionOptionMap {
    if (options.mode === 'edit') return options.correction.endTimes;
    if (options.mode === 'direct') return options.direct.endTimes;

    return {};
}

/** Estado, campos condicionais e envio do cadastro/edição do atendimento pedagógico. */
export function usePedagogicalRecordForm(options: UsePedagogicalRecordFormOptions) {
    const form = useForm<PedagogicalRecordFormData>(initialData(options));
    const { formRef, submit } = useFormSubmission(form);
    const { editorFailed, reportEditorFailure } = useEditorFailure(form);
    const errors = form.errors as Record<string, string | undefined>;
    // Pelo agendamento, os dados do atendimento já estão definidos: uma só etapa, sem abas.
    const tabs = useAttendanceRecordTabs(
        options.mode === 'session' ? ['general'] : ['details', 'general'],
        errors,
        formRef,
    );
    const guardianError =
        errors.guardian_ids ??
        Object.entries(errors).find(([key]) => key.startsWith('guardian_ids.'))?.[1];
    // O atendimento pedagógico tem sempre um aluno; no registro direto, trocar o aluno
    // descarta os responsáveis escolhidos, que pertencem ao aluno anterior.
    const studentRows = useStudentRows(form.data.student_ids, (studentIds) => {
        form.setData('student_ids', studentIds);
        updateWithGuardians(false);
    });
    const guardians: PedagogicalRecordGuardianOption[] =
        options.mode === 'direct'
            ? (options.direct.guardiansByStudent[Number(form.data.student_ids[0])] ?? [])
            : options.context.guardians;

    function updatePresence(isPresent: boolean): void {
        form.setData((current) => ({
            ...current,
            is_present: isPresent,
            absence_reason: isPresent ? '' : current.absence_reason,
            ...(!isPresent && !current.with_guardians ? clearedPedagogicalContent : {}),
        }));
    }

    function updateWithGuardians(withGuardians: boolean): void {
        form.setData((current) => ({
            ...current,
            with_guardians: withGuardians,
            guardian_ids: withGuardians ? current.guardian_ids : [],
            ...(!withGuardians && !current.is_present ? clearedPedagogicalContent : {}),
        }));
    }

    function toggleGuardian(id: number, checked: boolean): void {
        form.setData((current) => ({
            ...current,
            guardian_ids: checked
                ? [...current.guardian_ids, id]
                : current.guardian_ids.filter((value) => value !== id),
        }));
    }

    function changeDetail(field: AttendanceDetailsField, value: string): void {
        form.setData(field, value);
    }

    function changeStartTime(value: string): void {
        form.setData((current) => ({
            ...current,
            start_time: value,
            end_time: adjustEndTime(endTimesFor(options), value, current.end_time),
        }));
    }

    function changeStudent(index: number, value: string): void {
        studentRows.change(index, value);
        form.clearErrors('student_ids', `student_ids.${index}` as const);
    }

    function save(): void {
        submit({
            url: submitUrl(options),
            method: options.mode === 'edit' ? 'put' : 'post',
            failureText: pedagogicalRecordFailureTexts.save,
            blocked: editorFailed,
            transform: () => payload(options, form.data),
            options: { onError: tabs.revealErrors },
        });
    }

    return {
        form,
        errors,
        guardianError,
        guardians,
        formRef,
        tabs,
        pending: pendingByTab(options.mode, form.data),
        studentRows,
        editorFailed,
        reportEditorFailure,
        updatePresence,
        updateWithGuardians,
        toggleGuardian,
        changeDetail,
        changeStartTime,
        changeStudent,
        save,
    };
}

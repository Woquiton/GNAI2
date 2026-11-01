import { useForm } from '@inertiajs/react';
import { useFormSubmission } from '@/components/Forms/FormLayout/useFormSubmission';
import { pedagogicalRecordFailureTexts } from '../PedagogicalRecords.constants';
import { pedagogicalRecordUrls } from '../PedagogicalRecords.routes';
import type {
    PedagogicalRecordFormContext,
    PedagogicalRecordFormRecord,
} from '../PedagogicalRecords.types';
import type {
    PedagogicalContentField,
    PedagogicalRecordFormData,
} from './PedagogicalRecordForm.types';

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

function initialData(
    context: PedagogicalRecordFormContext,
    record?: PedagogicalRecordFormRecord,
): PedagogicalRecordFormData {
    return {
        with_guardians: (record?.guardians?.length ?? 0) > 0,
        guardian_ids: record?.guardians?.map((guardian) => guardian.id) ?? [],
        follow_up_reason: record?.follow_up_reason ?? context.session_objective ?? '',
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
    data: PedagogicalRecordFormData,
    sessionId: number | undefined,
): Record<string, unknown> {
    const values: Record<string, unknown> = {
        with_guardians: data.with_guardians,
        follow_up_reason: data.follow_up_reason,
        duration: data.duration,
        is_present: data.is_present,
    };

    if (sessionId !== undefined) {
        values.attendance_session_id = sessionId;
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

interface UsePedagogicalRecordFormOptions {
    context: PedagogicalRecordFormContext;
    record?: PedagogicalRecordFormRecord;
    returnStudentId?: number;
}

/** Estado, campos condicionais e envio do cadastro/edição do atendimento pedagógico. */
export function usePedagogicalRecordForm({
    context,
    record,
    returnStudentId,
}: UsePedagogicalRecordFormOptions) {
    const form = useForm<PedagogicalRecordFormData>(initialData(context, record));
    const { formRef, submit } = useFormSubmission(form);
    const errors = form.errors as Record<string, string | undefined>;
    const guardianError =
        errors.guardian_ids ??
        Object.entries(errors).find(([key]) => key.startsWith('guardian_ids.'))?.[1];

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

    function save(): void {
        submit({
            url: record
                ? pedagogicalRecordUrls.update(record.id, returnStudentId)
                : pedagogicalRecordUrls.store,
            method: record ? 'put' : 'post',
            failureText: pedagogicalRecordFailureTexts.save,
            transform: () => payload(form.data, record ? undefined : context.session_id),
        });
    }

    return {
        form,
        errors,
        guardianError,
        formRef,
        updatePresence,
        updateWithGuardians,
        toggleGuardian,
        save,
    };
}

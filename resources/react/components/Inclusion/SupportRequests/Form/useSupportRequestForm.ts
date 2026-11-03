import { useForm } from '@inertiajs/react';
import { useFormSubmission } from '@/components/Forms/FormLayout/useFormSubmission';
import { supportRequestUrls } from '../SupportRequests.routes';
import type { SupportRequestFormData, SupportRequestFormProps } from './SupportRequestForm.types';

export function useSupportRequestForm({
    supportRequest: record,
    selectedStudentId = '',
    today = '',
    defaults,
}: SupportRequestFormProps) {
    const form = useForm<SupportRequestFormData>({
        student_id: record ? String(record.student_id) : selectedStudentId,
        request_date: record?.request_date ?? today,
        requester_name: record?.requester_name ?? '',
        requester_role: record?.requester_role ?? defaults?.requester_role ?? '',
        course_id: record?.course_id ? String(record.course_id) : '',
        requester_other: record?.requester_other ?? '',
        requester_contact: record?.requester_contact ?? '',
        reason_type: record?.reason_type ?? '',
        reason_profile_ids: record?.reason_profile_ids ?? [],
        reason: record?.reason ?? '',
        school_difficulties: record?.school_difficulties ?? '',
        diagnosis_status: record?.diagnosis_status ?? defaults?.diagnosis_status ?? '',
        diagnosis_notes: record?.diagnosis_notes ?? '',
        requested_supports: record?.requested_supports ?? [],
        other_support: record?.other_support ?? '',
        status: record?.status ?? defaults?.status ?? '',
        analysis_notes: record?.analysis_notes ?? '',
        referrals: record?.referrals ?? '',
        attachments: [],
        remove_attachment_ids: [],
    });
    const { formRef, submit } = useFormSubmission(form);
    const errors = form.errors as Record<string, string | undefined>;
    function save(): void {
        submit({
            url: record ? supportRequestUrls.update(record.id) : supportRequestUrls.store,
            method: record ? 'put' : 'post',
            files: true,
            failureText: 'Não foi possível salvar a solicitação de atendimento. Tente novamente.',
        });
    }
    const update = <K extends keyof SupportRequestFormData>(
        key: K,
        value: SupportRequestFormData[K],
    ) =>
        form.setData((current) => ({
            ...current,
            [key]: value,
            ...(key === 'reason_type' && value !== 'profile' ? { reason_profile_ids: [] } : {}),
        }));

    return { form, formRef, errors, save, update };
}

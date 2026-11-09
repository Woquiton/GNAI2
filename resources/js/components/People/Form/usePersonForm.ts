import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { useFormSubmission } from '@/components/Forms/FormLayout/useFormSubmission';
import type { PersonFormData, PersonFormProps, PersonRole, RoleDetails } from '../People.types';
import { personUrls } from '../People.routes';

export function usePersonForm(options: PersonFormProps) {
    const { person, defaults } = options;
    const roles: PersonRole[] = [];
    const details = {} as Record<PersonRole, RoleDetails>;
    for (const role of ['student', 'teacher', 'professional', 'guardian'] as const) {
        const record = role === 'guardian' ? null : person?.[role];
        if (record || (role === 'guardian' && person?.guardians.length)) roles.push(role);
        details[role] = {
            registration: record?.registration ?? '',
            entry_date:
                (role === 'student'
                    ? person?.student?.entry_date
                    : person?.professional?.entry_date
                )?.slice(0, 10) ?? '',
            status:
                role === 'student'
                    ? (person?.student?.status ?? defaults.studentStatus)
                    : (person?.professional?.status ?? defaults.professionalStatus),
            follow_up_type: role === 'student' ? (person?.student?.follow_up_type ?? '') : '',
            position_id:
                role === 'professional' ? String(person?.professional?.position_id ?? '') : '',
            show_on_website:
                role === 'professional' ? (person?.professional?.show_on_website ?? false) : false,
            links:
                person?.guardians.map((link) => ({
                    student_id: String(link.student_id),
                    relationship: link.relationship,
                })) ?? [],
        };
    }
    const form = useForm<PersonFormData>({
        name: person?.name ?? '',
        document: person?.document ?? '',
        birth_date: person?.birth_date?.slice(0, 10) ?? '',
        gender: person?.gender ?? defaults.gender,
        email: person?.email ?? '',
        phone: person?.phone ?? '',
        address: person?.address ?? '',
        photo: null,
        remove_photo: false,
        roles,
        details,
        tag_ids: person?.tags.map((tag) => tag.id) ?? [],
    });
    const { formRef, submit } = useFormSubmission(form);
    const [editorFailed, setEditorFailed] = useState(false);
    const [photoValidating, setPhotoValidating] = useState(false);
    function updateDetails(role: PersonRole, value: Partial<RoleDetails>) {
        form.setData((data) => ({
            ...data,
            details: { ...data.details, [role]: { ...data.details[role], ...value } },
        }));
    }
    function save() {
        submit({
            url: person ? personUrls.update(person.id) : personUrls.store,
            method: person ? 'put' : 'post',
            files: true,
            blocked: editorFailed || photoValidating,
            failureText: 'Não foi possível salvar a pessoa. Tente novamente.',
        });
    }
    return {
        form,
        formRef,
        save,
        existingRoles: roles,
        updateDetails,
        editorFailed,
        setEditorFailed,
        photoValidating,
        setPhotoValidating,
    };
}
export type PersonFormState = ReturnType<typeof usePersonForm>;

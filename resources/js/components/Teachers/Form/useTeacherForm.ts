import { useForm } from '@inertiajs/react';
import { useState } from 'react';
import { useEditorFailure } from '@/components/Forms/FormLayout/useEditorFailure';
import { useFormSubmission } from '@/components/Forms/FormLayout/useFormSubmission';
import { cpfMask, phoneMask } from '@/utils/masks';
import { teacherUrls } from '../Teachers.routes';
import type { TeacherRecord } from '../Teachers.types';
import type { TeacherFormData, TeacherFormMode } from './TeacherForm.types';

function initialData(teacher?: TeacherRecord): TeacherFormData {
    const person = teacher?.person;

    return {
        name: person?.name ?? '',
        document: cpfMask(person?.document ?? ''),
        birth_date: person?.birth_date?.slice(0, 10) ?? '',
        gender: person?.gender ?? 'not_specified',
        email: person?.email ?? '',
        phone: phoneMask(person?.phone ?? ''),
        address: person?.address ?? '',
        registration: teacher?.registration ?? '',
        photo: null,
        remove_photo: false,
        password: '',
        password_confirmation: '',
    };
}

/** Estado, validação da foto e envio multipart do cadastro/edição de professores. */
export function useTeacherForm(mode: TeacherFormMode, teacher?: TeacherRecord) {
    const editing = mode === 'edit';
    const form = useForm<TeacherFormData>(initialData(teacher));
    const errors = form.errors as Record<string, string | undefined>;
    const [photoValidating, setPhotoValidating] = useState(false);
    const { editorFailed, reportEditorFailure } = useEditorFailure(form);

    /** Payload de `Create/UpdateTeacherData`: a senha inicial é opcional e só existe no cadastro. */
    function payload(data: TeacherFormData): Record<string, unknown> {
        const {
            remove_photo: removePhoto,
            password,
            password_confirmation: passwordConfirmation,
            ...common
        } = data;

        return editing
            ? { ...common, remove_photo: removePhoto }
            : { ...common, password, password_confirmation: passwordConfirmation };
    }

    const { formRef, submit } = useFormSubmission(form);

    function save(): void {
        submit({
            url: teacher ? teacherUrls.update(teacher.id) : teacherUrls.store,
            method: editing ? 'put' : 'post',
            files: true,
            transform: (data) => payload(data as TeacherFormData),
            failureText: editing
                ? 'Não foi possível atualizar o professor. Tente novamente.'
                : 'Não foi possível cadastrar o professor. Tente novamente.',
            blocked: photoValidating || editorFailed,
            options: {
                // A senha nunca permanece no formulário depois de uma tentativa de envio.
                onFinish: () =>
                    form.setData((data) => ({ ...data, password: '', password_confirmation: '' })),
            },
        });
    }

    return {
        form,
        errors,
        formRef,
        photoValidating,
        setPhotoValidating,
        editorFailed,
        reportEditorFailure,
        save,
    };
}

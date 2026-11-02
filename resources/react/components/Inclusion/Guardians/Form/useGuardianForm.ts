import { useForm } from '@inertiajs/react';
import { useState } from 'react';
import { useEditorFailure } from '@/components/Forms/FormLayout/useEditorFailure';
import { useFormSubmission } from '@/components/Forms/FormLayout/useFormSubmission';
import { guardianUrls } from '../Guardians.routes';
import type { GuardianRecord, GuardianStudent } from '../Guardians.types';
import type { GuardianFormData, GuardianFormMode } from './GuardianForm.types';

function initialData(
    mode: GuardianFormMode,
    guardian?: GuardianRecord,
    defaultGender?: string,
): GuardianFormData {
    const person = guardian?.person;
    const data: GuardianFormData = {
        name: person?.name ?? '',
        document: person?.document ?? '',
        birth_date: person?.birth_date?.slice(0, 10) ?? '',
        gender: person?.gender ?? defaultGender ?? '',
        email: person?.email ?? '',
        phone: person?.phone ?? '',
        relationship: guardian?.relationship ?? '',
        address: person?.address ?? '',
        photo: null,
    };

    // A remoção da foto salva pertence somente à edição.
    return mode === 'edit' ? { ...data, remove_photo: false } : data;
}

interface UseGuardianFormOptions {
    mode: GuardianFormMode;
    student: GuardianStudent;
    guardian?: GuardianRecord;
    defaultGender?: string;
}

/** Estado, foto e envio multipart do cadastro/edição de responsáveis. */
export function useGuardianForm({
    mode,
    student,
    guardian,
    defaultGender,
}: UseGuardianFormOptions) {
    const form = useForm<GuardianFormData>(initialData(mode, guardian, defaultGender));
    const { formRef, submit } = useFormSubmission(form);
    const { editorFailed, reportEditorFailure } = useEditorFailure(form);
    const [photoValidating, setPhotoValidating] = useState(false);
    const errors = form.errors as Partial<Record<keyof GuardianFormData, string>>;
    const urls = guardianUrls(student.id);

    function selectPhoto(photo: File): void {
        form.setData((data) =>
            mode === 'edit' ? { ...data, photo, remove_photo: false } : { ...data, photo },
        );
        form.clearErrors('photo', 'remove_photo');
    }

    /** Na edição, remover também apaga a foto salva; no cadastro, apenas descarta o arquivo. */
    function removePhoto(): void {
        form.setData((data) =>
            mode === 'edit'
                ? { ...data, photo: null, remove_photo: true }
                : { ...data, photo: null },
        );
        form.clearErrors('photo');
    }

    function save(): void {
        const editing = mode === 'edit' && guardian;

        submit({
            url: editing ? urls.update(guardian.id) : urls.store,
            method: editing ? 'put' : 'post',
            files: true,
            failureText: editing
                ? 'Não foi possível atualizar o responsável. Atualize a página e tente novamente.'
                : 'Não foi possível cadastrar o responsável. Atualize a página e tente novamente.',
            blocked: photoValidating || editorFailed,
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
        selectPhoto,
        removePhoto,
        save,
    };
}

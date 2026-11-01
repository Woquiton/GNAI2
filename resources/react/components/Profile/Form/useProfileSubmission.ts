import type { FormDataKeys, FormDataType } from '@inertiajs/core';
import { useForm } from '@inertiajs/react';
import { useState } from 'react';
import { useFormSubmission } from '@/components/Forms/FormLayout/useFormSubmission';

interface ProfilePhotoData {
    photo: File | null;
    remove_photo: boolean;
}

interface UseProfileSubmissionOptions<T> {
    initialData: T;
    url: string;
    /** Campos limpos depois de salvar com sucesso (foto enviada e senhas). */
    clearedOnSuccess: Partial<T>;
}

/**
 * Estado e envio dos formulários de perfil: multipart com `_method=put`, foto controlada pelo
 * formulário (`photo`/`remove_photo`) e bloqueio do envio enquanto a foto é lida.
 */
export function useProfileSubmission<T extends FormDataType<T> & ProfilePhotoData>({
    initialData,
    url,
    clearedOnSuccess,
}: UseProfileSubmissionOptions<T>) {
    const form = useForm<T>(initialData);
    const { formRef, submit } = useFormSubmission(form);
    const [photoValidating, setPhotoValidating] = useState(false);
    const errors = form.errors as Partial<Record<keyof T, string>>;
    // O tipo genérico do Inertia não resolve as chaves da foto a partir de `ProfilePhotoData`.
    const photoKey = 'photo' as FormDataKeys<T>;
    const removePhotoKey = 'remove_photo' as FormDataKeys<T>;

    function save(): void {
        submit({
            url,
            method: 'put',
            files: true,
            failureText: 'Não foi possível salvar o perfil. Atualize a página e tente novamente.',
            blocked: photoValidating,
            options: {
                onSuccess: (page) => {
                    const flash = (page.props as { flash?: { error?: string | null } }).flash;

                    if (!flash?.error) {
                        form.setData((data) => ({ ...data, ...clearedOnSuccess }));
                    }
                },
            },
        });
    }

    const photo = {
        file: form.data.photo,
        removed: form.data.remove_photo,
        error: errors.photo ?? errors.remove_photo,
        disabled: form.processing,
        onChange: (file: File) => {
            form.setData((data) => ({ ...data, photo: file, remove_photo: false }));
            form.clearErrors(photoKey, removePhotoKey);
        },
        onRemove: () => {
            form.setData((data) => ({ ...data, photo: null, remove_photo: true }));
            form.clearErrors(photoKey);
        },
        onValidatingChange: setPhotoValidating,
        onError: (message: string) => form.setError(photoKey, message),
    };

    return { form, errors, formRef, photoValidating, photo, save };
}

import { useForm } from '@inertiajs/react';
import { useFormSubmission } from '@/components/Forms/FormLayout/useFormSubmission';
import { tagUrls } from '../Tags.routes';
import type { TagRecord } from '../Tags.types';

/** Payload enviado a `TagController@store/update`. */
export type TagFormData = {
    name: string;
    is_active: boolean;
    module: string;
    color: string;
};

interface UseTagFormOptions {
    tag?: TagRecord;
    canSubmit: boolean;
}

/** Estado e envio do cadastro/edição de etiquetas. */
export function useTagForm({ tag, canSubmit }: UseTagFormOptions) {
    const form = useForm<TagFormData>({
        name: tag?.name ?? '',
        is_active: tag?.is_active ?? true,
        module: tag?.module ?? 'publications',
        color: tag?.color ?? '#322b75',
    });
    const { formRef, submit } = useFormSubmission(form);
    const errors = form.errors as Record<string, string | undefined>;

    function save(): void {
        submit({
            url: tag ? tagUrls.update(tag.id) : tagUrls.store,
            method: tag ? 'put' : 'post',
            failureText: tag
                ? 'Não foi possível salvar a etiqueta. Tente novamente.'
                : 'Não foi possível cadastrar a etiqueta. Tente novamente.',
            blocked: !canSubmit,
        });
    }

    return { form, errors, formRef, save };
}

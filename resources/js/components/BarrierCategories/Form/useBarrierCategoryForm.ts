import { useForm } from '@inertiajs/react';
import { useEditorFailure } from '@/components/Forms/FormLayout/useEditorFailure';
import { useFormSubmission } from '@/components/Forms/FormLayout/useFormSubmission';
import { barrierCategoryUrls } from '../BarrierCategories.routes';
import type { BarrierCategoryRecord } from '../BarrierCategories.types';

/** Payload enviado a `BarrierCategoryController@store/update`. */
export type BarrierCategoryFormData = {
    name: string;
    description: string;
    is_active: boolean;
    blocks_map: boolean;
};

interface UseBarrierCategoryFormOptions {
    category?: BarrierCategoryRecord;
    canSubmit: boolean;
}

/** Estado e envio do cadastro/edição de categorias de barreira. */
export function useBarrierCategoryForm({ category, canSubmit }: UseBarrierCategoryFormOptions) {
    const form = useForm<BarrierCategoryFormData>({
        name: category?.name ?? '',
        description: category?.description ?? '',
        is_active: category?.is_active ?? true,
        blocks_map: category?.blocks_map ?? true,
    });
    const { formRef, submit } = useFormSubmission(form);
    const { editorFailed, reportEditorFailure } = useEditorFailure(form);
    const errors = form.errors as Record<string, string | undefined>;

    function save(): void {
        submit({
            url: category ? barrierCategoryUrls.update(category.id) : barrierCategoryUrls.store,
            method: category ? 'put' : 'post',
            failureText: category
                ? 'Não foi possível salvar a categoria. Tente novamente.'
                : 'Não foi possível cadastrar a categoria. Tente novamente.',
            blocked: !canSubmit || editorFailed,
        });
    }

    return { form, errors, formRef, save, editorFailed, reportEditorFailure };
}

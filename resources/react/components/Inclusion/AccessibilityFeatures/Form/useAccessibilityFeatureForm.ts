import { useForm } from '@inertiajs/react';
import { useEditorFailure } from '@/components/Forms/FormLayout/useEditorFailure';
import { useFormSubmission } from '@/components/Forms/FormLayout/useFormSubmission';
import { accessibilityFeatureUrls } from '../AccessibilityFeatures.routes';
import type { AccessibilityFeatureRecord } from '../AccessibilityFeatures.types';

/** Payload enviado a `AccessibilityFeatureController@store/update`. */
export type AccessibilityFeatureFormData = {
    name: string;
    description: string;
    is_active: boolean;
};

interface UseAccessibilityFeatureFormOptions {
    feature?: AccessibilityFeatureRecord;
    canSubmit: boolean;
}

/** Estado e envio do cadastro/edição de recursos de acessibilidade. */
export function useAccessibilityFeatureForm({
    feature,
    canSubmit,
}: UseAccessibilityFeatureFormOptions) {
    const form = useForm<AccessibilityFeatureFormData>({
        name: feature?.name ?? '',
        description: feature?.description ?? '',
        is_active: feature?.is_active ?? true,
    });
    const { formRef, submit } = useFormSubmission(form);
    const { editorFailed, reportEditorFailure } = useEditorFailure(form);
    const errors = form.errors as Record<string, string | undefined>;

    function save(): void {
        submit({
            url: feature
                ? accessibilityFeatureUrls.update(feature.id)
                : accessibilityFeatureUrls.store,
            method: feature ? 'put' : 'post',
            failureText: feature
                ? 'Não foi possível salvar o recurso. Tente novamente.'
                : 'Não foi possível cadastrar o recurso. Tente novamente.',
            blocked: !canSubmit || editorFailed,
        });
    }

    return { form, errors, formRef, save, editorFailed, reportEditorFailure };
}

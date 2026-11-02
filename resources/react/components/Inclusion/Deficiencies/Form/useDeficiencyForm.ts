import { useForm } from '@inertiajs/react';
import { useEditorFailure } from '@/components/Forms/FormLayout/useEditorFailure';
import { useFormSubmission } from '@/components/Forms/FormLayout/useFormSubmission';
import { deficiencyUrls } from '../Deficiencies.routes';
import type { DeficiencyRecord } from '../Deficiencies.types';

/** Payload enviado a `DeficiencyController@store/update`. */
export type DeficiencyFormData = {
    name: string;
    cid_code: string;
    description: string;
};

/** Estado e envio do cadastro/edição de perfis de atendimento. */
export function useDeficiencyForm(deficiency?: DeficiencyRecord) {
    const form = useForm<DeficiencyFormData>({
        name: deficiency?.name ?? '',
        cid_code: deficiency?.cid_code ?? '',
        description: deficiency?.description ?? '',
    });
    const { formRef, submit } = useFormSubmission(form);
    const { editorFailed, reportEditorFailure } = useEditorFailure(form);
    const errors = form.errors as Record<string, string | undefined>;

    function save(): void {
        submit({
            url: deficiency ? deficiencyUrls.update(deficiency.id) : deficiencyUrls.store,
            method: deficiency ? 'put' : 'post',
            failureText: deficiency
                ? 'Não foi possível salvar o perfil de atendimento. Tente novamente.'
                : 'Não foi possível cadastrar o perfil de atendimento. Tente novamente.',
            blocked: editorFailed,
        });
    }

    return { form, errors, formRef, editorFailed, reportEditorFailure, save };
}

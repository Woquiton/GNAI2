import { useForm } from '@inertiajs/react';
import { useEditorFailure } from '@/components/Forms/FormLayout/useEditorFailure';
import { useFormSubmission } from '@/components/Forms/FormLayout/useFormSubmission';
import { studentDeficiencyUrls } from '../StudentDeficiencies.routes';
import type { StudentDeficiencyRecord } from '../StudentDeficiencies.types';
import type { StudentDeficiencyFormData } from './StudentDeficiencyForm.types';

/** Estado e envio do vínculo (criação) ou da atualização do perfil de atendimento do aluno. */
export function useStudentDeficiencyForm(
    studentId: number,
    studentDeficiency?: StudentDeficiencyRecord,
) {
    const form = useForm<StudentDeficiencyFormData>({
        deficiency_id: studentDeficiency ? String(studentDeficiency.deficiency_id) : '',
        severity: studentDeficiency?.severity ?? '',
        notes: studentDeficiency?.notes ?? '',
    });
    const { formRef, submit } = useFormSubmission(form);
    const { editorFailed, reportEditorFailure } = useEditorFailure(form);
    const errors = form.errors as Partial<Record<keyof StudentDeficiencyFormData, string>>;

    function save(): void {
        submit({
            url: studentDeficiency
                ? studentDeficiencyUrls.update(studentId, studentDeficiency.id)
                : studentDeficiencyUrls.store(studentId),
            method: studentDeficiency ? 'put' : 'post',
            blocked: editorFailed,
            failureText: studentDeficiency
                ? 'Não foi possível atualizar o perfil de atendimento. Atualize a página e tente novamente.'
                : 'Não foi possível vincular o perfil de atendimento. Atualize a página e tente novamente.',
        });
    }

    return { form, errors, formRef, save, editorFailed, reportEditorFailure };
}

import { useForm } from '@inertiajs/react';
import { useFormSubmission } from '@/components/Forms/FormLayout/useFormSubmission';
import { disciplineUrls } from '../Disciplines.routes';
import type { DisciplineRecord } from '../Disciplines.types';
import type { DisciplineFormData } from './DisciplineForm.types';

/** Estado e envio do cadastro/edição de disciplinas. */
export function useDisciplineForm(discipline?: DisciplineRecord) {
    const form = useForm<DisciplineFormData>({
        name: discipline?.name ?? '',
        description: discipline?.description ?? '',
        is_active: discipline ? (discipline.is_active ? '1' : '0') : '1',
    });
    const { formRef, submit } = useFormSubmission(form);
    const errors = form.errors as Record<string, string | undefined>;

    function save(): void {
        submit({
            url: discipline ? disciplineUrls.update(discipline.id) : disciplineUrls.store,
            method: discipline ? 'put' : 'post',
            failureText: discipline
                ? 'Não foi possível salvar a disciplina. Tente novamente.'
                : 'Não foi possível cadastrar a disciplina. Tente novamente.',
        });
    }

    return { form, errors, formRef, save };
}

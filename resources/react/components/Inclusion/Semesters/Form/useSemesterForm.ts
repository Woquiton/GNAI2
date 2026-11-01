import { useForm } from '@inertiajs/react';
import { useFormSubmission } from '@/components/Forms/FormLayout/useFormSubmission';
import { semesterUrls } from '../Semesters.routes';
import type { SemesterRecord } from '../Semesters.types';
import type { SemesterFormData } from './SemesterForm.types';

/** O Laravel serializa casts `date` como ISO; o formulário trabalha com AAAA-MM-DD. */
function dateOnly(value: string | null | undefined): string {
    return value ? (value.split('T')[0] ?? '') : '';
}

/** Estado e envio do cadastro/edição de semestres. */
export function useSemesterForm(semester?: SemesterRecord) {
    const form = useForm<SemesterFormData>({
        year: semester ? String(semester.year) : String(new Date().getFullYear()),
        term: semester ? String(semester.term) : '1',
        start_date: dateOnly(semester?.start_date),
        end_date: dateOnly(semester?.end_date),
        is_current: semester?.is_current ?? false,
    });
    const { formRef, submit } = useFormSubmission(form);
    const errors = form.errors as Record<string, string | undefined>;

    function save(): void {
        submit({
            url: semester ? semesterUrls.update(semester.id) : semesterUrls.store,
            method: semester ? 'put' : 'post',
            failureText: semester
                ? 'Não foi possível salvar o semestre. Tente novamente.'
                : 'Não foi possível cadastrar o semestre. Tente novamente.',
        });
    }

    return { form, errors, formRef, save };
}

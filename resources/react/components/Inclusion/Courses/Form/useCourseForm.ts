import { useForm } from '@inertiajs/react';
import { useEditorFailure } from '@/components/Forms/FormLayout/useEditorFailure';
import { useFormSubmission } from '@/components/Forms/FormLayout/useFormSubmission';
import { courseUrls } from '../Courses.routes';
import type { CourseDisciplineOption, CourseRecord } from '../Courses.types';
import type { CourseFormData } from './CourseForm.types';

function initialData(disciplines: CourseDisciplineOption[], course?: CourseRecord): CourseFormData {
    const availableIds = new Set(disciplines.map((discipline) => discipline.id));
    const data: CourseFormData = {
        name: course?.name ?? '',
        description: course?.description ?? '',
        // Como no legado, somente as disciplinas ativas são listadas e enviadas.
        discipline_ids: (course?.disciplines ?? [])
            .map((discipline) => discipline.id)
            .filter((id) => availableIds.has(id)),
    };

    return course ? { ...data, is_active: course.is_active ? '1' : '0' } : data;
}

/** Primeiro erro da matriz: o Laravel pode apontar o array ou um item (`discipline_ids.0`). */
function disciplinesError(errors: Record<string, string | undefined>): string | undefined {
    return (
        errors.discipline_ids ??
        Object.entries(errors).find(([key]) => key.startsWith('discipline_ids.'))?.[1]
    );
}

/** Estado e envio do cadastro/edição de cursos. */
export function useCourseForm(disciplines: CourseDisciplineOption[], course?: CourseRecord) {
    const form = useForm<CourseFormData>(initialData(disciplines, course));
    const { formRef, submit } = useFormSubmission(form);
    const { editorFailed, reportEditorFailure } = useEditorFailure(form);
    const errors = form.errors as Record<string, string | undefined>;

    function save(): void {
        submit({
            url: course ? courseUrls.update(course.id) : courseUrls.store,
            method: course ? 'put' : 'post',
            blocked: editorFailed,
            failureText: course
                ? 'Não foi possível salvar o curso. Tente novamente.'
                : 'Não foi possível cadastrar o curso. Tente novamente.',
        });
    }

    return {
        form,
        errors,
        disciplinesError: disciplinesError(errors),
        formRef,
        save,
        editorFailed,
        reportEditorFailure,
    };
}

import { useForm } from '@inertiajs/react';
import { useEditorFailure } from '@/components/Forms/FormLayout/useEditorFailure';
import { useFormSubmission } from '@/components/Forms/FormLayout/useFormSubmission';
import { sortDisciplines } from '../StudentCourses.constants';
import { studentCourseUrls } from '../StudentCourses.routes';
import type { StudentCourseCourse, StudentCourseRecord } from '../StudentCourses.types';
import type { StudentCourseFormData, StudentCourseFormMode } from './StudentCourseForm.types';

interface UseStudentCourseFormOptions {
    mode: StudentCourseFormMode;
    studentId: number;
    studentCourse?: StudentCourseRecord;
    courses: StudentCourseCourse[];
    mustBeCurrent: boolean;
}

function initialData(
    studentCourse: StudentCourseRecord | undefined,
    mustBeCurrent: boolean,
): StudentCourseFormData {
    return {
        course_id: studentCourse ? String(studentCourse.course?.id ?? studentCourse.course_id) : '',
        academic_year: studentCourse
            ? String(studentCourse.academic_year ?? '')
            : String(new Date().getFullYear()),
        semester_id: studentCourse?.semester_id ? String(studentCourse.semester_id) : '',
        is_current: mustBeCurrent,
        school_attendance_status: studentCourse?.school_attendance_status ?? '',
        failed_discipline_ids: (studentCourse?.failed_disciplines ?? []).map(({ id }) =>
            Number(id),
        ),
        at_risk_discipline_ids: (studentCourse?.at_risk_disciplines ?? []).map(({ id }) =>
            Number(id),
        ),
    };
}

/** Estado, curso selecionado e envio do cadastro/edição de matrícula. */
export function useStudentCourseForm({
    mode,
    studentId,
    studentCourse,
    courses,
    mustBeCurrent,
}: UseStudentCourseFormOptions) {
    const editing = mode === 'edit';
    const form = useForm<StudentCourseFormData>(initialData(studentCourse, mustBeCurrent));
    const errors = form.errors as Record<string, string | undefined>;
    const isCurrent = mustBeCurrent || form.data.is_current;
    // O acompanhamento só existe para o curso atual; na edição ele sempre aparece.
    const showFollowUp = editing || isCurrent;
    const selectedCourse = studentCourse
        ? studentCourse.course
        : courses.find((course) => String(course.id) === form.data.course_id);
    const disciplines = sortDisciplines(selectedCourse?.disciplines);

    /** Payload de `Create/UpdateStudentCourseData`, como o formulário legado enviava. */
    function payload(data: StudentCourseFormData): Record<string, unknown> {
        const allowed = new Set(disciplines.map(({ id }) => Number(id)));
        // Somente as disciplinas do curso selecionado, e apenas enquanto ele é o curso atual.
        const onlyAllowed = (ids: number[]) =>
            showFollowUp ? ids.filter((id) => allowed.has(id)) : [];
        const common = {
            course_id: data.course_id,
            academic_year: data.academic_year,
            semester_id: data.semester_id,
            school_attendance_status: data.school_attendance_status,
            failed_discipline_ids: onlyAllowed(data.failed_discipline_ids),
            at_risk_discipline_ids: onlyAllowed(data.at_risk_discipline_ids),
        };

        return editing ? common : { ...common, is_current: mustBeCurrent || data.is_current };
    }

    const { formRef, submit } = useFormSubmission(form);
    const { editorFailed, reportEditorFailure } = useEditorFailure(form);

    function save(): void {
        submit({
            url:
                editing && studentCourse
                    ? studentCourseUrls.update(studentCourse.id)
                    : studentCourseUrls.store(studentId),
            method: editing ? 'put' : 'post',
            blocked: editorFailed,
            transform: (data) => payload(data as StudentCourseFormData),
            failureText: editing
                ? 'Não foi possível salvar a matrícula. Tente novamente.'
                : 'Não foi possível cadastrar a matrícula. Tente novamente.',
        });
    }

    return {
        form,
        errors,
        formRef,
        isCurrent,
        showFollowUp,
        selectedCourse,
        disciplines,
        save,
        editorFailed,
        reportEditorFailure,
    };
}

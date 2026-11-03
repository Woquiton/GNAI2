import { useForm } from '@inertiajs/react';
import { useEditorFailure } from '@/components/Forms/FormLayout/useEditorFailure';
import { useFormSubmission } from '@/components/Forms/FormLayout/useFormSubmission';
import { sortDisciplines } from '../StudentCourses.constants';
import { studentCourseUrls } from '../StudentCourses.routes';
import type {
    StudentCourseCourse,
    StudentCourseRecord,
    StudentCourseSemesterAcademicRecords,
} from '../StudentCourses.types';
import type { StudentCourseFormData, StudentCourseFormMode } from './StudentCourseForm.types';

interface UseStudentCourseFormOptions {
    mode: StudentCourseFormMode;
    studentId: number;
    studentCourse?: StudentCourseRecord;
    courses: StudentCourseCourse[];
    mustBeCurrent: boolean;
    coursePeriod: number | null;
    /** Semestre sugerido no cadastro (o atual). */
    currentSemesterId: number | null;
    /** Dados acadêmicos por semestre, somente na edição. */
    academicRecordsBySemester: Record<string, StudentCourseSemesterAcademicRecords>;
}

/** Campos que dependem do semestre: período, reprovações, riscos e dependências aprovadas. */
function semesterFields(
    records: StudentCourseSemesterAcademicRecords | undefined,
): Pick<
    StudentCourseFormData,
    'course_period' | 'failed_discipline_ids' | 'at_risk_discipline_ids' | 'resolved_dependency_ids'
> {
    return {
        course_period: records?.course_period ? String(records.course_period) : '',
        failed_discipline_ids: records?.failed ?? [],
        at_risk_discipline_ids: records?.at_risk ?? [],
        resolved_dependency_ids: (records?.dependencies ?? [])
            .filter((dependency) => dependency.resolved)
            .map((dependency) => dependency.discipline_id),
    };
}

function initialData(
    studentCourse: StudentCourseRecord | undefined,
    mustBeCurrent: boolean,
    coursePeriod: number | null,
    currentSemesterId: number | null,
    academicRecordsBySemester: Record<string, StudentCourseSemesterAcademicRecords>,
): StudentCourseFormData {
    const semesterId = studentCourse
        ? (studentCourse.semester_id ?? null)
        : currentSemesterId;
    const records = semesterId ? academicRecordsBySemester[String(semesterId)] : undefined;

    return {
        course_id: studentCourse ? String(studentCourse.course?.id ?? studentCourse.course_id) : '',
        academic_year: studentCourse
            ? String(studentCourse.academic_year ?? '')
            : String(new Date().getFullYear()),
        semester_id: semesterId ? String(semesterId) : '',
        is_current: mustBeCurrent,
        school_attendance_status: studentCourse?.school_attendance_status ?? '',
        ...semesterFields(records),
        // Sem registros do semestre, mantém o período recebido do servidor.
        ...(records ? {} : { course_period: coursePeriod ? String(coursePeriod) : '' }),
    };
}

/** Estado, curso selecionado e envio do cadastro/edição de matrícula. */
export function useStudentCourseForm({
    mode,
    studentId,
    studentCourse,
    courses,
    mustBeCurrent,
    coursePeriod,
    currentSemesterId,
    academicRecordsBySemester,
}: UseStudentCourseFormOptions) {
    const editing = mode === 'edit';
    const form = useForm<StudentCourseFormData>(
        initialData(
            studentCourse,
            mustBeCurrent,
            coursePeriod,
            currentSemesterId,
            academicRecordsBySemester,
        ),
    );
    const errors = form.errors as Record<string, string | undefined>;
    const isCurrent = mustBeCurrent || form.data.is_current;
    // O acompanhamento só existe para o curso atual; na edição ele sempre aparece.
    const showFollowUp = editing || isCurrent;
    const selectedCourse = studentCourse
        ? studentCourse.course
        : courses.find((course) => String(course.id) === form.data.course_id);
    const disciplines = sortDisciplines(selectedCourse?.disciplines);
    const dependencies = academicRecordsBySemester[form.data.semester_id]?.dependencies ?? [];

    /**
     * Na edição, trocar o semestre carrega o período, as reprovações, os riscos e as dependências
     * já registrados nele. No cadastro, os valores digitados são mantidos.
     */
    function changeSemester(semesterId: string): void {
        form.setData((data) => ({
            ...data,
            semester_id: semesterId,
            ...(editing ? semesterFields(academicRecordsBySemester[semesterId]) : {}),
        }));
    }

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
            course_period: data.course_period,
            school_attendance_status: data.school_attendance_status,
            failed_discipline_ids: onlyAllowed(data.failed_discipline_ids),
            at_risk_discipline_ids: onlyAllowed(data.at_risk_discipline_ids),
        };
        const pendingIds = new Set(dependencies.map((dependency) => dependency.discipline_id));

        return editing
            ? {
                  ...common,
                  resolved_dependency_ids: data.resolved_dependency_ids.filter((id) =>
                      pendingIds.has(id),
                  ),
              }
            : { ...common, is_current: mustBeCurrent || data.is_current };
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
        dependencies,
        changeSemester,
        save,
        editorFailed,
        reportEditorFailure,
    };
}

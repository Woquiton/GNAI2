import FormActions from '@/components/Forms/FormActions/FormActions';
import FormLayout from '@/components/Forms/FormLayout/FormLayout';
import Button from '@/components/UI/Button/Button';
import CardBox from '@/components/UI/CardBox/CardBox';
import { studentCourseUrls } from '../StudentCourses.routes';
import type {
    StudentCourseCourse,
    StudentCourseRecord,
    StudentCourseSemester,
    StudentCourseStudent,
} from '../StudentCourses.types';
import StudentCourseEnrollmentFields from './StudentCourseEnrollmentFields';
import StudentCourseFollowUpFields from './StudentCourseFollowUpFields';
import type { StudentCourseFormMode } from './StudentCourseForm.types';
import StudentCourseStudentInfo from './StudentCourseStudentInfo';
import { useStudentCourseForm } from './useStudentCourseForm';
import './StudentCourseForm.css';

interface StudentCourseFormProps {
    mode: StudentCourseFormMode;
    studentId: number;
    student: StudentCourseStudent | undefined;
    semesters: StudentCourseSemester[];
    /** Somente no cadastro. */
    courses?: StudentCourseCourse[];
    mustBeCurrent?: boolean;
    /** Somente na edição. */
    studentCourse?: StudentCourseRecord;
}

/** Matrícula do aluno em um curso/série, com o acompanhamento acadêmico do curso atual. */
export default function StudentCourseForm({
    mode,
    studentId,
    student,
    semesters,
    courses = [],
    mustBeCurrent = false,
    studentCourse,
}: StudentCourseFormProps): React.JSX.Element {
    const {
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
    } = useStudentCourseForm({ mode, studentId, studentCourse, courses, mustBeCurrent });
    const editing = mode === 'edit';
    const sectionProps = { form, errors, disabled: form.processing };
    const courseOptions = courses.map((course) => ({
        value: String(course.id),
        label: course.name,
    }));
    const semesterOptions = semesters.map((semester) => ({
        value: String(semester.id),
        label: semester.label,
    }));
    const cancelLabel = editing ? 'Cancelar edição da matrícula' : 'Cancelar criação de matrícula';
    const saveLabel = editing ? 'Salvar alterações da matrícula' : 'Efetivar matrícula do aluno';
    const processingStatus = editing
        ? 'Salvando alterações da matrícula...'
        : 'Efetivando matrícula do aluno...';

    return (
        <FormLayout
            ref={formRef}
            aria-busy={form.processing}
            onSubmit={(event) => {
                event.preventDefault();
                save();
            }}
        >
            <CardBox>
                <fieldset disabled={form.processing}>
                    <StudentCourseStudentInfo
                        mode={mode}
                        student={student}
                        courseName={studentCourse?.course?.name}
                    />
                    <StudentCourseEnrollmentFields
                        {...sectionProps}
                        mode={mode}
                        courseOptions={courseOptions}
                        semesterOptions={semesterOptions}
                        isCurrent={isCurrent}
                        mustBeCurrent={mustBeCurrent}
                    />
                    {showFollowUp ? (
                        <StudentCourseFollowUpFields
                            {...sectionProps}
                            disciplines={selectedCourse ? disciplines : null}
                            onEditorFailure={() =>
                                reportEditorFailure(
                                    'school_attendance_status',
                                    'situação de frequência',
                                )
                            }
                        />
                    ) : null}
                </fieldset>
            </CardBox>
            <FormActions status={form.processing ? processingStatus : undefined}>
                <Button
                    href={studentCourseUrls.record(studentId)}
                    tone="cancel"
                    label="Cancelar"
                    title={cancelLabel}
                    aria-label={cancelLabel}
                    disabled={form.processing}
                />
                <Button
                    type="submit"
                    tone="save"
                    leftIconClass="fa fa-check"
                    label="Salvar"
                    title={saveLabel}
                    aria-label={saveLabel}
                    disabled={form.processing || editorFailed}
                />
            </FormActions>
        </FormLayout>
    );
}

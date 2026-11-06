import FormSection from '@/components/Forms/FormSection/FormSection';
import DetailField from '@/components/UI/DetailField/DetailField';
import DetailGrid from '@/components/UI/DetailGrid/DetailGrid';
import type { StudentCourseStudent } from '../StudentCourses.types';
import { STUDENT_COURSE_TOUR_TARGETS } from '../studentCourseTours';
import type { StudentCourseFormMode } from './StudentCourseForm.types';

interface StudentCourseStudentInfoProps {
    mode: StudentCourseFormMode;
    student: StudentCourseStudent | undefined;
    courseName: string | undefined;
}

/** Aluno (e curso, na edição) da matrícula; dados somente para leitura. */
export default function StudentCourseStudentInfo({
    mode,
    student,
    courseName,
}: StudentCourseStudentInfoProps): React.JSX.Element {
    const editing = mode === 'edit';
    const studentName = student?.person?.name ?? 'Não informado';

    return (
        <FormSection
            id="student-course-student"
            title={editing ? 'Dados do Aluno e Curso' : 'Aluno'}
            variant="inline"
            iconClass="fa fa-user"
            tourTarget={STUDENT_COURSE_TOUR_TARGETS.formStudent}
        >
            <DetailGrid>
                <DetailField label={editing ? 'Aluno' : 'Nome do Aluno'}>{studentName}</DetailField>
                {editing ? (
                    <DetailField label="Curso / Série">{courseName ?? 'Não informado'}</DetailField>
                ) : (
                    <DetailField label="Matrícula">
                        {student?.registration || 'Não informado'}
                    </DetailField>
                )}
            </DetailGrid>
        </FormSection>
    );
}

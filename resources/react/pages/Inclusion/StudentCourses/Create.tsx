import StudentCourseForm from '@/components/Inclusion/StudentCourses/Form/StudentCourseForm';
import { studentCourseBreadcrumb } from '@/components/Inclusion/StudentCourses/StudentCourses.routes';
import type { StudentCourseCreateProps } from '@/components/Inclusion/StudentCourses/StudentCourses.types';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';

export default function InclusionStudentCoursesCreatePage({
    student,
    courses,
    semesters,
    mustBeCurrent,
    maxCoursePeriod,
    currentSemesterId,
}: StudentCourseCreateProps): React.JSX.Element {
    return (
        <BusinessPage
            title="Nova Matrícula"
            subtitle="Vincule o aluno a um curso ou série."
            breadcrumbItems={studentCourseBreadcrumb({
                student: { id: student.id, name: student.person?.name ?? '' },
                current: 'Cadastrar',
            })}
        >
            <StudentCourseForm
                mode="create"
                studentId={student.id}
                student={student}
                courses={courses}
                semesters={semesters}
                mustBeCurrent={mustBeCurrent}
                maxCoursePeriod={maxCoursePeriod}
                currentSemesterId={currentSemesterId}
            />
        </BusinessPage>
    );
}

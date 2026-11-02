import StudentCourseForm from '@/components/Inclusion/StudentCourses/Form/StudentCourseForm';
import { studentCourseBreadcrumb } from '@/components/Inclusion/StudentCourses/StudentCourses.routes';
import type { StudentCourseEditProps } from '@/components/Inclusion/StudentCourses/StudentCourses.types';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';

export default function InclusionStudentCoursesEditPage({
    studentCourse,
    semesters,
}: StudentCourseEditProps): React.JSX.Element {
    const studentId = studentCourse.student?.id ?? studentCourse.student_id;

    return (
        <BusinessPage
            title="Editar Matrícula"
            subtitle="Atualize as informações acadêmicas desta matrícula."
            breadcrumbItems={studentCourseBreadcrumb({
                student: { id: studentId, name: studentCourse.student?.person?.name ?? '' },
                studentCourse: {
                    id: studentCourse.id,
                    courseName: studentCourse.course?.name ?? '',
                },
                current: 'Editar',
            })}
        >
            <StudentCourseForm
                key={studentCourse.id}
                mode="edit"
                studentId={studentId}
                student={studentCourse.student}
                semesters={semesters}
                studentCourse={studentCourse}
            />
        </BusinessPage>
    );
}

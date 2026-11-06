import StudentCourseForm from '@/components/StudentCourses/Form/StudentCourseForm';
import { studentCourseBreadcrumb } from '@/components/StudentCourses/StudentCourses.routes';
import type { StudentCourseEditProps } from '@/components/StudentCourses/StudentCourses.types';
import { studentCourseEditTour } from '@/components/StudentCourses/studentCourseTours';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';

export default function StudentCoursesEditPage({
    studentCourse,
    semesters,
    coursePeriod,
    maxCoursePeriod,
    academicRecordsBySemester,
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
            tour={studentCourseEditTour}
        >
            <StudentCourseForm
                key={studentCourse.id}
                mode="edit"
                studentId={studentId}
                student={studentCourse.student}
                semesters={semesters}
                studentCourse={studentCourse}
                coursePeriod={coursePeriod}
                maxCoursePeriod={maxCoursePeriod}
                academicRecordsBySemester={academicRecordsBySemester}
            />
        </BusinessPage>
    );
}

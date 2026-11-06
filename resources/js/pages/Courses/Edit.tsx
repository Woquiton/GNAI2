import { courseEditTour } from '@/components/Courses/courseTours';
import { courseBreadcrumb } from '@/components/Courses/Courses.routes';
import type { CourseEditProps } from '@/components/Courses/Courses.types';
import CourseForm from '@/components/Courses/Form/CourseForm';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';

export default function CoursesEditPage({
    course,
    disciplines,
    maxCoursePeriod,
}: CourseEditProps): React.JSX.Element {
    return (
        <BusinessPage
            title={`Editar o curso ${course.name}`}
            subtitle="Atualize as informações do curso e sua matriz curricular."
            breadcrumbItems={courseBreadcrumb({ course, current: 'Editar' })}
            tour={courseEditTour}
        >
            <CourseForm
                key={course.id}
                course={course}
                disciplines={disciplines}
                maxCoursePeriod={maxCoursePeriod}
            />
        </BusinessPage>
    );
}

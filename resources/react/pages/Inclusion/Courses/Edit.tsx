import { courseBreadcrumb } from '@/components/Inclusion/Courses/Courses.routes';
import type { CourseEditProps } from '@/components/Inclusion/Courses/Courses.types';
import CourseForm from '@/components/Inclusion/Courses/Form/CourseForm';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';

export default function InclusionCoursesEditPage({
    course,
    disciplines,
    maxCoursePeriod,
}: CourseEditProps): React.JSX.Element {
    return (
        <BusinessPage
            title={`Editar o curso ${course.name}`}
            subtitle="Atualize as informações do curso e sua matriz curricular."
            breadcrumbItems={courseBreadcrumb({ course, current: 'Editar' })}
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

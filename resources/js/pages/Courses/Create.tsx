import { courseCreateTour } from '@/components/Courses/courseTours';
import { courseBreadcrumb } from '@/components/Courses/Courses.routes';
import type { CourseCreateProps } from '@/components/Courses/Courses.types';
import CourseForm from '@/components/Courses/Form/CourseForm';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';

export default function CoursesCreatePage({
    disciplines,
    maxCoursePeriod,
}: CourseCreateProps): React.JSX.Element {
    return (
        <BusinessPage
            title="Cadastrar novo curso"
            subtitle="Defina as informações do curso e sua matriz curricular inicial."
            breadcrumbItems={courseBreadcrumb({ current: 'Cadastrar' })}
            tour={courseCreateTour}
        >
            <CourseForm disciplines={disciplines} maxCoursePeriod={maxCoursePeriod} />
        </BusinessPage>
    );
}

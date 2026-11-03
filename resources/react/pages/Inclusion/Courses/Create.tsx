import { courseCreateTour } from '@/components/Inclusion/Courses/courseTours';
import { courseBreadcrumb } from '@/components/Inclusion/Courses/Courses.routes';
import type { CourseCreateProps } from '@/components/Inclusion/Courses/Courses.types';
import CourseForm from '@/components/Inclusion/Courses/Form/CourseForm';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';

export default function InclusionCoursesCreatePage({
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

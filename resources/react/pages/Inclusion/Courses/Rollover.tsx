import { courseBreadcrumb } from '@/components/Inclusion/Courses/Courses.routes';
import type { CourseRolloverProps } from '@/components/Inclusion/Courses/Courses.types';
import CourseRolloverForm from '@/components/Inclusion/Courses/Rollover/CourseRolloverForm';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';

export default function InclusionCoursesRolloverPage(props: CourseRolloverProps): React.JSX.Element {
    const { course, semester } = props;

    return (
        <BusinessPage
            title={`Virada de semestre: ${course.name}`}
            subtitle="Registre de uma vez o período de cada aluno ativo do curso no novo semestre."
            breadcrumbItems={courseBreadcrumb({ course, current: 'Virada de semestre' })}
        >
            {/* O formulário reinicia ao trocar o semestre de destino. */}
            <CourseRolloverForm key={`${course.id}-${semester?.id ?? 'none'}`} {...props} />
        </BusinessPage>
    );
}

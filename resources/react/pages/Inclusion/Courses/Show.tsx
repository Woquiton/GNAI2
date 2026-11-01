import CourseDeleteModal from '@/components/Inclusion/Courses/CourseDeleteModal';
import { courseBreadcrumb, courseUrls } from '@/components/Inclusion/Courses/Courses.routes';
import type { CourseShowProps } from '@/components/Inclusion/Courses/Courses.types';
import CourseDetails from '@/components/Inclusion/Courses/Details/CourseDetails';
import CourseDetailsActions from '@/components/Inclusion/Courses/Details/CourseDetailsActions';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';
import { useConfirmedAction } from '@/components/UI/ConfirmActionModal/useConfirmedAction';

export default function InclusionCoursesShowPage({
    course,
    can,
}: CourseShowProps): React.JSX.Element {
    const removal = useConfirmedAction<typeof course>({
        failureText: 'Não foi possível excluir o curso. Tente novamente.',
    });

    return (
        <BusinessPage
            title="Detalhes do Curso"
            subtitle="Informações estruturais e grade de disciplinas."
            documentTitle={course.name}
            breadcrumbItems={courseBreadcrumb({ course })}
            busy={removal.processing}
        >
            <CourseDetails course={course} />
            <CourseDetailsActions
                courseId={course.id}
                permissions={can}
                deleting={removal.processing}
                onDelete={() => removal.open(course)}
            />
            <CourseDeleteModal
                course={removal.target}
                processing={removal.processing}
                onClose={removal.close}
                onConfirm={() => removal.submit('delete', courseUrls.destroy(course.id))}
            />
        </BusinessPage>
    );
}

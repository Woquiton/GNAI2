import { usePage } from '@inertiajs/react';
import CourseDeleteModal from '@/components/Inclusion/Courses/CourseDeleteModal';
import { emptyCourseFilters } from '@/components/Inclusion/Courses/Courses.constants';
import { courseListTour } from '@/components/Inclusion/Courses/courseTours';
import { courseBreadcrumb, courseUrls } from '@/components/Inclusion/Courses/Courses.routes';
import type { CourseIndexProps, CourseSummary } from '@/components/Inclusion/Courses/Courses.types';
import CourseFilters from '@/components/Inclusion/Courses/List/CourseFilters';
import CourseList from '@/components/Inclusion/Courses/List/CourseList';
import { TableListLayout, useTableListFilters } from '@/components/Tables/TableList/TableList';
import { useConfirmedAction } from '@/components/UI/ConfirmActionModal/useConfirmedAction';

export default function InclusionCoursesIndexPage({
    courses,
    filters: initialFilters,
    can,
}: CourseIndexProps): React.JSX.Element {
    const errors = usePage().props.errors as Record<string, string | undefined>;
    const filters = useTableListFilters({
        url: courseUrls.index,
        initialFilters,
        emptyFilters: emptyCourseFilters,
        failureText: 'Não foi possível atualizar os cursos. Tente novamente.',
    });
    const removal = useConfirmedAction<CourseSummary>({
        failureText: 'Não foi possível excluir o curso. Tente novamente.',
    });

    function openRemoval(course: CourseSummary): void {
        filters.cancelScheduled();
        removal.open(course);
    }

    function confirmRemoval(): void {
        if (removal.target) {
            removal.submit('delete', courseUrls.destroy(removal.target.id));
        }
    }

    return (
        <TableListLayout
            title="Cursos e Séries"
            subtitle="Gerencie cursos e suas respectivas séries."
            breadcrumbItems={courseBreadcrumb()}
            create={can.create && { href: courseUrls.create, label: 'Cadastrar curso' }}
            listLabel="Listagem de cursos"
            loading={filters.loading}
            loadingLabel="Atualizando cursos"
            tour={courseListTour}
            filters={
                <CourseFilters
                    values={filters.values}
                    errors={errors}
                    onUpdate={filters.update}
                    onClear={filters.clear}
                    onSubmit={filters.submit}
                />
            }
            dialogs={
                <CourseDeleteModal
                    course={removal.target}
                    processing={removal.processing}
                    onClose={removal.close}
                    onConfirm={confirmRemoval}
                />
            }
        >
            <CourseList
                courses={courses}
                permissions={can}
                loading={filters.loading}
                processing={removal.processing}
                onDelete={openRemoval}
                onPageSelect={filters.selectPage}
            />
        </TableListLayout>
    );
}

import { usePage } from '@inertiajs/react';
import StudentFilters from '@/components/Inclusion/Students/List/StudentFilters';
import StudentList from '@/components/Inclusion/Students/List/StudentList';
import StudentDeleteModal from '@/components/Inclusion/Students/StudentDeleteModal';
import {
    emptyStudentFilters,
    STUDENT_FAILURE_TEXT,
} from '@/components/Inclusion/Students/Students.constants';
import { studentBreadcrumb, studentUrls } from '@/components/Inclusion/Students/Students.routes';
import type { Student, StudentIndexProps } from '@/components/Inclusion/Students/Students.types';
import { studentListTour } from '@/components/Inclusion/Students/studentTours';
import { TableListLayout, useTableListFilters } from '@/components/Tables/TableList/TableList';
import { useConfirmedAction } from '@/components/UI/ConfirmActionModal/useConfirmedAction';

export default function StudentsIndex({
    filters: initialFilters,
    courses,
    deficiencies,
    ...listProps
}: StudentIndexProps): React.JSX.Element {
    const errors = usePage().props.errors as Record<string, string | undefined>;
    const filters = useTableListFilters({
        url: studentUrls.index,
        initialFilters,
        emptyFilters: emptyStudentFilters,
        failureText: STUDENT_FAILURE_TEXT,
    });
    const removal = useConfirmedAction<Student>({ failureText: STUDENT_FAILURE_TEXT });

    function confirmRemoval(): void {
        if (removal.target) {
            filters.cancelScheduled();
            removal.submit('delete', studentUrls.destroy(removal.target.id));
        }
    }

    return (
        <TableListLayout
            title="Alunos"
            subtitle="Gerencie os estudantes e seus documentos de apoio especializado."
            breadcrumbItems={studentBreadcrumb()}
            tour={studentListTour}
            create={
                listProps.permissions['student.create'] && {
                    href: studentUrls.create,
                    label: 'Cadastrar aluno',
                }
            }
            listLabel="Listagem de alunos"
            loading={filters.loading}
            loadingLabel="Atualizando alunos"
            filters={
                <StudentFilters
                    courses={courses}
                    deficiencies={deficiencies}
                    studentStatuses={listProps.studentStatuses}
                    followUpTypes={listProps.followUpTypes}
                    values={filters.values}
                    errors={errors}
                    onUpdate={filters.update}
                    onClear={filters.clear}
                    onSubmit={filters.submit}
                />
            }
            dialogs={
                <StudentDeleteModal
                    student={removal.target}
                    processing={removal.processing}
                    onClose={removal.close}
                    onConfirm={confirmRemoval}
                />
            }
        >
            <StudentList
                {...listProps}
                loading={filters.loading}
                processing={removal.processing}
                onDelete={removal.open}
                onPageSelect={filters.selectPage}
            />
        </TableListLayout>
    );
}

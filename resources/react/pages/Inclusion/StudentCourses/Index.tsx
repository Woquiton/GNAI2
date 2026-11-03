import { usePage } from '@inertiajs/react';
import StudentCourseFilters from '@/components/Inclusion/StudentCourses/List/StudentCourseFilters';
import StudentCourseList from '@/components/Inclusion/StudentCourses/List/StudentCourseList';
import StudentCourseDeleteModal from '@/components/Inclusion/StudentCourses/StudentCourseDeleteModal';
import {
    emptyStudentCourseFilters,
    STUDENT_COURSE_RECORD_TAB,
} from '@/components/Inclusion/StudentCourses/StudentCourses.constants';
import {
    studentCourseBreadcrumb,
    studentCourseUrls,
} from '@/components/Inclusion/StudentCourses/StudentCourses.routes';
import type {
    StudentCourseIndexProps,
    StudentCourseListRecord,
} from '@/components/Inclusion/StudentCourses/StudentCourses.types';
import { studentCourseListTour } from '@/components/Inclusion/StudentCourses/studentCourseTours';
import StudentRecordReturnButton from '@/components/Inclusion/Students/StudentRecordReturnButton';
import { TableListLayout, useTableListFilters } from '@/components/Tables/TableList/TableList';
import { useConfirmedAction } from '@/components/UI/ConfirmActionModal/useConfirmedAction';

export default function InclusionStudentCoursesIndexPage({
    student,
    studentCourses,
    courses,
    filters: initialFilters,
    can,
}: StudentCourseIndexProps): React.JSX.Element {
    const errors = usePage().props.errors as Record<string, string | undefined>;
    const studentName = student.person.name;
    const filters = useTableListFilters({
        url: studentCourseUrls.index(student.id),
        initialFilters,
        emptyFilters: emptyStudentCourseFilters,
        failureText: 'Não foi possível atualizar as matrículas. Tente novamente.',
    });
    const removal = useConfirmedAction<StudentCourseListRecord>({
        failureText: 'Não foi possível excluir a matrícula. Tente novamente.',
    });
    const removalTarget = removal.target
        ? { courseName: removal.target.course?.name ?? 'não identificado' }
        : null;

    function confirmRemoval(): void {
        if (removal.target) {
            filters.cancelScheduled();
            removal.submit('delete', studentCourseUrls.destroy(removal.target.id));
        }
    }

    return (
        <TableListLayout
            title={`Matrículas, ${studentName}`}
            subtitle="Gerencie as matrículas e o histórico acadêmico do aluno."
            breadcrumbItems={studentCourseBreadcrumb({
                student: { id: student.id, name: studentName },
            })}
            actions={
                <StudentRecordReturnButton studentId={student.id} tab={STUDENT_COURSE_RECORD_TAB} />
            }
            create={
                can.create && {
                    href: studentCourseUrls.create(student.id),
                    label: 'Cadastrar nova matrícula',
                }
            }
            listLabel="Listagem de matrículas do aluno"
            loading={filters.loading}
            loadingLabel="Atualizando matrículas"
            filters={
                <StudentCourseFilters
                    values={filters.values}
                    courseOptions={courses}
                    errors={errors}
                    onUpdate={filters.update}
                    onClear={filters.clear}
                    onSubmit={filters.submit}
                />
            }
            tour={studentCourseListTour}
            dialogs={
                <StudentCourseDeleteModal
                    target={removalTarget}
                    context="list"
                    processing={removal.processing}
                    onClose={removal.close}
                    onConfirm={confirmRemoval}
                />
            }
        >
            <StudentCourseList
                studentName={studentName}
                studentCourses={studentCourses}
                permissions={can}
                loading={filters.loading}
                processing={removal.processing}
                onDelete={(enrollment) => {
                    filters.cancelScheduled();
                    removal.open(enrollment);
                }}
                onPageSelect={filters.selectPage}
            />
        </TableListLayout>
    );
}

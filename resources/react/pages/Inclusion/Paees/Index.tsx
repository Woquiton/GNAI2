import PaeeDeleteModal from '@/components/Inclusion/Paees/PaeeDeleteModal';
import PaeeFilters from '@/components/Inclusion/Paees/List/PaeeFilters';
import PaeeList from '@/components/Inclusion/Paees/List/PaeeList';
import { usePaeeList } from '@/components/Inclusion/Paees/List/usePaeeList';
import {
    paeeStudentBreadcrumb,
    paeeUrls,
    studentPaeesTab,
} from '@/components/Inclusion/Paees/Paees.routes';
import type { PaeeStudentListProps } from '@/components/Inclusion/Paees/Paees.types';
import StudentRecordReturnButton from '@/components/Inclusion/Students/StudentRecordReturnButton';
import { TableListLayout } from '@/components/Tables/TableList/TableList';

export default function InclusionPaeesIndexPage({
    paees,
    student,
    semesters,
    filters: initialFilters,
    can,
}: PaeeStudentListProps): React.JSX.Element {
    const { errors, filters, removal } = usePaeeList({
        url: paeeUrls.student(student.id),
        initialFilters,
    });

    return (
        <TableListLayout
            title={`PAEE de ${student.name}`}
            subtitle="Planos de Atendimento Educacional Especializado do aluno."
            breadcrumbItems={paeeStudentBreadcrumb(student, { recordTab: true, current: 'PAEE' })}
            actions={<StudentRecordReturnButton studentId={student.id} tab={studentPaeesTab} />}
            listLabel="PAEEs do aluno"
            loading={filters.loading}
            loadingLabel="Atualizando PAEEs"
            filters={
                <PaeeFilters
                    values={filters.values}
                    semesters={semesters}
                    showSearch={false}
                    errors={errors}
                    onUpdate={filters.update}
                    onClear={filters.clear}
                    onSubmit={filters.submit}
                />
            }
            dialogs={
                <PaeeDeleteModal
                    name={removal.name}
                    processing={removal.processing}
                    onClose={removal.close}
                    onConfirm={removal.confirm}
                />
            }
        >
            <PaeeList
                paees={paees}
                byStudent
                permissions={can}
                loading={filters.loading}
                processing={removal.processing}
                onDelete={removal.open}
                onPageSelect={filters.selectPage}
            />
        </TableListLayout>
    );
}

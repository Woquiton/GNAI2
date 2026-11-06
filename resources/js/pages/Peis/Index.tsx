import PeiFilters from '@/components/Peis/List/PeiFilters';
import PeiList from '@/components/Peis/List/PeiList';
import { usePeiList } from '@/components/Peis/List/usePeiList';
import PeiDeleteModal from '@/components/Peis/PeiDeleteModal';
import { studentPeisBreadcrumb, peiUrls } from '@/components/Peis/Peis.routes';
import type { PeiIndexProps } from '@/components/Peis/Peis.types';
import StudentRecordReturnButton from '@/components/Students/StudentRecordReturnButton';
import { TableListLayout, TableListCreateButton } from '@/components/Tables/TableList/TableList';
import { peiStudentIndexTour } from '@/components/Peis/peiTours';

export default function PeisIndexPage({
    peis,
    semesters,
    students = [],
    filters: initialFilters,
    can,
    student,
}: PeiIndexProps): React.JSX.Element {
    const { errors, filters, removal } = usePeiList({
        url: peiUrls.studentIndex(student.id),
        initialFilters,
    });

    return (
        <TableListLayout
            title="Histórico de PEIs"
            subtitle={`Aluno: ${student.name}`}
            breadcrumbItems={studentPeisBreadcrumb(student)}
            tour={peiStudentIndexTour}
            actions={
                <>
                    <StudentRecordReturnButton studentId={student.id} tab="peis" />
                    {can.create ? (
                        <TableListCreateButton
                            href={peiUrls.create(student.id)}
                            ariaLabel="Cadastrar PEI do aluno"
                        />
                    ) : null}
                </>
            }
            listLabel="Listagem de PEIs"
            loading={filters.loading}
            loadingLabel="Atualizando PEIs"
            filters={
                <PeiFilters
                    variant="student"
                    values={filters.values}
                    semesters={semesters}
                    students={students}
                    errors={errors}
                    onUpdate={filters.update}
                    onClear={filters.clear}
                    onSubmit={filters.submit}
                />
            }
            dialogs={
                <PeiDeleteModal
                    pei={removal.target}
                    processing={removal.processing}
                    onClose={removal.close}
                    onConfirm={removal.confirm}
                />
            }
        >
            <PeiList
                variant="student"
                peis={peis}
                permissions={can}
                loading={filters.loading}
                processing={removal.processing}
                onDelete={removal.open}
                onPageSelect={filters.selectPage}
            />
        </TableListLayout>
    );
}

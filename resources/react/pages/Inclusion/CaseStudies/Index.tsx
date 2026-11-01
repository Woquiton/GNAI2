import {
    caseStudiesTab,
    caseStudyStudentBreadcrumb,
    caseStudyUrls,
} from '@/components/Inclusion/CaseStudies/CaseStudies.routes';
import type {
    CaseStudyStudentListProps,
} from '@/components/Inclusion/CaseStudies/CaseStudies.types';
import CaseStudyDeleteModal from '@/components/Inclusion/CaseStudies/CaseStudyDeleteModal';
import CaseStudyFilters from '@/components/Inclusion/CaseStudies/List/CaseStudyFilters';
import CaseStudyList from '@/components/Inclusion/CaseStudies/List/CaseStudyList';
import { useCaseStudyList } from '@/components/Inclusion/CaseStudies/List/useCaseStudyList';
import StudentRecordReturnButton from '@/components/Inclusion/Students/StudentRecordReturnButton';
import { TableListLayout } from '@/components/Tables/TableList/TableList';
import Button from '@/components/UI/Button/Button';

export default function InclusionCaseStudiesIndexPage({
    caseStudies,
    student,
    semesters,
    statuses,
    filters: initialFilters,
    can,
}: CaseStudyStudentListProps): React.JSX.Element {
    const { errors, filters, rowName, removal } = useCaseStudyList({ student, initialFilters });
    const headerActions = (
        <>
            <StudentRecordReturnButton studentId={student.id} tab={caseStudiesTab} />
            <Button
                href={caseStudyUrls.studentHistory(student.id)}
                tone="white"
                leftIconClass="fa fa-history"
                label="Ver Histórico"
                aria-label="Ver histórico completo de Estudos de Caso do aluno"
            />
        </>
    );

    return (
        <TableListLayout
            title={`Estudos de Caso de ${student.name}`}
            breadcrumbItems={caseStudyStudentBreadcrumb(student, { current: 'Estudos de Caso' })}
            actions={headerActions}
            create={
                can.create && {
                    href: caseStudyUrls.create(student.id),
                    label: 'Cadastrar Estudo de Caso do aluno',
                }
            }
            listLabel="Estudos de Caso do aluno"
            loading={filters.loading}
            loadingLabel="Atualizando Estudos de Caso"
            filters={
                <CaseStudyFilters
                    values={filters.values}
                    semesters={semesters}
                    statuses={statuses}
                    showSearch={false}
                    errors={errors}
                    onUpdate={filters.update}
                    onClear={filters.clear}
                    onSubmit={filters.submit}
                />
            }
            dialogs={
                <CaseStudyDeleteModal
                    open={removal.open}
                    name={removal.name}
                    processing={removal.processing}
                    onClose={removal.close}
                    onConfirm={removal.confirm}
                />
            }
        >
            <CaseStudyList
                caseStudies={caseStudies}
                byStudent
                permissions={can}
                loading={filters.loading}
                processing={removal.processing}
                rowName={rowName}
                onDelete={removal.request}
                onPageSelect={filters.selectPage}
            />
        </TableListLayout>
    );
}

import { usePage } from '@inertiajs/react';
import StudentDocumentFilters from '@/components/Inclusion/StudentDocuments/List/StudentDocumentFilters';
import StudentDocumentList from '@/components/Inclusion/StudentDocuments/List/StudentDocumentList';
import StudentDocumentDeleteModal from '@/components/Inclusion/StudentDocuments/StudentDocumentDeleteModal';
import { emptyStudentDocumentFilters } from '@/components/Inclusion/StudentDocuments/StudentDocuments.constants';
import {
    studentDocumentBreadcrumb,
    studentDocumentFileUrls,
    studentDocumentUrls,
} from '@/components/Inclusion/StudentDocuments/StudentDocuments.routes';
import type {
    StudentDocumentIndexProps,
    StudentDocumentListRecord,
} from '@/components/Inclusion/StudentDocuments/StudentDocuments.types';
import StudentRecordReturnButton from '@/components/Inclusion/Students/StudentRecordReturnButton';
import { TableListLayout, useTableListFilters } from '@/components/Tables/TableList/TableList';
import { useConfirmedAction } from '@/components/UI/ConfirmActionModal/useConfirmedAction';

export default function InclusionStudentDocumentsIndexPage({
    documents,
    student,
    types,
    semesters,
    filters: initialFilters,
    can,
}: StudentDocumentIndexProps): React.JSX.Element {
    const errors = usePage().props.errors as Record<string, string | undefined>;
    const urls = studentDocumentUrls(student.id);
    const filters = useTableListFilters({
        url: urls.index,
        initialFilters,
        emptyFilters: emptyStudentDocumentFilters,
        failureText: 'Não foi possível atualizar os documentos. Tente novamente.',
    });
    const removal = useConfirmedAction<StudentDocumentListRecord>({
        failureText: 'Não foi possível excluir o documento. Tente novamente.',
    });

    function openRemoval(document: StudentDocumentListRecord): void {
        filters.cancelScheduled();
        removal.open(document);
    }

    function confirmRemoval(): void {
        if (removal.target) {
            filters.cancelScheduled();
            removal.submit('delete', studentDocumentFileUrls.destroy(removal.target.id));
        }
    }

    return (
        <TableListLayout
            title={`Documentos, ${student.person.name}`}
            subtitle="Gestão de laudos, relatórios e planos de AEE."
            breadcrumbItems={studentDocumentBreadcrumb({ student })}
            actions={<StudentRecordReturnButton studentId={student.id} tab="documents" />}
            create={can.create && { href: urls.create, label: 'Cadastrar documento do aluno' }}
            listLabel="Documentos do aluno"
            loading={filters.loading}
            loadingLabel="Atualizando documentos"
            filters={
                <StudentDocumentFilters
                    types={types}
                    semesters={semesters}
                    values={filters.values}
                    errors={errors}
                    onUpdate={filters.update}
                    onClear={filters.clear}
                    onSubmit={filters.submit}
                />
            }
            dialogs={
                <StudentDocumentDeleteModal
                    studentDocument={removal.target}
                    processing={removal.processing}
                    onClose={removal.close}
                    onConfirm={confirmRemoval}
                />
            }
        >
            <StudentDocumentList
                documents={documents}
                permissions={can}
                loading={filters.loading}
                processing={removal.processing}
                onDelete={openRemoval}
                onPageSelect={filters.selectPage}
            />
        </TableListLayout>
    );
}

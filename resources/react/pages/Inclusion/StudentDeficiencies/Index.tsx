import { usePage } from '@inertiajs/react';
import StudentDeficiencyFilters from '@/components/Inclusion/StudentDeficiencies/List/StudentDeficiencyFilters';
import StudentDeficiencyList from '@/components/Inclusion/StudentDeficiencies/List/StudentDeficiencyList';
import {
    emptyStudentDeficiencyFilters,
    STUDENT_DEFICIENCY_RECORD_TAB,
} from '@/components/Inclusion/StudentDeficiencies/StudentDeficiencies.constants';
import {
    studentDeficiencyBreadcrumb,
    studentDeficiencyUrls,
} from '@/components/Inclusion/StudentDeficiencies/StudentDeficiencies.routes';
import type {
    StudentDeficiencyIndexProps,
    StudentDeficiencyListRecord,
} from '@/components/Inclusion/StudentDeficiencies/StudentDeficiencies.types';
import StudentDeficiencyDeleteModal from '@/components/Inclusion/StudentDeficiencies/StudentDeficiencyDeleteModal';
import StudentRecordReturnButton from '@/components/Inclusion/Students/StudentRecordReturnButton';
import { TableListLayout, useTableListFilters } from '@/components/Tables/TableList/TableList';
import { useConfirmedAction } from '@/components/UI/ConfirmActionModal/useConfirmedAction';

export default function InclusionStudentDeficienciesIndexPage({
    student,
    deficiencies,
    filterDeficiencies,
    filters: initialFilters,
    can,
}: StudentDeficiencyIndexProps): React.JSX.Element {
    const errors = usePage().props.errors as Record<string, string | undefined>;
    const filters = useTableListFilters({
        url: studentDeficiencyUrls.index(student.id),
        initialFilters,
        emptyFilters: emptyStudentDeficiencyFilters,
        failureText: 'Não foi possível atualizar os perfis de atendimento. Tente novamente.',
    });
    const removal = useConfirmedAction<StudentDeficiencyListRecord>({
        failureText: 'Não foi possível excluir o perfil de atendimento. Tente novamente.',
    });
    const removalTarget = removal.target
        ? { profileName: removal.target.deficiency?.name ?? 'selecionado' }
        : null;

    function confirmRemoval(): void {
        if (removal.target) {
            filters.cancelScheduled();
            removal.submit('delete', studentDeficiencyUrls.destroy(student.id, removal.target.id));
        }
    }

    return (
        <TableListLayout
            title="Perfis de Atendimento do Aluno"
            subtitle={`Aluno: ${student.person.name}`}
            breadcrumbItems={studentDeficiencyBreadcrumb({ student })}
            actions={
                <StudentRecordReturnButton
                    studentId={student.id}
                    tab={STUDENT_DEFICIENCY_RECORD_TAB}
                />
            }
            create={
                can.create && {
                    href: studentDeficiencyUrls.create(student.id),
                    label: 'Cadastrar perfil de atendimento do aluno',
                }
            }
            listLabel="Perfis de atendimento do aluno"
            loading={filters.loading}
            loadingLabel="Atualizando perfis de atendimento"
            filters={
                <StudentDeficiencyFilters
                    values={filters.values}
                    profileOptions={filterDeficiencies}
                    errors={errors}
                    onUpdate={filters.update}
                    onClear={filters.clear}
                    onSubmit={filters.submit}
                />
            }
            dialogs={
                <StudentDeficiencyDeleteModal
                    target={removalTarget}
                    context="list"
                    processing={removal.processing}
                    onClose={removal.close}
                    onConfirm={confirmRemoval}
                />
            }
        >
            <StudentDeficiencyList
                studentId={student.id}
                deficiencies={deficiencies}
                permissions={can}
                loading={filters.loading}
                processing={removal.processing}
                onDelete={(profile) => {
                    filters.cancelScheduled();
                    removal.open(profile);
                }}
                onPageSelect={filters.selectPage}
            />
        </TableListLayout>
    );
}

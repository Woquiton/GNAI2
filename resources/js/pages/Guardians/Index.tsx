import { usePage } from '@inertiajs/react';
import GuardianDeleteModal from '@/components/Guardians/GuardianDeleteModal';
import { emptyGuardianFilters } from '@/components/Guardians/Guardians.constants';
import {
    guardianBreadcrumb,
    guardianUrls,
} from '@/components/Guardians/Guardians.routes';
import type {
    GuardianIndexProps,
    GuardianRecord,
} from '@/components/Guardians/Guardians.types';
import { guardianListTour } from '@/components/Guardians/guardianTours';
import GuardianFilters from '@/components/Guardians/List/GuardianFilters';
import GuardianList from '@/components/Guardians/List/GuardianList';
import StudentRecordReturnButton from '@/components/Students/StudentRecordReturnButton';
import { TableListLayout, useTableListFilters } from '@/components/Tables/TableList/TableList';
import { useConfirmedAction } from '@/components/UI/ConfirmActionModal/useConfirmedAction';

export default function GuardiansIndexPage({
    student,
    guardians,
    relationships,
    filters: initialFilters,
    can,
}: GuardianIndexProps): React.JSX.Element {
    const errors = usePage().props.errors as Record<string, string | undefined>;
    const urls = guardianUrls(student.id);
    const filters = useTableListFilters({
        url: urls.index,
        initialFilters,
        emptyFilters: emptyGuardianFilters,
        failureText: 'Não foi possível atualizar a listagem de responsáveis. Tente novamente.',
    });
    const removal = useConfirmedAction<GuardianRecord>({
        failureText: 'Não foi possível excluir o responsável. Tente novamente.',
    });

    function openRemoval(guardian: GuardianRecord): void {
        filters.cancelScheduled();
        removal.open(guardian);
    }

    function confirmRemoval(): void {
        if (removal.target) {
            filters.cancelScheduled();
            removal.submit('delete', urls.destroy(removal.target.id));
        }
    }

    return (
        <TableListLayout
            title={`Responsáveis, ${student.person.name}`}
            subtitle="Gerenciamento de vínculos familiares e contatos de emergência."
            breadcrumbItems={guardianBreadcrumb({ student })}
            actions={<StudentRecordReturnButton studentId={student.id} tab="guardians" />}
            create={can.create && { href: urls.create, label: 'Cadastrar responsável do aluno' }}
            listLabel="Listagem de responsáveis do aluno"
            loading={filters.loading}
            loadingLabel="Atualizando responsáveis"
            tour={guardianListTour}
            filters={
                <GuardianFilters
                    values={filters.values}
                    relationships={relationships}
                    errors={errors}
                    onUpdate={filters.update}
                    onClear={filters.clear}
                    onSubmit={filters.submit}
                />
            }
            dialogs={
                <GuardianDeleteModal
                    guardian={removal.target}
                    context="list"
                    processing={removal.processing}
                    onClose={removal.close}
                    onConfirm={confirmRemoval}
                />
            }
        >
            <GuardianList
                guardians={guardians}
                relationships={relationships}
                permissions={can}
                loading={filters.loading}
                processing={removal.processing}
                onDelete={openRemoval}
                onPageSelect={filters.selectPage}
            />
        </TableListLayout>
    );
}

import { usePage } from '@inertiajs/react';
import SemesterCurrentNotice from '@/components/Inclusion/Semesters/List/SemesterCurrentNotice';
import SemesterFilters from '@/components/Inclusion/Semesters/List/SemesterFilters';
import SemesterList from '@/components/Inclusion/Semesters/List/SemesterList';
import SemesterDeleteModal from '@/components/Inclusion/Semesters/SemesterDeleteModal';
import { emptySemesterFilters } from '@/components/Inclusion/Semesters/Semesters.constants';
import {
    semesterBreadcrumb,
    semesterUrls,
} from '@/components/Inclusion/Semesters/Semesters.routes';
import type {
    SemesterIndexProps,
    SemesterRecord,
} from '@/components/Inclusion/Semesters/Semesters.types';
import { TableListLayout, useTableListFilters } from '@/components/Tables/TableList/TableList';
import { useConfirmedAction } from '@/components/UI/ConfirmActionModal/useConfirmedAction';

export default function InclusionSemestersIndexPage({
    semesters,
    filters: initialFilters,
    can,
}: SemesterIndexProps): React.JSX.Element {
    const errors = usePage().props.errors as Record<string, string | undefined>;
    const filters = useTableListFilters({
        url: semesterUrls.index,
        initialFilters,
        emptyFilters: emptySemesterFilters,
        failureText: 'Não foi possível atualizar os semestres. Tente novamente.',
    });
    const removal = useConfirmedAction<SemesterRecord>({
        failureText: 'Não foi possível excluir o semestre. Tente novamente.',
    });
    const currentChange = useConfirmedAction<SemesterRecord>({
        failureText: 'Não foi possível definir o semestre atual. Tente novamente.',
    });

    function openRemoval(semester: SemesterRecord): void {
        filters.cancelScheduled();
        removal.open(semester);
    }

    function setCurrent(semester: SemesterRecord): void {
        filters.cancelScheduled();
        currentChange.submit('patch', semesterUrls.setCurrent(semester.id));
    }

    function confirmRemoval(): void {
        if (removal.target) {
            removal.submit('delete', semesterUrls.destroy(removal.target.id));
        }
    }

    return (
        <TableListLayout
            title="Semestres Letivos"
            subtitle="Configuração de períodos para organização dos atendimentos e relatórios."
            breadcrumbItems={semesterBreadcrumb()}
            create={can.create && { href: semesterUrls.create, label: 'Cadastrar semestre' }}
            listLabel="Listagem de semestres"
            loading={filters.loading}
            loadingLabel="Atualizando semestres"
            filters={
                <SemesterFilters
                    values={filters.values}
                    errors={errors}
                    onUpdate={filters.update}
                    onClear={filters.clear}
                    onSubmit={filters.submit}
                />
            }
            dialogs={
                <>
                    <SemesterCurrentNotice />
                    <SemesterDeleteModal
                        semester={removal.target}
                        processing={removal.processing}
                        onClose={removal.close}
                        onConfirm={confirmRemoval}
                    />
                </>
            }
        >
            <SemesterList
                semesters={semesters}
                permissions={can}
                loading={filters.loading}
                deleting={removal.processing}
                settingCurrent={currentChange.processing}
                onDelete={openRemoval}
                onSetCurrent={setCurrent}
                onPageSelect={filters.selectPage}
            />
        </TableListLayout>
    );
}

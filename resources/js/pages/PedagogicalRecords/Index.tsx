import { usePage } from '@inertiajs/react';
import PedagogicalRecordFilters from '@/components/PedagogicalRecords/List/PedagogicalRecordFilters';
import PedagogicalRecordList from '@/components/PedagogicalRecords/List/PedagogicalRecordList';
import PedagogicalRecordScopeButton from '@/components/PedagogicalRecords/List/PedagogicalRecordScopeButton';
import {
    emptyPedagogicalRecordFilters,
    pedagogicalRecordFailureTexts,
    pedagogicalRecordFilterSets,
} from '@/components/PedagogicalRecords/PedagogicalRecords.constants';
import {
    pedagogicalRecordListBreadcrumb,
    pedagogicalRecordUrls,
} from '@/components/PedagogicalRecords/PedagogicalRecords.routes';
import type { PedagogicalRecordListProps } from '@/components/PedagogicalRecords/PedagogicalRecords.types';
import { pedagogicalRecordIndexTour } from '@/components/PedagogicalRecords/pedagogicalRecordTours';
import { TableListLayout, useTableListFilters } from '@/components/Tables/TableList/TableList';

export default function PedagogicalRecordsIndexPage({
    pedagogicalRecords,
    students,
    professionals,
    courses,
    filters: initialFilters,
    can,
}: PedagogicalRecordListProps): React.JSX.Element {
    const errors = usePage().props.errors as Record<string, string | undefined>;
    const filters = useTableListFilters({
        url: pedagogicalRecordUrls.index,
        initialFilters,
        emptyFilters: emptyPedagogicalRecordFilters,
        failureText: pedagogicalRecordFailureTexts.list,
    });

    return (
        <TableListLayout
            title="Todos os Atendimentos Pedagógicos"
            subtitle="Visão geral dos registros pedagógicos dos profissionais permitidos."
            breadcrumbItems={pedagogicalRecordListBreadcrumb()}
            tour={pedagogicalRecordIndexTour}
            create={
                can.create && {
                    href: pedagogicalRecordUrls.directCreate,
                    label: 'Cadastrar atendimento pedagógico',
                }
            }
            actions={can.view_own ? <PedagogicalRecordScopeButton scope="own" /> : undefined}
            listLabel="Listagem de atendimentos pedagógicos"
            loading={filters.loading}
            loadingLabel="Atualizando atendimentos pedagógicos"
            filters={
                <PedagogicalRecordFilters
                    values={filters.values}
                    students={students}
                    professionals={professionals}
                    courses={courses}
                    primary={pedagogicalRecordFilterSets.all.primary}
                    more={pedagogicalRecordFilterSets.all.more}
                    errors={errors}
                    onUpdate={filters.update}
                    onClear={filters.clear}
                    onSubmit={filters.submit}
                />
            }
        >
            <PedagogicalRecordList
                records={pedagogicalRecords}
                variant="general"
                permissions={can}
                loading={filters.loading}
                onPageSelect={filters.selectPage}
            />
        </TableListLayout>
    );
}

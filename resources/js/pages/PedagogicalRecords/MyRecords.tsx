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
import { pedagogicalRecordMyRecordsTour } from '@/components/PedagogicalRecords/pedagogicalRecordTours';
import { TableListLayout, useTableListFilters } from '@/components/Tables/TableList/TableList';

export default function PedagogicalRecordsMyRecordsPage({
    pedagogicalRecords,
    students,
    professionals,
    courses,
    filters: initialFilters,
    can,
}: PedagogicalRecordListProps): React.JSX.Element {
    const errors = usePage().props.errors as Record<string, string | undefined>;
    const filters = useTableListFilters({
        url: pedagogicalRecordUrls.myRecords,
        initialFilters,
        emptyFilters: emptyPedagogicalRecordFilters,
        failureText: pedagogicalRecordFailureTexts.list,
    });

    return (
        <TableListLayout
            title="Meus Atendimentos Pedagógicos"
            subtitle="Histórico dos seus atendimentos pedagógicos."
            breadcrumbItems={pedagogicalRecordListBreadcrumb()}
            tour={pedagogicalRecordMyRecordsTour}
            create={
                can.create && {
                    href: pedagogicalRecordUrls.directCreate,
                    label: 'Cadastrar atendimento pedagógico',
                }
            }
            actions={can.view_all ? <PedagogicalRecordScopeButton scope="all" /> : undefined}
            listLabel="Listagem de atendimentos pedagógicos"
            loading={filters.loading}
            loadingLabel="Atualizando atendimentos pedagógicos"
            filters={
                <PedagogicalRecordFilters
                    values={filters.values}
                    students={students}
                    professionals={professionals}
                    courses={courses}
                    primary={pedagogicalRecordFilterSets.own.primary}
                    more={pedagogicalRecordFilterSets.own.more}
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

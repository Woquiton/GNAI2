import { usePage } from '@inertiajs/react';
import {
    AEE_LIST_FAILURE_TEXT,
    MY_AEE_RECORD_FILTERS,
    emptyAeeRecordFilters,
} from '@/components/Inclusion/AeeRecords/AeeRecords.constants';
import {
    aeeRecordListBreadcrumb,
    aeeRecordUrls,
} from '@/components/Inclusion/AeeRecords/AeeRecords.routes';
import type { AeeRecordListProps } from '@/components/Inclusion/AeeRecords/AeeRecords.types';
import AeeRecordFilters from '@/components/Inclusion/AeeRecords/List/AeeRecordFilters';
import AeeRecordList from '@/components/Inclusion/AeeRecords/List/AeeRecordList';
import { TableListLayout, useTableListFilters } from '@/components/Tables/TableList/TableList';
import Button from '@/components/UI/Button/Button';

export default function InclusionAeeRecordsMyRecordsPage({
    aeeRecords,
    filters: initialFilters,
    students,
    courses,
    can,
}: AeeRecordListProps): React.JSX.Element {
    const errors = usePage().props.errors as Record<string, string | undefined>;
    const filters = useTableListFilters({
        url: aeeRecordUrls.myRecords,
        initialFilters,
        emptyFilters: emptyAeeRecordFilters,
        failureText: AEE_LIST_FAILURE_TEXT,
    });
    const allRecordsAction = can.view_all ? (
        <Button
            href={aeeRecordUrls.index}
            tone="list-action"
            labelIconClass="fa fa-users"
            aria-label="Ver todos os atendimentos especializados"
        >
            Todos os Atendimentos
        </Button>
    ) : undefined;

    return (
        <TableListLayout
            title="Meus Atendimentos Especializados"
            subtitle="Histórico de registros dos seus atendimentos AEE."
            breadcrumbItems={aeeRecordListBreadcrumb('Atendimentos AEE')}
            create={
                can.create && {
                    href: aeeRecordUrls.directCreate,
                    label: 'Cadastrar atendimento especializado',
                }
            }
            actions={allRecordsAction}
            listLabel="Listagem de atendimentos especializados"
            loading={filters.loading}
            loadingLabel="Atualizando atendimentos especializados"
            filters={
                <AeeRecordFilters
                    idPrefix="my-aee-records"
                    label="Filtrar atendimentos especializados"
                    fields={MY_AEE_RECORD_FILTERS}
                    values={filters.values}
                    errors={errors}
                    students={students}
                    courses={courses}
                    onUpdate={filters.update}
                    onClear={filters.clear}
                    onSubmit={filters.submit}
                />
            }
        >
            <AeeRecordList
                aeeRecords={aeeRecords}
                canView={can.view}
                loading={filters.loading}
                onPageSelect={filters.selectPage}
            />
        </TableListLayout>
    );
}

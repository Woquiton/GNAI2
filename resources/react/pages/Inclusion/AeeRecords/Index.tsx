import { usePage } from '@inertiajs/react';
import {
    AEE_LIST_FAILURE_TEXT,
    AEE_RECORD_INDEX_FILTERS,
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

export default function InclusionAeeRecordsIndexPage({
    aeeRecords,
    filters: initialFilters,
    students,
    professionals,
    courses,
    can,
}: AeeRecordListProps): React.JSX.Element {
    const errors = usePage().props.errors as Record<string, string | undefined>;
    const filters = useTableListFilters({
        url: aeeRecordUrls.index,
        initialFilters,
        emptyFilters: emptyAeeRecordFilters,
        failureText: AEE_LIST_FAILURE_TEXT,
    });
    const myRecordsAction = can.view_own ? (
        <Button
            href={aeeRecordUrls.myRecords}
            tone="list-action"
            labelIconClass="fa fa-user"
            aria-label="Ver meus atendimentos especializados"
        >
            Meus Atendimentos
        </Button>
    ) : undefined;

    return (
        <TableListLayout
            title="Todos os Atendimentos Especializados"
            subtitle="Visão geral dos registros de atendimento AEE dos profissionais permitidos."
            breadcrumbItems={aeeRecordListBreadcrumb('Atendimentos Especializados')}
            create={
                can.create && {
                    href: aeeRecordUrls.directCreate,
                    label: 'Cadastrar atendimento especializado',
                }
            }
            actions={myRecordsAction}
            listLabel="Listagem de atendimentos especializados"
            loading={filters.loading}
            loadingLabel="Atualizando atendimentos especializados"
            filters={
                <AeeRecordFilters
                    idPrefix="aee-records"
                    label="Filtrar atendimentos especializados"
                    fields={AEE_RECORD_INDEX_FILTERS}
                    values={filters.values}
                    errors={errors}
                    students={students}
                    professionals={professionals}
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

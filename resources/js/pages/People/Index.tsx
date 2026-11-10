import { usePage } from '@inertiajs/react';
import { TableListLayout, useTableListFilters } from '@/components/Tables/TableList/TableList';
import PeopleList from '@/components/People/List/PeopleList';
import PeopleFilters from '@/components/People/List/PeopleFilters';
import type { PeopleIndexProps } from '@/components/People/People.types';
import { personUrls, personBreadcrumb } from '@/components/People/People.routes';
import { peopleListTour } from '@/components/People/personTours';

const emptyFilters = {
    email: '',
    phone: '',
    created_from: '',
    created_to: '',
    name: '',
    tag_id: '',
};

export default function PeopleIndexPage({
    people,
    tags,
    filters: initialFilters,
    can,
}: PeopleIndexProps): React.JSX.Element {
    const errors = usePage().props.errors as Record<string, string | undefined>;
    const filters = useTableListFilters({
        url: personUrls.index,
        initialFilters,
        emptyFilters,
        failureText: 'Não foi possível atualizar as pessoas. Tente novamente.',
    });
    return (
        <TableListLayout
            title="Pessoas"
            subtitle="Centralize os dados pessoais e organize os cadastros por etiquetas."
            breadcrumbItems={personBreadcrumb()}
            tour={peopleListTour}
            create={can.create && { href: personUrls.create, label: 'Cadastrar pessoa' }}
            listLabel="Listagem de pessoas"
            loading={filters.loading}
            loadingLabel="Atualizando pessoas"
            filters={
                <PeopleFilters
                    tags={tags}
                    errors={errors}
                    values={filters.values}
                    onUpdate={filters.update}
                    onClear={filters.clear}
                    onSubmit={filters.submit}
                />
            }
        >
            <PeopleList
                people={people}
                can={can}
                loading={filters.loading}
                onPageSelect={filters.selectPage}
            />
        </TableListLayout>
    );
}

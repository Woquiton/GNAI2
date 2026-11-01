import { usePage } from '@inertiajs/react';
import PendencyFilters from '@/components/Inclusion/Pendencies/List/PendencyFilters';
import PendencyList from '@/components/Inclusion/Pendencies/List/PendencyList';
import { emptyPendencyFilters } from '@/components/Inclusion/Pendencies/Pendencies.constants';
import {
    pendencyBreadcrumb,
    pendencyUrls,
} from '@/components/Inclusion/Pendencies/Pendencies.routes';
import type { PendencyListProps } from '@/components/Inclusion/Pendencies/Pendencies.types';
import { TableListLayout, useTableListFilters } from '@/components/Tables/TableList/TableList';
import Button from '@/components/UI/Button/Button';

export default function InclusionPendenciesMyPage({
    pendencies,
    priorities,
    filters: initialFilters,
    can,
}: PendencyListProps): React.JSX.Element {
    const errors = usePage().props.errors as Record<string, string | undefined>;
    // O profissional é sempre o usuário atual: sem campo próprio, `assigned_to` fica vazio e não é enviado.
    const filters = useTableListFilters({
        url: pendencyUrls.my,
        initialFilters,
        emptyFilters: emptyPendencyFilters,
        failureText: 'Não foi possível atualizar as pendências. Tente novamente.',
    });

    return (
        <TableListLayout
            title="Minhas Pendências"
            subtitle="Pendências atribuídas a você como responsável."
            breadcrumbItems={pendencyBreadcrumb({ current: 'Minhas Pendências' })}
            actions={
                <Button
                    href={pendencyUrls.index}
                    tone="cancel"
                    leftIconClass="fa fa-arrow-left"
                    label="Voltar"
                    title="Voltar para pendências"
                    aria-label="Voltar para pendências"
                />
            }
            listLabel="Listagem das minhas pendências"
            loading={filters.loading}
            loadingLabel="Atualizando pendências"
            filters={
                <PendencyFilters
                    values={filters.values}
                    priorities={priorities}
                    errors={errors}
                    onUpdate={filters.update}
                    onClear={filters.clear}
                    onSubmit={filters.submit}
                />
            }
        >
            <PendencyList
                variant="my"
                pendencies={pendencies}
                priorities={priorities}
                permissions={{ view: can.view, delete: false }}
                loading={filters.loading}
                processing={false}
                onPageSelect={filters.selectPage}
            />
        </TableListLayout>
    );
}

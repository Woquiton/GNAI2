import { usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { emptyAuditFilters } from '@/components/Audit/Audit.constants';
import { auditBreadcrumb, auditUrls } from '@/components/Audit/Audit.routes';
import type { AuditIndexProps, AuditRecord } from '@/components/Audit/Audit.types';
import AuditRecordModal from '@/components/Audit/Details/AuditRecordModal';
import AuditFilters from '@/components/Audit/List/AuditFilters';
import AuditList from '@/components/Audit/List/AuditList';
import { TableListLayout, useTableListFilters } from '@/components/Tables/TableList/TableList';

export default function AuditIndexPage({
    records,
    filters: initialFilters,
    options,
}: AuditIndexProps): React.JSX.Element {
    const errors = usePage().props.errors as Record<string, string | undefined>;
    const filters = useTableListFilters({
        url: auditUrls.index,
        initialFilters,
        emptyFilters: emptyAuditFilters,
        failureText: 'Não foi possível atualizar o histórico. Tente novamente.',
    });
    const [selected, setSelected] = useState<AuditRecord | null>(null);

    useEffect(() => {
        // Registro aberto que saiu da página atual (outra página ou outro filtro) fecha o detalhe.
        if (selected && !records.data.some((record) => record.id === selected.id)) {
            setSelected(null);
        }
    }, [records.data, selected]);

    return (
        <TableListLayout
            title="Histórico de Alterações"
            subtitle="Consulte quem criou, alterou, excluiu ou restaurou registros do sistema, e o que mudou em cada operação."
            breadcrumbItems={auditBreadcrumb()}
            listLabel="Histórico de alterações"
            loading={filters.loading}
            loadingLabel="Atualizando histórico de alterações"
            filters={
                <AuditFilters
                    values={filters.values}
                    options={options}
                    errors={errors}
                    moreFiltersActive={Boolean(initialFilters.type || initialFilters.event)}
                    onUpdate={filters.update}
                    onClear={filters.clear}
                    onSubmit={filters.submit}
                />
            }
            dialogs={<AuditRecordModal record={selected} onClose={() => setSelected(null)} />}
        >
            <AuditList
                records={records}
                filtered={Object.values(filters.values).some((value) => value !== '')}
                loading={filters.loading}
                onSelect={setSelected}
                onPageSelect={filters.selectPage}
            />
        </TableListLayout>
    );
}

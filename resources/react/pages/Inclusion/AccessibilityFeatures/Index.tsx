import { usePage } from '@inertiajs/react';
import AccessibilityFeatureDeleteModal from '@/components/Inclusion/AccessibilityFeatures/AccessibilityFeatureDeleteModal';
import { emptyAccessibilityFeatureFilters } from '@/components/Inclusion/AccessibilityFeatures/AccessibilityFeatures.constants';
import {
    accessibilityFeatureBreadcrumb,
    accessibilityFeatureUrls,
} from '@/components/Inclusion/AccessibilityFeatures/AccessibilityFeatures.routes';
import type {
    AccessibilityFeatureIndexProps,
    AccessibilityFeatureRecord,
} from '@/components/Inclusion/AccessibilityFeatures/AccessibilityFeatures.types';
import AccessibilityFeatureFilters from '@/components/Inclusion/AccessibilityFeatures/List/AccessibilityFeatureFilters';
import AccessibilityFeatureList from '@/components/Inclusion/AccessibilityFeatures/List/AccessibilityFeatureList';
import { TableListLayout, useTableListFilters } from '@/components/Tables/TableList/TableList';
import { useConfirmedAction } from '@/components/UI/ConfirmActionModal/useConfirmedAction';

export default function InclusionAccessibilityFeaturesIndexPage({
    features,
    filters: initialFilters,
    can,
}: AccessibilityFeatureIndexProps): React.JSX.Element {
    const errors = usePage().props.errors as Record<string, string | undefined>;
    const filters = useTableListFilters({
        url: accessibilityFeatureUrls.index,
        initialFilters,
        emptyFilters: emptyAccessibilityFeatureFilters,
        failureText: 'Não foi possível atualizar os recursos de acessibilidade. Tente novamente.',
    });
    const removal = useConfirmedAction<AccessibilityFeatureRecord>({
        failureText: 'Não foi possível excluir o recurso. Tente novamente.',
    });

    function confirmRemoval(): void {
        if (removal.target) {
            filters.cancelScheduled();
            removal.submit('delete', accessibilityFeatureUrls.destroy(removal.target.id));
        }
    }

    return (
        <TableListLayout
            title="Recursos de Acessibilidade"
            subtitle="Gerencie as categorias de recursos de acessibilidade disponíveis."
            breadcrumbItems={accessibilityFeatureBreadcrumb()}
            create={
                can.create && {
                    href: accessibilityFeatureUrls.create,
                    label: 'Cadastrar recurso de acessibilidade',
                }
            }
            listLabel="Listagem de recursos de acessibilidade"
            loading={filters.loading}
            loadingLabel="Atualizando recursos de acessibilidade"
            filters={
                <AccessibilityFeatureFilters
                    values={filters.values}
                    errors={errors}
                    onUpdate={filters.update}
                    onClear={filters.clear}
                    onSubmit={filters.submit}
                />
            }
            dialogs={
                <AccessibilityFeatureDeleteModal
                    feature={removal.target}
                    processing={removal.processing}
                    onClose={removal.close}
                    onConfirm={confirmRemoval}
                />
            }
        >
            <AccessibilityFeatureList
                features={features}
                permissions={can}
                loading={filters.loading}
                processing={removal.processing}
                onDelete={removal.open}
                onPageSelect={filters.selectPage}
            />
        </TableListLayout>
    );
}

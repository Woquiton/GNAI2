import AccessibilityFeatureDeleteModal from '@/components/Inclusion/AccessibilityFeatures/AccessibilityFeatureDeleteModal';
import {
    accessibilityFeatureBreadcrumb,
    accessibilityFeatureUrls,
} from '@/components/Inclusion/AccessibilityFeatures/AccessibilityFeatures.routes';
import type { AccessibilityFeatureShowProps } from '@/components/Inclusion/AccessibilityFeatures/AccessibilityFeatures.types';
import AccessibilityFeatureDetails from '@/components/Inclusion/AccessibilityFeatures/Details/AccessibilityFeatureDetails';
import AccessibilityFeatureDetailsActions from '@/components/Inclusion/AccessibilityFeatures/Details/AccessibilityFeatureDetailsActions';
import { accessibilityFeatureShowTour } from '@/components/Inclusion/AccessibilityFeatures/accessibilityFeatureTours';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';
import { useConfirmedAction } from '@/components/UI/ConfirmActionModal/useConfirmedAction';

export default function InclusionAccessibilityFeaturesShowPage({
    feature,
    display,
    can,
}: AccessibilityFeatureShowProps): React.JSX.Element {
    const removal = useConfirmedAction<typeof feature>({
        failureText: 'Não foi possível excluir o recurso. Tente novamente.',
    });

    return (
        <BusinessPage
            title="Detalhes do Recurso de Acessibilidade"
            subtitle={`Visualize as informações cadastrais e status do recurso: ${feature.name}`}
            documentTitle={feature.name}
            breadcrumbItems={accessibilityFeatureBreadcrumb({ feature })}
            busy={removal.processing}
            tour={accessibilityFeatureShowTour}
        >
            <AccessibilityFeatureDetails feature={feature} display={display} />
            <AccessibilityFeatureDetailsActions
                featureId={feature.id}
                permissions={can}
                deleting={removal.processing}
                onDelete={() => removal.open(feature)}
            />
            <AccessibilityFeatureDeleteModal
                feature={removal.target}
                processing={removal.processing}
                onClose={removal.close}
                onConfirm={() =>
                    removal.submit('delete', accessibilityFeatureUrls.destroy(feature.id))
                }
            />
        </BusinessPage>
    );
}

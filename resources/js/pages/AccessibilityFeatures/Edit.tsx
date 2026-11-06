import AccessibilityFeatureForm from '@/components/AccessibilityFeatures/Form/AccessibilityFeatureForm';
import { accessibilityFeatureBreadcrumb } from '@/components/AccessibilityFeatures/AccessibilityFeatures.routes';
import type { AccessibilityFeatureEditProps } from '@/components/AccessibilityFeatures/AccessibilityFeatures.types';
import { accessibilityFeatureEditTour } from '@/components/AccessibilityFeatures/accessibilityFeatureTours';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';

export default function AccessibilityFeaturesEditPage({
    accessibilityFeature,
    can,
}: AccessibilityFeatureEditProps): React.JSX.Element {
    return (
        <BusinessPage
            title="Editar Recurso de Acessibilidade"
            subtitle={`Atualizando informações de: ${accessibilityFeature.name}`}
            breadcrumbItems={accessibilityFeatureBreadcrumb({
                feature: accessibilityFeature,
                current: 'Editar',
            })}
            tour={accessibilityFeatureEditTour}
        >
            <AccessibilityFeatureForm
                key={accessibilityFeature.id}
                feature={accessibilityFeature}
                canSubmit={can.update}
            />
        </BusinessPage>
    );
}

import AccessibilityFeatureForm from '@/components/AccessibilityFeatures/Form/AccessibilityFeatureForm';
import { accessibilityFeatureBreadcrumb } from '@/components/AccessibilityFeatures/AccessibilityFeatures.routes';
import type { AccessibilityFeatureCreateProps } from '@/components/AccessibilityFeatures/AccessibilityFeatures.types';
import { accessibilityFeatureCreateTour } from '@/components/AccessibilityFeatures/accessibilityFeatureTours';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';

export default function AccessibilityFeaturesCreatePage({
    can,
}: AccessibilityFeatureCreateProps): React.JSX.Element {
    return (
        <BusinessPage
            title="Novo Recurso de Acessibilidade"
            subtitle="Defina uma nova categoria de acessibilidade."
            breadcrumbItems={accessibilityFeatureBreadcrumb({ current: 'Cadastrar' })}
            tour={accessibilityFeatureCreateTour}
        >
            <AccessibilityFeatureForm canSubmit={can.store} />
        </BusinessPage>
    );
}

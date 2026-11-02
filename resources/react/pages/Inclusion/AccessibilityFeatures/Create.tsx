import AccessibilityFeatureForm from '@/components/Inclusion/AccessibilityFeatures/Form/AccessibilityFeatureForm';
import { accessibilityFeatureBreadcrumb } from '@/components/Inclusion/AccessibilityFeatures/AccessibilityFeatures.routes';
import type { AccessibilityFeatureCreateProps } from '@/components/Inclusion/AccessibilityFeatures/AccessibilityFeatures.types';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';

export default function InclusionAccessibilityFeaturesCreatePage({
    can,
}: AccessibilityFeatureCreateProps): React.JSX.Element {
    return (
        <BusinessPage
            title="Novo Recurso de Acessibilidade"
            subtitle="Defina uma nova categoria de acessibilidade."
            breadcrumbItems={accessibilityFeatureBreadcrumb({ current: 'Cadastrar' })}
        >
            <AccessibilityFeatureForm canSubmit={can.store} />
        </BusinessPage>
    );
}

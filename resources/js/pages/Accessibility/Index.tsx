import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';
import { resourceBreadcrumb } from '@/components/Navigation/PageBreadcrumb/resourceBreadcrumb';
import AccessibilityContent from '@/components/Accessibility/AccessibilityContent';
import { accessibilityTour } from '@/components/Accessibility/accessibilityTour';

export default function Index(): React.JSX.Element {
    return (
        <BusinessPage
            title="Acessibilidade"
            subtitle="Conheça os recursos para navegar e ajustar a apresentação do Gnai."
            breadcrumbItems={resourceBreadcrumb({
                collection: { label: 'Acessibilidade', href: '/acessibilidade' },
            })}
            tour={accessibilityTour}
        >
            <AccessibilityContent />
        </BusinessPage>
    );
}

import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';
import WebsiteBuilderForm from '@/components/Website/Builder/WebsiteBuilderForm';
import type { WebsiteBuilderProps } from '@/components/Website/Builder/WebsiteBuilder.types';
import { websiteBuilderEditTour } from '@/components/Website/Builder/websiteBuilderTours';
import { websiteBuilderBreadcrumb } from '@/components/Website/Website.routes';

export default function WebsiteBuilderEditPage(props: WebsiteBuilderProps): React.JSX.Element {
    return (
        <BusinessPage
            title="Site: página inicial"
            subtitle="Monte a página inicial do site e acompanhe o resultado em tempo real antes de salvar."
            breadcrumbItems={websiteBuilderBreadcrumb()}
            className="websiteBuilderPage"
            tour={websiteBuilderEditTour}
        >
            <WebsiteBuilderForm {...props} />
        </BusinessPage>
    );
}

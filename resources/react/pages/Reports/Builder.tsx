import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';
import ReportBuilderForm from '@/components/Reports/Form/ReportBuilderForm';
import { reportBreadcrumb } from '@/components/Reports/Reports.routes';
import type { ReportBuilderProps } from '@/components/Reports/Reports.types';

export default function ReportsBuilderPage(props: ReportBuilderProps): React.JSX.Element {
    return (
        <BusinessPage
            title="Gerador de Relatórios e Consultas"
            subtitle="Monte seu relatório escolhendo os dados, as informações e os filtros que deseja visualizar."
            breadcrumbItems={reportBreadcrumb()}
            className="reportBuilder"
        >
            <ReportBuilderForm {...props} />
        </BusinessPage>
    );
}

import BusinessPage from "@/components/Navigation/BusinessPage/BusinessPage";
import CaseStudyList from "./CaseStudyList";
import type { CaseStudyListProps } from "./CaseStudies.types";

export default function InclusionCaseStudiesAllPage(
    props: CaseStudyListProps,
): React.JSX.Element {
    return (
        <BusinessPage
            title="Estudos de Caso"
            subtitle="Primeira etapa da cadeia Estudo de Caso → PAEE → PEI (Decreto 12.686/2025)."
            breadcrumbItems={[
                { label: "Home", href: "/autenticacao/painel" },
                { label: "Estudos de Caso" },
            ]}
            className="caseStudiesPage"
        >
            <CaseStudyList
                {...props}
                student={null}
            />
        </BusinessPage>
    );
}

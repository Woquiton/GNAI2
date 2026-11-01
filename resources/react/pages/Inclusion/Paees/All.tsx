import BusinessPage from "@/components/Navigation/BusinessPage/BusinessPage";
import PaeeList from "./PaeeList";
import type { PaeeListProps } from "./Paees.types";

export default function InclusionPaeesAllPage(
    props: PaeeListProps,
): React.JSX.Element {
    return (
        <BusinessPage
            title="PAEE"
            subtitle="Plano de Atendimento Educacional Especializado, vinculado a um Estudo de Caso concluído."
            breadcrumbItems={[
                { label: "Home", href: "/autenticacao/painel" },
                { label: "PAEEs" },
            ]}
            className="paeesPage"
        >
            <PaeeList {...props} />
        </BusinessPage>
    );
}

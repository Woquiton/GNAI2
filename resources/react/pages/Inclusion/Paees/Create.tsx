import BusinessPage from "@/components/Navigation/BusinessPage/BusinessPage";
import {
    studentUrl,
    studentsBase,
} from "@/components/Students/Students.utils";
import PaeeForm from "./PaeeForm";
import type { PaeeCreateProps } from "./Paees.types";
import { caseStudyUrl, paeeVersionLabel } from "./Paees.utils";

export default function InclusionPaeesCreatePage({
    caseStudy,
    student,
}: PaeeCreateProps): React.JSX.Element {
    return (
        <BusinessPage
            title="Novo PAEE"
            subtitle={`Aluno: ${student.name} • a partir do Estudo de Caso ${paeeVersionLabel(caseStudy.version)}`}
            breadcrumbItems={[
                { label: "Home", href: "/auth/dashboard" },
                { label: "Alunos", href: studentsBase },
                { label: student.name, href: studentUrl(student.id) },
                { label: "Novo PAEE" },
            ]}
            className="paeesPage"
        >
            <PaeeForm
                caseStudyId={caseStudy.id}
                cancelHref={caseStudyUrl(caseStudy.id)}
            />
        </BusinessPage>
    );
}

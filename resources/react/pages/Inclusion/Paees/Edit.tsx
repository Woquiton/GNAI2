import BusinessPage from "@/components/Navigation/BusinessPage/BusinessPage";
import {
    studentUrl,
    studentsBase,
} from "@/components/Students/Students.utils";
import PaeeForm from "./PaeeForm";
import type { PaeeEditProps } from "./Paees.types";
import { paeeUrl, paeeVersionLabel } from "./Paees.utils";

export default function InclusionPaeesEditPage({
    paee,
    student,
}: PaeeEditProps): React.JSX.Element {
    return (
        <BusinessPage
            title={`Editar PAEE (${paeeVersionLabel(paee.version)})`}
            subtitle={`Aluno: ${student.name}`}
            breadcrumbItems={[
                { label: "Home", href: "/auth/dashboard" },
                { label: "Alunos", href: studentsBase },
                { label: student.name, href: studentUrl(student.id) },
                { label: `PAEE ${paeeVersionLabel(paee.version)}`, href: paeeUrl(paee.id) },
                { label: "Editar PAEE" },
            ]}
            className="paeesPage"
        >
            <PaeeForm
                key={paee.id}
                paee={paee}
                cancelHref={paeeUrl(paee.id)}
            />
        </BusinessPage>
    );
}

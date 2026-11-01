import BusinessPage from "@/components/Navigation/BusinessPage/BusinessPage";
import StudentRecordReturnButton from "@/components/Students/StudentRecordReturnButton";
import {
    studentRecordUrl,
    studentsBase,
} from "@/components/Students/Students.utils";
import PaeeList from "./PaeeList";
import type {
    PaeeListProps,
    PaeeStudentSummary,
} from "./Paees.types";
import { studentPaeesTab } from "./Paees.utils";

export default function InclusionPaeesIndexPage({
    student,
    ...props
}: PaeeListProps & {
    student: PaeeStudentSummary;
}): React.JSX.Element {
    return (
        <BusinessPage
            title={`PAEE de ${student.name}`}
            subtitle="Planos de Atendimento Educacional Especializado do aluno."
            breadcrumbItems={[
                { label: "Home", href: "/auth/dashboard" },
                { label: "Alunos", href: studentsBase },
                { label: student.name, href: studentRecordUrl(student.id, studentPaeesTab) },
                { label: "PAEE" },
            ]}
            actions={
                <StudentRecordReturnButton
                    studentId={student.id}
                    tab={studentPaeesTab}
                />
            }
            className="paeesPage"
        >
            <PaeeList
                {...props}
                student={student}
            />
        </BusinessPage>
    );
}

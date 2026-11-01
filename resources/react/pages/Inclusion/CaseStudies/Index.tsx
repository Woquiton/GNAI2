import BusinessPage from "@/components/Navigation/BusinessPage/BusinessPage";
import StudentRecordReturnButton from "@/components/Students/StudentRecordReturnButton";
import {
    studentRecordUrl,
    studentsBase,
} from "@/components/Students/Students.utils";
import { TableListCreateButton } from "@/components/Tables/TableList/TableList";
import Button from "@/components/UI/Button/Button";
import CaseStudyList from "./CaseStudyList";
import {
    caseStudiesTab,
    createCaseStudyUrl,
    studentCaseStudiesUrl,
} from "./caseStudies.utils";
import type {
    CaseStudyListProps,
    CaseStudyStudent,
} from "./CaseStudies.types";

export default function InclusionCaseStudiesIndexPage({
    student,
    ...props
}: CaseStudyListProps & {
    student: CaseStudyStudent;
}): React.JSX.Element {
    return (
        <BusinessPage
            title={`Estudos de Caso de ${student.name}`}
            breadcrumbItems={[
                { label: "Home", href: "/auth/dashboard" },
                { label: "Alunos", href: studentsBase },
                { label: student.name, href: studentRecordUrl(student.id, caseStudiesTab) },
                { label: "Estudos de Caso" },
            ]}
            actions={
                <>
                    <StudentRecordReturnButton
                        studentId={student.id}
                        tab={caseStudiesTab}
                    />
                    <Button
                        href={`${studentCaseStudiesUrl(student.id)}/history`}
                        tone="white"
                        leftIconClass="fa fa-history"
                        label="Ver Histórico"
                        aria-label="Ver histórico completo de Estudos de Caso do aluno"
                    />
                    {props.can.create ? (
                        <TableListCreateButton
                            href={createCaseStudyUrl(student.id)}
                            ariaLabel="Cadastrar Estudo de Caso do aluno"
                        />
                    ) : null}
                </>
            }
            className="caseStudiesPage"
        >
            <CaseStudyList
                {...props}
                student={student}
            />
        </BusinessPage>
    );
}

import BusinessPage from "@/components/Navigation/BusinessPage/BusinessPage";
import StudentRecordReturnButton from "@/components/Students/StudentRecordReturnButton";
import {
    dateLabel,
    studentRecordUrl,
    studentsBase,
} from "@/components/Students/Students.utils";
import TableActions from "@/components/Tables/TableActions/TableActions";
import {
    TableListCard,
    TableListEmpty,
    TableListScroll,
    TableListSummary,
    TableListTable,
    type TableListColumn,
} from "@/components/Tables/TableList/TableList";
import Button from "@/components/UI/Button/Button";
import TableLabel from "@/components/UI/TableLabel/TableLabel";
import { caseStudiesTab, caseStudyUrl } from "./caseStudies.utils";
import type { CaseStudyHistoryProps } from "./CaseStudies.types";

const columns: TableListColumn[] = [
    { id: "version", label: "Versão", width: "16%", minWidth: 64, fixed: "start" },
    { id: "semester", label: "Semestre", width: "26%", minWidth: 100 },
    { id: "status", label: "Status", width: "22%", minWidth: 90 },
    { id: "created", label: "Criado em", width: "20%", minWidth: 80 },
    { id: "actions", label: "Ações", width: "16%", minWidth: 72, fixed: "end" },
];

export default function InclusionCaseStudiesHistoryPage({
    student,
    caseStudies,
    can,
}: CaseStudyHistoryProps): React.JSX.Element {
    const count = caseStudies.length;
    const summary = `${count} ${count === 1 ? "registro" : "registros"}`;

    return (
        <BusinessPage
            title={`Histórico de Estudos de Caso de ${student.name}`}
            breadcrumbItems={[
                { label: "Home", href: "/auth/dashboard" },
                { label: "Alunos", href: studentsBase },
                { label: student.name, href: studentRecordUrl(student.id, caseStudiesTab) },
                { label: "Histórico de Estudos de Caso" },
            ]}
            actions={
                <StudentRecordReturnButton
                    studentId={student.id}
                    tab={caseStudiesTab}
                />
            }
            className="caseStudiesPage"
        >
            <TableListCard aria-label="Histórico de Estudos de Caso do aluno">
                <TableListScroll aria-label="Tabela do histórico de Estudos de Caso">
                    <TableListTable
                        columns={columns}
                        summary={summary}
                    >
                        {count ? (
                            caseStudies.map((caseStudy) => (
                                <tr key={caseStudy.id}>
                                    <td>v{caseStudy.version}</td>
                                    <td>{caseStudy.semester_label || "Não informado"}</td>
                                    <td>
                                        <TableLabel tone={caseStudy.status_tone}>
                                            {caseStudy.status_label}
                                        </TableLabel>
                                    </td>
                                    <td>{dateLabel(caseStudy.created_at)}</td>
                                    <td>
                                        <TableActions>
                                            {can.view ? (
                                                <Button
                                                    href={caseStudyUrl(caseStudy.id)}
                                                    size="sm"
                                                    tone="dark-blue"
                                                    iconOnly
                                                    leftIconClass="fa fa-eye"
                                                    aria-label={`Visualizar Estudo de Caso v${caseStudy.version}`}
                                                />
                                            ) : (
                                                <span>Nenhuma ação</span>
                                            )}
                                        </TableActions>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <TableListEmpty colSpan={columns.length}>
                                    Nenhum Estudo de Caso encontrado.
                                </TableListEmpty>
                            </tr>
                        )}
                    </TableListTable>
                </TableListScroll>
                <TableListSummary>{summary}</TableListSummary>
            </TableListCard>
        </BusinessPage>
    );
}

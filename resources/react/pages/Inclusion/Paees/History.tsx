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
import { paeeName } from "./PaeeList";
import type { PaeeHistoryProps } from "./Paees.types";
import {
    paeeStatusTone,
    paeeUrl,
    paeeVersionLabel,
    studentPaeesTab,
} from "./Paees.utils";

const columns: TableListColumn[] = [
    { id: "version", label: "Versão", width: "16%", minWidth: 72, fixed: "start" },
    { id: "semester", label: "Semestre", width: "28%", minWidth: 110 },
    { id: "status", label: "Status", width: "20%", minWidth: 80 },
    { id: "next_review", label: "Próxima revisão", width: "22%", minWidth: 100 },
    { id: "actions", label: "Ações", width: "14%", minWidth: 72, fixed: "end" },
];

export default function InclusionPaeesHistoryPage({
    student,
    paees,
    can,
}: PaeeHistoryProps): React.JSX.Element {
    const summary = `${paees.length} ${paees.length === 1 ? "registro" : "registros"}`;

    return (
        <BusinessPage
            title="Histórico de PAEE"
            subtitle={`Aluno: ${student.name}`}
            breadcrumbItems={[
                { label: "Home", href: "/autenticacao/painel" },
                { label: "Alunos", href: studentsBase },
                { label: student.name, href: studentRecordUrl(student.id, studentPaeesTab) },
                { label: "Histórico de PAEE" },
            ]}
            actions={
                <StudentRecordReturnButton
                    studentId={student.id}
                    tab={studentPaeesTab}
                />
            }
            className="paeesPage"
        >
            <TableListCard aria-label="Histórico de PAEE do aluno">
                <TableListScroll aria-label="Tabela do histórico de PAEE">
                    <TableListTable
                        columns={columns}
                        summary={summary}
                    >
                        {paees.length ? (
                            paees.map((paee) => (
                                <tr key={paee.id}>
                                    <td>{paeeVersionLabel(paee.version)}</td>
                                    <td>{paee.semester_label || "Não informado"}</td>
                                    <td>
                                        <TableLabel tone={paeeStatusTone(paee.status)}>
                                            {paee.status_label}
                                        </TableLabel>
                                    </td>
                                    <td>{dateLabel(paee.next_review_date)}</td>
                                    <td>
                                        <TableActions>
                                            {can.view ? (
                                                <Button
                                                    href={paeeUrl(paee.id)}
                                                    size="sm"
                                                    tone="dark-blue"
                                                    iconOnly
                                                    leftIconClass="fa fa-eye"
                                                    aria-label={`Visualizar ${paeeName(paee)}`}
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
                                    Nenhum PAEE encontrado.
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

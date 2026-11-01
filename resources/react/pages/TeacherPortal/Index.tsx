import type { ReactNode } from "react";
import BusinessPage from "@/components/Navigation/BusinessPage/BusinessPage";
import TeacherPortalLayout from "@/components/Navigation/TeacherPortalLayout/TeacherPortalLayout";
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
import { teacherPortalBase, type TeacherPortalIndexProps } from "./TeacherPortal.types";
import "./TeacherPortal.css";

const columns: TableListColumn[] = [
    {
        id: "student",
        label: "Aluno",
        width: "34%",
        minWidth: 140,
        fixed: "start",
    },
    { id: "discipline", label: "Disciplina", width: "26%", minWidth: 110 },
    { id: "course", label: "Curso", width: "24%", minWidth: 110 },
    {
        id: "actions",
        label: "Ações",
        width: "16%",
        minWidth: 104,
        fixed: "end",
    },
];

export default function TeacherPortalIndexPage({
    assignments,
}: TeacherPortalIndexProps): React.JSX.Element {
    const summary = `${assignments.length} ${assignments.length === 1 ? "registro" : "registros"}`;

    return (
        <BusinessPage
            title="Meus Alunos e Adaptações (PEI)"
            subtitle="Aqui estão os alunos com PEI vinculado a você. Você pode editar a sua adaptação e consultar o perfil completo do aluno (em modo leitura)."
            breadcrumbItems={[{ label: "Portal do Professor" }]}
            className="teacherPortal"
        >
            <TableListCard aria-label="Alunos e adaptações vinculados a você">
                <TableListScroll aria-label="Alunos e adaptações vinculados a você">
                    <TableListTable columns={columns} summary={summary}>
                        {assignments.length ? assignments.map((item) => (
                            <tr key={item.id}>
                                <td>{item.student_name}</td>
                                <td>{item.discipline_name ?? "Não informada"}</td>
                                <td>{item.course_name ?? "Não informado"}</td>
                                <td>
                                    <TableActions>
                                        <Button
                                            href={`${teacherPortalBase}/alunos/${item.student_id}`}
                                            size="sm"
                                            tone="dark-blue"
                                            iconOnly
                                            leftIconClass="fa fa-eye"
                                            aria-label={`Ver aluno ${item.student_name}`}
                                        />
                                        <Button
                                            href={`${teacherPortalBase}/adaptacoes/${item.id}/editar`}
                                            size="sm"
                                            tone="warning"
                                            iconOnly
                                            leftIconClass="fa fa-pencil"
                                            aria-label={`Editar adaptação de ${item.discipline_name ?? "disciplina"} de ${item.student_name}`}
                                        />
                                    </TableActions>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <TableListEmpty colSpan={columns.length}>
                                    Nenhum aluno com adaptação vinculada a você no momento.
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

TeacherPortalIndexPage.layout = (page: ReactNode): ReactNode => (
    <TeacherPortalLayout>{page}</TeacherPortalLayout>
);

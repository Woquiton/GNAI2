import { useMemo } from "react";
import { usePage } from "@inertiajs/react";
import FormField from "@/components/Forms/FormField/FormField";
import FormLayout from "@/components/Forms/FormLayout/FormLayout";
import SelectField from "@/components/Forms/SelectField/SelectField";
import TextInput from "@/components/Forms/TextInput/TextInput";
import { dateLabel } from "@/components/Students/Students.utils";
import TableActions from "@/components/Tables/TableActions/TableActions";
import {
    TableListCard,
    TableListClearButton,
    TableListEmpty,
    TableListFilterActions,
    TableListFooter,
    TableListScroll,
    TableListTable,
    useTableListAction,
    useTableListVisit,
    type TableListColumn,
} from "@/components/Tables/TableList/TableList";
import Button from "@/components/UI/Button/Button";
import ConfirmActionModal from "@/components/UI/ConfirmActionModal/ConfirmActionModal";
import TableLabel from "@/components/UI/TableLabel/TableLabel";
import useAutoListFilters from "@/hooks/useAutoListFilters";
import {
    caseStudiesBase,
    caseStudyName,
    caseStudyUrl,
    studentCaseStudiesUrl,
} from "./caseStudies.utils";
import type {
    CaseStudyListFilters,
    CaseStudyListProps,
    CaseStudyRow,
} from "./CaseStudies.types";
import "./CaseStudyList.css";

const emptyFilters: CaseStudyListFilters = {
    search: "",
    status: "",
    semester_id: "",
};

const allColumns: TableListColumn[] = [
    { id: "student", label: "Aluno", width: "30%", minWidth: 130, fixed: "start" },
    { id: "semester", label: "Semestre", width: "16%", minWidth: 80 },
    { id: "version", label: "Versão", width: "10%", minWidth: 64 },
    { id: "status", label: "Status", width: "15%", minWidth: 90 },
    { id: "created", label: "Criado em", width: "13%", minWidth: 80 },
    { id: "actions", label: "Ações", width: "16%", minWidth: 110, fixed: "end" },
];

const studentColumns: TableListColumn[] = [
    { id: "semester", label: "Semestre", width: "26%", minWidth: 110, fixed: "start" },
    { id: "version", label: "Versão", width: "14%", minWidth: 64 },
    { id: "status", label: "Status", width: "20%", minWidth: 90 },
    { id: "created", label: "Criado em", width: "20%", minWidth: 80 },
    { id: "actions", label: "Ações", width: "20%", minWidth: 110, fixed: "end" },
];

/** Listagem paginada de Estudos de Caso, geral ou de um aluno. */
export default function CaseStudyList({
    caseStudies,
    student,
    semesters,
    statuses,
    filters: initialFilters,
    can,
}: CaseStudyListProps): React.JSX.Element {
    const byStudent = student !== null;
    const columns = byStudent ? studentColumns : allColumns;
    const pageErrors = usePage().props.errors as Record<string, string | undefined>;
    const list = useTableListVisit({
        url: byStudent ? studentCaseStudiesUrl(student.id) : caseStudiesBase,
        failureText: "Não foi possível atualizar os Estudos de Caso. Tente novamente.",
    });
    const removal = useTableListAction<CaseStudyRow>({
        failureText: "Não foi possível excluir o Estudo de Caso. Tente novamente.",
    });
    const initialValues = useMemo(
        () => ({ ...emptyFilters, ...initialFilters }),
        [initialFilters],
    );
    const { values, update, clear, submit, cancelScheduled } = useAutoListFilters({
        initialValues,
        emptyValues: emptyFilters,
        onSearch: (next) => list.visit(byStudent ? { ...next, search: "" } : next),
    });

    function describedBy(name: keyof CaseStudyListFilters, id: string): string | undefined {
        return pageErrors[name] ? `${id}-error` : undefined;
    }

    function rowName(caseStudy: CaseStudyRow): string {
        return caseStudyName({
            version: caseStudy.version,
            student: caseStudy.student ?? student,
        });
    }

    return (
        <>
            <TableListCard
                aria-label={byStudent ? "Estudos de Caso do aluno" : "Listagem geral de Estudos de Caso"}
                loading={list.loading}
                loadingLabel="Atualizando Estudos de Caso"
            >
                <FormLayout
                    onSubmit={(event) => {
                        event.preventDefault();
                        submit();
                    }}
                >
                    <div
                        className={
                            byStudent
                                ? "caseStudyList__filters caseStudyList__filters--student"
                                : "caseStudyList__filters"
                        }
                    >
                        {!byStudent ? (
                            <FormField
                                id="case-study-filter-search"
                                label="Aluno"
                                error={pageErrors.search}
                            >
                                <TextInput
                                    id="case-study-filter-search"
                                    name="search"
                                    value={values.search}
                                    placeholder="Nome do aluno..."
                                    invalid={Boolean(pageErrors.search)}
                                    aria-describedby={describedBy("search", "case-study-filter-search")}
                                    onChange={(event) => update("search", event.target.value)}
                                />
                            </FormField>
                        ) : null}
                        <FormField
                            id="case-study-filter-semester"
                            label="Semestre"
                            error={pageErrors.semester_id}
                        >
                            <SelectField
                                id="case-study-filter-semester"
                                name="semester_id"
                                label="Semestre"
                                placeholder="Todos"
                                value={values.semester_id}
                                options={semesters}
                                aria-invalid={Boolean(pageErrors.semester_id)}
                                aria-describedby={describedBy("semester_id", "case-study-filter-semester")}
                                onChange={(event) => update("semester_id", event.target.value)}
                            />
                        </FormField>
                        <FormField
                            id="case-study-filter-status"
                            label="Status"
                            error={pageErrors.status}
                        >
                            <SelectField
                                id="case-study-filter-status"
                                name="status"
                                label="Status"
                                placeholder="Todos"
                                value={values.status}
                                options={statuses}
                                aria-invalid={Boolean(pageErrors.status)}
                                aria-describedby={describedBy("status", "case-study-filter-status")}
                                onChange={(event) => update("status", event.target.value)}
                            />
                        </FormField>
                        <TableListFilterActions>
                            <TableListClearButton
                                onClick={clear}
                            />
                        </TableListFilterActions>
                    </div>
                </FormLayout>
                <TableListScroll aria-label="Tabela de Estudos de Caso">
                    <TableListTable
                        columns={columns}
                        page={caseStudies}
                    >
                        {caseStudies.data.length ? (
                            caseStudies.data.map((caseStudy) => {
                                const editable = can.update && caseStudy.status !== "completed";
                                const removable = can.delete && !caseStudy.paees_count;

                                return (
                                    <tr key={caseStudy.id}>
                                        {byStudent ? null : (
                                            <td>{caseStudy.student?.name || "Não informado"}</td>
                                        )}
                                        <td>{caseStudy.semester_label || "Não informado"}</td>
                                        <td>v{caseStudy.version}</td>
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
                                                        aria-label={`Visualizar ${rowName(caseStudy)}`}
                                                    />
                                                ) : null}
                                                {editable ? (
                                                    <Button
                                                        href={caseStudyUrl(caseStudy.id, "editar")}
                                                        size="sm"
                                                        tone="warning"
                                                        iconOnly
                                                        leftIconClass="fa fa-pencil"
                                                        aria-label={`Editar ${rowName(caseStudy)}`}
                                                    />
                                                ) : null}
                                                {removable ? (
                                                    <Button
                                                        tone="dark-red"
                                                        size="sm"
                                                        iconOnly
                                                        leftIconClass="fa fa-trash-o"
                                                        aria-label={`Excluir ${rowName(caseStudy)}`}
                                                        disabled={removal.processing}
                                                        onClick={() => {
                                                            cancelScheduled();
                                                            removal.open(caseStudy);
                                                        }}
                                                    />
                                                ) : null}
                                                {!can.view && !editable && !removable ? (
                                                    <span>Nenhuma ação</span>
                                                ) : null}
                                            </TableActions>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <TableListEmpty colSpan={columns.length}>
                                    Nenhum Estudo de Caso encontrado.
                                </TableListEmpty>
                            </tr>
                        )}
                    </TableListTable>
                </TableListScroll>
                <TableListFooter
                    page={caseStudies}
                    disabled={list.loading}
                    paginationLabel="Paginação de Estudos de Caso"
                    onSelect={(page) => list.visit(byStudent ? { ...values, search: "" } : values, page)}
                />
            </TableListCard>
            {can.delete ? (
                <ConfirmActionModal
                    open={removal.target !== null}
                    title="Excluir Estudo de Caso"
                    message="Deseja remover este Estudo de Caso?"
                    details={removal.target ? <strong>{rowName(removal.target)}</strong> : undefined}
                    processing={removal.processing}
                    confirmLabel="Confirmar exclusão"
                    processingLabel="Excluindo Estudo de Caso..."
                    confirmTone="dark-red"
                    onClose={removal.close}
                    onConfirm={() => {
                        if (!removal.target) return;
                        cancelScheduled();
                        removal.submit("delete", caseStudyUrl(removal.target.id, ""));
                    }}
                />
            ) : null}
        </>
    );
}

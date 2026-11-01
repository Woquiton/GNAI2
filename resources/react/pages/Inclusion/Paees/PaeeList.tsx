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
import type {
    PaeeListFilters,
    PaeeListProps,
    PaeeListRecord,
} from "./Paees.types";
import {
    paeeStatusTone,
    paeeUrl,
    paeeVersionLabel,
    paeesBase,
    statusOptions,
    studentPaeesUrl,
} from "./Paees.utils";
import "./Paees.css";

const emptyFilters: PaeeListFilters = {
    status: "",
    semester_id: "",
    search: "",
};

const allColumns: TableListColumn[] = [
    { id: "student", label: "Aluno", width: "30%", minWidth: 130, fixed: "start" },
    { id: "semester", label: "Semestre", width: "16%", minWidth: 90 },
    { id: "version", label: "Versão", width: "10%", minWidth: 64 },
    { id: "status", label: "Status", width: "14%", minWidth: 80 },
    { id: "next_review", label: "Próxima revisão", width: "16%", minWidth: 100 },
    { id: "actions", label: "Ações", width: "14%", minWidth: 104, fixed: "end" },
];

const studentColumns: TableListColumn[] = [
    { id: "semester", label: "Semestre", width: "26%", minWidth: 110, fixed: "start" },
    { id: "version", label: "Versão", width: "12%", minWidth: 64 },
    { id: "current", label: "Atual", width: "12%", minWidth: 64 },
    { id: "status", label: "Status", width: "16%", minWidth: 80 },
    { id: "next_review", label: "Próxima revisão", width: "18%", minWidth: 100 },
    { id: "actions", label: "Ações", width: "16%", minWidth: 104, fixed: "end" },
];

export function paeeName(paee: PaeeListRecord): string {
    const owner = paee.student?.name;

    return `PAEE ${paeeVersionLabel(paee.version)}${owner ? ` de ${owner}` : ""}`;
}

export default function PaeeList({
    paees,
    student,
    semesters,
    filters: initialFilters,
    can,
}: PaeeListProps): React.JSX.Element {
    const isStudent = student !== null;
    const columns = isStudent ? studentColumns : allColumns;
    const pageErrors = usePage().props.errors as Record<string, string | undefined>;
    const list = useTableListVisit({
        url: isStudent ? studentPaeesUrl(student.id) : paeesBase,
        failureText: "Não foi possível atualizar os PAEEs. Tente novamente.",
    });
    const removal = useTableListAction<PaeeListRecord>({
        failureText: "Não foi possível excluir o PAEE. Tente novamente.",
    });
    const initialValues = useMemo(
        () => ({ ...emptyFilters, ...initialFilters }),
        [initialFilters],
    );
    const { values, update, clear, submit, cancelScheduled } = useAutoListFilters({
        initialValues,
        emptyValues: emptyFilters,
        onSearch: (next) => list.visit(next),
    });

    function describedBy(name: keyof PaeeListFilters, id: string): string | undefined {
        return pageErrors[name] ? `${id}-error` : undefined;
    }

    return (
        <>
            <TableListCard
                aria-label={isStudent ? "PAEEs do aluno" : "Listagem geral de PAEEs"}
                loading={list.loading}
                loadingLabel="Atualizando PAEEs"
            >
                <FormLayout
                    onSubmit={(event) => {
                        event.preventDefault();
                        submit();
                    }}
                >
                    <div
                        className={
                            isStudent
                                ? "paeeList__filters paeeList__filters--student"
                                : "paeeList__filters"
                        }
                    >
                        {!isStudent ? (
                            <FormField
                                id="paee-filter-search"
                                label="Aluno"
                                error={pageErrors.search}
                            >
                                <TextInput
                                    id="paee-filter-search"
                                    name="search"
                                    value={values.search}
                                    placeholder="Nome do aluno..."
                                    invalid={Boolean(pageErrors.search)}
                                    aria-describedby={describedBy("search", "paee-filter-search")}
                                    onChange={(event) => update("search", event.target.value)}
                                />
                            </FormField>
                        ) : null}
                        <FormField
                            id="paee-filter-semester"
                            label="Semestre"
                            error={pageErrors.semester_id}
                        >
                            <SelectField
                                id="paee-filter-semester"
                                name="semester_id"
                                label="Semestre"
                                placeholder="Todos"
                                value={values.semester_id}
                                options={semesters}
                                aria-invalid={Boolean(pageErrors.semester_id)}
                                aria-describedby={describedBy("semester_id", "paee-filter-semester")}
                                onChange={(event) => update("semester_id", event.target.value)}
                            />
                        </FormField>
                        <FormField
                            id="paee-filter-status"
                            label="Status"
                            error={pageErrors.status}
                        >
                            <SelectField
                                id="paee-filter-status"
                                name="status"
                                label="Status"
                                placeholder="Todos"
                                value={values.status}
                                options={statusOptions}
                                aria-invalid={Boolean(pageErrors.status)}
                                aria-describedby={describedBy("status", "paee-filter-status")}
                                onChange={(event) => update("status", event.target.value)}
                            />
                        </FormField>
                        <TableListFilterActions>
                            <TableListClearButton onClick={clear} />
                        </TableListFilterActions>
                    </div>
                </FormLayout>
                <TableListScroll aria-label="Tabela de PAEEs">
                    <TableListTable
                        columns={columns}
                        page={paees}
                    >
                        {paees.data.length ? (
                            paees.data.map((paee) => (
                                <tr key={paee.id}>
                                    {isStudent ? null : (
                                        <td>{paee.student?.name || "Não informado"}</td>
                                    )}
                                    <td>{paee.semester_label || "Não informado"}</td>
                                    <td>{paeeVersionLabel(paee.version)}</td>
                                    {isStudent ? (
                                        <td>
                                            <TableLabel tone={paee.is_current ? "success" : "inverse"}>
                                                {paee.is_current ? "Sim" : "Não"}
                                            </TableLabel>
                                        </td>
                                    ) : null}
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
                                            ) : null}
                                            {can.update ? (
                                                <Button
                                                    href={paeeUrl(paee.id, "edit")}
                                                    size="sm"
                                                    tone="warning"
                                                    iconOnly
                                                    leftIconClass="fa fa-pencil"
                                                    aria-label={`Editar ${paeeName(paee)}`}
                                                />
                                            ) : null}
                                            {can.delete ? (
                                                <Button
                                                    tone="dark-red"
                                                    size="sm"
                                                    iconOnly
                                                    leftIconClass="fa fa-trash-o"
                                                    aria-label={`Excluir ${paeeName(paee)}`}
                                                    disabled={removal.processing}
                                                    onClick={() => {
                                                        cancelScheduled();
                                                        removal.open(paee);
                                                    }}
                                                />
                                            ) : null}
                                            {!can.view && !can.update && !can.delete ? (
                                                <span>Nenhuma ação</span>
                                            ) : null}
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
                <TableListFooter
                    page={paees}
                    disabled={list.loading}
                    paginationLabel="Paginação de PAEEs"
                    onSelect={(page) => list.visit(values, page)}
                />
            </TableListCard>
            {can.delete ? (
                <ConfirmActionModal
                    open={removal.target !== null}
                    title="Excluir PAEE"
                    message="Deseja remover este PAEE? Objetivos, recursos e revisões também serão excluídos."
                    details={removal.target ? <strong>{paeeName(removal.target)}</strong> : undefined}
                    processing={removal.processing}
                    confirmLabel="Confirmar exclusão"
                    processingLabel="Excluindo PAEE..."
                    confirmTone="dark-red"
                    onClose={removal.close}
                    onConfirm={() => {
                        if (!removal.target) return;
                        cancelScheduled();
                        removal.submit("delete", paeeUrl(removal.target.id, ""));
                    }}
                />
            ) : null}
        </>
    );
}

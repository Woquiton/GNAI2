import { useRef } from "react";
import { useForm } from "@inertiajs/react";
import FormActions from "@/components/Forms/FormActions/FormActions";
import FormField from "@/components/Forms/FormField/FormField";
import FormLayout from "@/components/Forms/FormLayout/FormLayout";
import FormSection from "@/components/Forms/FormSection/FormSection";
import SelectField from "@/components/Forms/SelectField/SelectField";
import type { SelectFieldOption } from "@/components/Forms/SelectField/SelectField.types";
import BusinessPage from "@/components/Navigation/BusinessPage/BusinessPage";
import { aeeBase, studentsBase } from "@/components/Students/Students.utils";
import Button from "@/components/UI/Button/Button";
import CardBox from "@/components/UI/CardBox/CardBox";
import InlineAlert from "@/components/UI/InlineAlert/InlineAlert";
import { notify } from "@/components/UI/NotificationToast/notify";
import "./PeiDisciplineBulk.css";

interface BulkDiscipline {
    id: number;
    name: string;
    teachers: SelectFieldOption[];
}

type BulkAssignForm = {
    teacher_ids: Record<string, string>;
};

/**
 * Atribuição em lote: para cada disciplina do curso ainda sem adaptação,
 * escolhe-se o professor responsável. O conteúdo pedagógico de cada adaptação
 * é preenchido depois, individualmente.
 */
export default function InclusionPeisDisciplinesCreatePage({
    pei,
    disciplines,
}: {
    pei: { id: number };
    disciplines: BulkDiscipline[];
}): React.JSX.Element {
    const busy = useRef(false);
    const peiHref = `${aeeBase}/peis/${pei.id}/visualizar?tab=disciplines`;
    const form = useForm<BulkAssignForm>({ teacher_ids: {} });

    function submit(event: React.FormEvent<HTMLFormElement>): void {
        event.preventDefault();
        if (busy.current || form.processing) return;

        busy.current = true;
        form.post(`${aeeBase}/peis/${pei.id}/disciplinas/salvar`, {
            preserveScroll: true,
            onNetworkError: () => {
                notify({
                    tone: "error",
                    title: "Falha de conexão",
                    text: "Não foi possível conectar ao servidor. Confira sua conexão e tente novamente.",
                });
                return false;
            },
            onHttpException: () => {
                notify({
                    tone: "error",
                    title: "Não foi possível concluir",
                    text: "Não foi possível salvar as adaptações curriculares. Tente novamente.",
                });
                return false;
            },
            onFinish: () => {
                busy.current = false;
            },
        });
    }

    return (
        <BusinessPage
            title="Cadastrar Adaptação Curricular"
            subtitle="Para cada disciplina do curso, escolha o professor responsável. As adaptações são criadas de uma vez; o conteúdo pedagógico (objetivos, metodologias etc.) de cada uma é preenchido em seguida, individualmente."
            breadcrumbItems={[
                { label: "Home", href: "/autenticacao/painel" },
                { label: "Alunos", href: studentsBase },
                { label: "PEI", href: peiHref },
                { label: "Cadastrar Adaptação" },
            ]}
            className="peiDisciplineFormPage"
        >
            <FormLayout
                aria-label="Cadastrar adaptações curriculares"
                aria-busy={form.processing}
                onSubmit={submit}
            >
                <CardBox>
                    <fieldset disabled={form.processing}>
                        <FormSection
                            id="pei-discipline-identification"
                            title="Identificação da Disciplina"
                            variant="inline"
                            iconClass="fa fa-graduation-cap"
                        >
                            {disciplines.length === 0 ? (
                                <InlineAlert variant="info">
                                    Todas as disciplinas do curso já possuem uma adaptação cadastrada neste PEI.
                                </InlineAlert>
                            ) : (
                                <ul className="peiDisciplineBulk">
                                    {disciplines.map((discipline) => {
                                        const id = `pei-discipline-teacher-${discipline.id}`;

                                        return (
                                            <li key={discipline.id} className="peiDisciplineBulk__row">
                                                <FormField
                                                    id={id}
                                                    label={discipline.name}
                                                    layout="horizontal"
                                                >
                                                    {discipline.teachers.length === 0 ? (
                                                        <p id={id} className="peiDisciplineBulk__empty">
                                                            <i className="fa fa-exclamation-triangle" aria-hidden="true" />
                                                            {" "}Nenhum professor vinculado a esta disciplina na matriz curricular.
                                                        </p>
                                                    ) : (
                                                        <SelectField
                                                            id={id}
                                                            name={`teacher_ids[${discipline.id}]`}
                                                            label={discipline.name}
                                                            placeholder="Selecione o professor..."
                                                            value={form.data.teacher_ids[discipline.id] ?? ""}
                                                            options={discipline.teachers}
                                                            disabled={form.processing}
                                                            onChange={(event) => form.setData("teacher_ids", {
                                                                ...form.data.teacher_ids,
                                                                [discipline.id]: event.target.value,
                                                            })}
                                                        />
                                                    )}
                                                </FormField>
                                            </li>
                                        );
                                    })}
                                </ul>
                            )}
                        </FormSection>
                    </fieldset>
                </CardBox>
                <FormActions status={form.processing ? "Salvando adaptações…" : undefined}>
                    <Button
                        href={peiHref}
                        tone="cancel"
                        label="Cancelar"
                        aria-label="Cancelar e voltar ao PEI"
                        disabled={form.processing}
                    />
                    {disciplines.length > 0 ? (
                        <Button
                            type="submit"
                            tone="save"
                            label="Salvar"
                            title="Salvar adaptações"
                            aria-label="Salvar adaptações"
                            disabled={form.processing}
                        />
                    ) : null}
                </FormActions>
            </FormLayout>
        </BusinessPage>
    );
}

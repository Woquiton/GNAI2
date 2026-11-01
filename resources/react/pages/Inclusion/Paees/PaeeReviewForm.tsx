import { useRef, useState } from "react";
import { useForm } from "@inertiajs/react";
import FormField from "@/components/Forms/FormField/FormField";
import FormGrid from "@/components/Forms/FormGrid/FormGrid";
import FormLayout from "@/components/Forms/FormLayout/FormLayout";
import SummernoteEditor from "@/components/Forms/SummernoteEditor/SummernoteEditor";
import Button from "@/components/UI/Button/Button";
import { notify } from "@/components/UI/NotificationToast/notify";
import { paeeUrl } from "./Paees.utils";

type ReviewFields = "what_changed" | "why";

const fields: Array<{ name: ReviewFields; label: string; placeholder: string }> = [
    {
        name: "what_changed",
        label: "O que mudou",
        placeholder: "Ex.: Frequência de atendimento aumentada para 2x por semana.",
    },
    {
        name: "why",
        label: "Por quê",
        placeholder: "Ex.: Avaliação da equipe indicou necessidade de mais suporte no período.",
    },
];

/** Registro manual de revisão do PAEE (o "O que mudou / Por quê" do Blade). */
export default function PaeeReviewForm({
    paeeId,
}: {
    paeeId: number;
}): React.JSX.Element {
    const busy = useRef(false);
    const [editorFailed, setEditorFailed] = useState(false);
    const [editorVersion, setEditorVersion] = useState(0);
    const form = useForm<Record<ReviewFields, string>>({
        what_changed: "",
        why: "",
    });

    function submit(event: React.FormEvent<HTMLFormElement>): void {
        event.preventDefault();
        if (busy.current || form.processing || editorFailed) return;

        busy.current = true;
        form.post(paeeUrl(paeeId, "revisoes"), {
            preserveScroll: true,
            onSuccess: () => {
                form.reset();
                setEditorVersion((version) => version + 1);
            },
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
                    text: "Não foi possível registrar a revisão. Tente novamente.",
                });
                return false;
            },
            onFinish: () => {
                busy.current = false;
            },
        });
    }

    return (
        <FormLayout
            className="paeeShow__reviewForm"
            aria-label="Registrar revisão do PAEE"
            aria-busy={form.processing}
            onSubmit={submit}
        >
            <fieldset disabled={form.processing}>
                <FormGrid columns={2}>
                    {fields.map((field) => {
                        const id = `paee-review-${field.name.replace(/_/g, "-")}`;

                        return (
                            <FormField
                                key={field.name}
                                id={`${id}-input`}
                                label={field.label}
                                hint={field.placeholder}
                                hintLabel={`Exemplo para ${field.label.toLowerCase()}`}
                                requiredIndicator
                                error={form.errors[field.name]}
                            >
                                <SummernoteEditor
                                    key={`${field.name}-${editorVersion}`}
                                    id={id}
                                    label={field.label}
                                    height={120}
                                    defaultValue={form.data[field.name]}
                                    disabled={form.processing}
                                    invalid={Boolean(form.errors[field.name])}
                                    describedBy={form.errors[field.name] ? `${id}-input-error` : undefined}
                                    onChange={(html) => form.setData(field.name, html)}
                                    onLoadError={() => {
                                        setEditorFailed(true);
                                        form.setError(field.name, "Não foi possível carregar o editor. Atualize a página e tente novamente.");
                                    }}
                                />
                            </FormField>
                        );
                    })}
                </FormGrid>
                <div className="paeeShow__reviewActions">
                    <Button
                        type="submit"
                        tone="save"
                        leftIconClass="fa fa-plus"
                        label={form.processing ? "Registrando..." : "Registrar"}
                        title="Registrar revisão do PAEE"
                        aria-label="Registrar revisão do PAEE"
                        disabled={form.processing || editorFailed}
                    />
                </div>
            </fieldset>
        </FormLayout>
    );
}

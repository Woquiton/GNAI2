import { useRef } from "react";
import { useForm } from "@inertiajs/react";
import FormField from "@/components/Forms/FormField/FormField";
import FormGrid from "@/components/Forms/FormGrid/FormGrid";
import FormLayout from "@/components/Forms/FormLayout/FormLayout";
import TextArea from "@/components/Forms/TextArea/TextArea";
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
    const form = useForm<Record<ReviewFields, string>>({
        what_changed: "",
        why: "",
    });

    function submit(event: React.FormEvent<HTMLFormElement>): void {
        event.preventDefault();
        if (busy.current || form.processing) return;

        busy.current = true;
        form.post(paeeUrl(paeeId, "reviews"), {
            preserveScroll: true,
            onSuccess: () => form.reset(),
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
                                id={id}
                                label={field.label}
                                requiredIndicator
                                error={form.errors[field.name]}
                            >
                                <TextArea
                                    id={id}
                                    name={field.name}
                                    rows={2}
                                    required
                                    placeholder={field.placeholder}
                                    value={form.data[field.name]}
                                    aria-invalid={Boolean(form.errors[field.name]) || undefined}
                                    aria-describedby={form.errors[field.name] ? `${id}-error` : undefined}
                                    onChange={(event) => form.setData(field.name, event.target.value)}
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
                        disabled={form.processing}
                    />
                </div>
            </fieldset>
        </FormLayout>
    );
}

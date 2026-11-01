import { useRef } from "react";
import { useForm } from "@inertiajs/react";
import FormField from "@/components/Forms/FormField/FormField";
import FormLayout from "@/components/Forms/FormLayout/FormLayout";
import FormSection from "@/components/Forms/FormSection/FormSection";
import TextArea from "@/components/Forms/TextArea/TextArea";
import Button from "@/components/UI/Button/Button";
import { notify } from "@/components/UI/NotificationToast/notify";

/** Outras informações relevantes do PEI (Apêndice 4, item 16). */
export default function PeiOtherInfo({
    action,
    value,
    canUpdate,
}: {
    action: string;
    value: string | null;
    canUpdate: boolean;
}): React.JSX.Element {
    const busy = useRef(false);
    const form = useForm({ other_relevant_info: value ?? "" });

    function submit(event: React.FormEvent<HTMLFormElement>): void {
        event.preventDefault();
        if (busy.current || form.processing) return;

        busy.current = true;
        form.patch(action, {
            preserveScroll: true,
            onNetworkError: () => {
                notify({
                    tone: "error",
                    title: "Falha de conexão",
                    text: "Não foi possível conectar ao servidor. Confira sua conexão e tente novamente.",
                });
                return false;
            },
            onFinish: () => {
                busy.current = false;
            },
        });
    }

    return (
        <FormSection
            id="pei-other-info"
            title="Outras Informações Relevantes"
            iconClass="fa fa-info-circle"
            variant="inline"
        >
            {canUpdate ? (
                <FormLayout
                    aria-label="Outras informações relevantes do PEI"
                    aria-busy={form.processing}
                    onSubmit={submit}
                >
                    <FormField
                        id="pei-other-relevant-info"
                        label="Outras informações relevantes"
                        error={form.errors.other_relevant_info}
                    >
                        <TextArea
                            id="pei-other-relevant-info"
                            name="other_relevant_info"
                            rows={3}
                            value={form.data.other_relevant_info}
                            aria-invalid={!!form.errors.other_relevant_info || undefined}
                            aria-describedby={form.errors.other_relevant_info ? "pei-other-relevant-info-error" : undefined}
                            disabled={form.processing}
                            onChange={(event) => form.setData("other_relevant_info", event.target.value)}
                        />
                    </FormField>
                    <div className="peiShow__inlineFormActions">
                        <Button
                            type="submit"
                            tone="save"
                            label={form.processing ? "Salvando..." : "Salvar"}
                            title="Salvar outras informações relevantes"
                            aria-label="Salvar outras informações relevantes"
                            disabled={form.processing}
                        />
                    </div>
                </FormLayout>
            ) : (
                <p className="peiShow__empty">{value || "Nenhuma informação adicional registrada."}</p>
            )}
        </FormSection>
    );
}

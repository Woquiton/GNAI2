import { useRef } from "react";
import { useForm } from "@inertiajs/react";
import FormField from "@/components/Forms/FormField/FormField";
import FormLayout from "@/components/Forms/FormLayout/FormLayout";
import TextArea from "@/components/Forms/TextArea/TextArea";
import TextInput from "@/components/Forms/TextInput/TextInput";
import Button from "@/components/UI/Button/Button";
import { caseStudyUrl, requestFailureHandlers } from "./caseStudies.utils";

/** Registro de uma contribuição (papel e conteúdo) no Estudo de Caso. */
export default function CaseStudyContributionForm({
    caseStudyId,
}: {
    caseStudyId: number;
}): React.JSX.Element {
    const busy = useRef(false);
    const form = useForm({ role: "", content: "" });

    function submit(event: React.FormEvent<HTMLFormElement>): void {
        event.preventDefault();
        if (busy.current || form.processing) return;

        busy.current = true;
        form.post(caseStudyUrl(caseStudyId, "contribuicoes"), {
            preserveScroll: true,
            preserveState: true,
            ...requestFailureHandlers("Não foi possível registrar a contribuição. Tente novamente."),
            onSuccess: () => form.reset(),
            onFinish: () => {
                busy.current = false;
            },
        });
    }

    return (
        <FormLayout
            className="caseStudyShow__contributionForm"
            aria-label="Adicionar contribuição"
            aria-busy={form.processing}
            onSubmit={submit}
        >
            <fieldset disabled={form.processing}>
                <FormField
                    id="case-study-contribution-role"
                    label="Papel"
                    requiredIndicator
                    error={form.errors.role}
                >
                    <TextInput
                        id="case-study-contribution-role"
                        name="role"
                        required
                        maxLength={100}
                        placeholder="Ex: professor, família"
                        value={form.data.role}
                        invalid={!!form.errors.role}
                        aria-describedby={form.errors.role ? "case-study-contribution-role-error" : undefined}
                        onChange={(event) => form.setData("role", event.target.value)}
                    />
                </FormField>
                <FormField
                    id="case-study-contribution-content"
                    label="Contribuição"
                    requiredIndicator
                    error={form.errors.content}
                >
                    <TextArea
                        id="case-study-contribution-content"
                        name="content"
                        rows={2}
                        required
                        value={form.data.content}
                        aria-invalid={!!form.errors.content || undefined}
                        aria-describedby={form.errors.content ? "case-study-contribution-content-error" : undefined}
                        onChange={(event) => form.setData("content", event.target.value)}
                    />
                </FormField>
                <div className="caseStudyShow__contributionSubmit">
                    <Button
                        type="submit"
                        tone="save"
                        leftIconClass="fa fa-plus"
                        label={form.processing ? "Adicionando..." : "Adicionar"}
                        title="Adicionar contribuição"
                        aria-label="Adicionar contribuição"
                        disabled={form.processing}
                    />
                </div>
            </fieldset>
        </FormLayout>
    );
}

import { useForm } from '@inertiajs/react';
import { TextAreaField, TextInputField } from '@/components/Forms/FormFields/FormFields';
import FormLayout from '@/components/Forms/FormLayout/FormLayout';
import { useFormSubmission } from '@/components/Forms/FormLayout/useFormSubmission';
import Button from '@/components/UI/Button/Button';
import '@styles/components/Forms/RemovableField/RemovableField.css';
import { caseStudyFailureTexts } from '../CaseStudies.constants';
import { caseStudyUrls } from '../CaseStudies.routes';
import '@styles/components/CaseStudies/Details/CaseStudyContributionForm.css';

interface CaseStudyContributionFormProps {
    caseStudyId: number;
}

/** Registro de uma contribuição (papel e conteúdo) no Estudo de Caso. */
export default function CaseStudyContributionForm({
    caseStudyId,
}: CaseStudyContributionFormProps): React.JSX.Element {
    const form = useForm({ role: '', content: '' });
    const submission = useFormSubmission(form);
    const submitLabel = form.processing ? 'Adicionando...' : 'Adicionar';

    function submit(event: React.FormEvent<HTMLFormElement>): void {
        event.preventDefault();
        submission.submit({
            url: caseStudyUrls.contributions(caseStudyId),
            options: { preserveState: true, onSuccess: () => form.reset() },
            failureText: caseStudyFailureTexts.contribution,
        });
    }

    return (
        <FormLayout
            ref={submission.formRef}
            className="caseStudyContributionForm"
            aria-label="Adicionar contribuição"
            aria-busy={form.processing}
            onSubmit={submit}
        >
            <fieldset disabled={form.processing}>
                <TextInputField
                    id="case-study-contribution-role"
                    name="role"
                    label="Papel"
                    required
                    maxLength={100}
                    placeholder="Ex: professor, família"
                    value={form.data.role}
                    error={form.errors.role}
                    onChange={(value) => form.setData('role', value)}
                />
                <TextAreaField
                    id="case-study-contribution-content"
                    name="content"
                    label="Contribuição"
                    required
                    rows={2}
                    value={form.data.content}
                    error={form.errors.content}
                    onChange={(value) => form.setData('content', value)}
                />
                <div className="caseStudyContributionForm__submit">
                    <Button
                        type="submit"
                        tone="white"
                        className="removableField__add"
                        labelIconClass={form.processing ? 'fa fa-spinner fa-spin' : 'fa fa-plus'}
                        label={submitLabel}
                        title="Adicionar contribuição"
                        aria-label="Adicionar contribuição"
                        disabled={form.processing}
                    />
                </div>
            </fieldset>
        </FormLayout>
    );
}

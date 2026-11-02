import { useForm } from '@inertiajs/react';
import { useState } from 'react';
import { RichTextField } from '@/components/Forms/FormFields/FormFields';
import FormGrid from '@/components/Forms/FormGrid/FormGrid';
import FormLayout from '@/components/Forms/FormLayout/FormLayout';
import { useFormSubmission } from '@/components/Forms/FormLayout/useFormSubmission';
import Button from '@/components/UI/Button/Button';
import { paeeFailureTexts } from '../Paees.constants';
import { paeeUrls } from '../Paees.routes';
import './PaeeReviewForm.css';

type ReviewFields = 'what_changed' | 'why';

const fields: Array<{ name: ReviewFields; label: string; placeholder: string }> = [
    {
        name: 'what_changed',
        label: 'O que mudou',
        placeholder: 'Ex.: Frequência de atendimento aumentada para 2x por semana.',
    },
    {
        name: 'why',
        label: 'Por quê',
        placeholder: 'Ex.: Avaliação da equipe indicou necessidade de mais suporte no período.',
    },
];

interface PaeeReviewFormProps {
    paeeId: number;
}

/** Registro manual de revisão do PAEE (o "O que mudou / Por quê" do Blade). */
export default function PaeeReviewForm({ paeeId }: PaeeReviewFormProps): React.JSX.Element {
    const [editorFailed, setEditorFailed] = useState(false);
    const [editorVersion, setEditorVersion] = useState(0);
    const form = useForm<Record<ReviewFields, string>>({
        what_changed: '',
        why: '',
    });
    const submission = useFormSubmission(form);
    const submitLabel = form.processing ? 'Registrando...' : 'Registrar';

    function reportEditorFailure(name: ReviewFields): void {
        setEditorFailed(true);
        form.setError(name, paeeFailureTexts.editor);
    }

    function submit(event: React.FormEvent<HTMLFormElement>): void {
        event.preventDefault();
        submission.submit({
            url: paeeUrls.reviews(paeeId),
            blocked: editorFailed,
            options: {
                onSuccess: () => {
                    form.reset();
                    setEditorVersion((version) => version + 1);
                },
            },
            failureText: paeeFailureTexts.review,
        });
    }

    return (
        <FormLayout
            ref={submission.formRef}
            className="paeeReviewForm"
            aria-label="Registrar revisão do PAEE"
            aria-busy={form.processing}
            onSubmit={submit}
        >
            <fieldset disabled={form.processing}>
                <FormGrid columns={2}>
                    {fields.map((field) => (
                        <RichTextField
                            key={`${field.name}-${editorVersion}`}
                            id={`paee-review-${field.name.replace(/_/g, '-')}`}
                            label={field.label}
                            hint={field.placeholder}
                            hintLabel={`Exemplo para ${field.label.toLowerCase()}`}
                            required
                            error={form.errors[field.name]}
                            height={120}
                            defaultValue={form.data[field.name]}
                            disabled={form.processing}
                            onChange={(html) => form.setData(field.name, html)}
                            onLoadError={() => reportEditorFailure(field.name)}
                        />
                    ))}
                </FormGrid>
                <div className="paeeReviewForm__actions">
                    <Button
                        type="submit"
                        tone="save"
                        leftIconClass="fa fa-plus"
                        label={submitLabel}
                        title="Registrar revisão do PAEE"
                        aria-label="Registrar revisão do PAEE"
                        disabled={form.processing || editorFailed}
                    />
                </div>
            </fieldset>
        </FormLayout>
    );
}

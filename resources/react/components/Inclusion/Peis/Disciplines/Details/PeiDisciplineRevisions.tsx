import { useForm } from '@inertiajs/react';
import { TextAreaField } from '@/components/Forms/FormFields/FormFields';
import FormGrid from '@/components/Forms/FormGrid/FormGrid';
import FormLayout from '@/components/Forms/FormLayout/FormLayout';
import { useFormSubmission } from '@/components/Forms/FormLayout/useFormSubmission';
import FormSection from '@/components/Forms/FormSection/FormSection';
import Button from '@/components/UI/Button/Button';
import PeiSectionActions from '../../Details/PeiSectionActions';
import PeiTimeline from '../../Details/PeiTimeline';
import { PEI_DISCIPLINE_REVISION_FAILURE_TEXT } from '../../Peis.constants';
import type { PeiDisciplineRevision } from '../../Peis.types';

interface PeiDisciplineRevisionsProps {
    /** Rota `pei-discipline.revisions.store` (POST). */
    action: string;
    revisions: PeiDisciplineRevision[];
    canAdd: boolean;
}

function RevisionEntry({ revision }: { revision: PeiDisciplineRevision }): React.JSX.Element {
    return (
        <>
            <strong>{revision.reviewed_at ?? 'Sem data'}</strong>
            {revision.reviewer_name ? `, ${revision.reviewer_name}` : null}
            <p>{revision.what_changed}</p>
            <small>{revision.why}</small>
        </>
    );
}

function RevisionForm({ action }: { action: string }): React.JSX.Element {
    const form = useForm({ what_changed: '', why: '' });
    const submission = useFormSubmission(form);
    const submitLabel = form.processing ? 'Registrando...' : 'Registrar';

    function submit(event: React.FormEvent<HTMLFormElement>): void {
        event.preventDefault();
        submission.submit({
            url: action,
            failureText: PEI_DISCIPLINE_REVISION_FAILURE_TEXT,
            options: { onSuccess: () => form.reset() },
        });
    }

    return (
        <FormLayout
            ref={submission.formRef}
            aria-label="Registrar revisão da adaptação"
            aria-busy={form.processing}
            onSubmit={submit}
        >
            <FormGrid columns={2}>
                <TextAreaField
                    id="revision-what-changed"
                    name="what_changed"
                    label="O que mudou"
                    required
                    rows={2}
                    placeholder="Ex.: Metodologia alterada para incluir apoio visual nas atividades."
                    value={form.data.what_changed}
                    error={form.errors.what_changed}
                    disabled={form.processing}
                    onChange={(next) => form.setData('what_changed', next)}
                />
                <TextAreaField
                    id="revision-why"
                    name="why"
                    label="Por quê"
                    required
                    rows={2}
                    placeholder="Ex.: Professor observou melhor engajamento do aluno com recursos visuais."
                    value={form.data.why}
                    error={form.errors.why}
                    disabled={form.processing}
                    onChange={(next) => form.setData('why', next)}
                />
            </FormGrid>
            <PeiSectionActions>
                <Button
                    type="submit"
                    tone="save"
                    leftIconClass="fa fa-plus"
                    label={submitLabel}
                    title="Registrar revisão"
                    aria-label="Registrar revisão"
                    disabled={form.processing}
                />
            </PeiSectionActions>
        </FormLayout>
    );
}

/** Histórico de revisões da adaptação e, quando permitido, o registro de uma nova revisão. */
export default function PeiDisciplineRevisions({
    action,
    revisions,
    canAdd,
}: PeiDisciplineRevisionsProps): React.JSX.Element {
    return (
        <FormSection
            id="pei-discipline-revisions"
            title="Revisões desta Adaptação"
            iconClass="fa fa-history"
            variant="inline"
        >
            <PeiTimeline
                items={revisions}
                itemKey={(revision) => revision.id}
                renderItem={(revision) => <RevisionEntry revision={revision} />}
                emptyMessage="Nenhuma revisão registrada para esta disciplina."
            />
            {canAdd ? <RevisionForm action={action} /> : null}
        </FormSection>
    );
}

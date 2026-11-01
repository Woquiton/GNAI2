import FormActions from '@/components/Forms/FormActions/FormActions';
import FormLayout from '@/components/Forms/FormLayout/FormLayout';
import Button from '@/components/UI/Button/Button';
import CardBox from '@/components/UI/CardBox/CardBox';
import { paeeUrls } from '../Paees.routes';
import PaeeArticulationFields from './PaeeArticulationFields';
import PaeeAssistiveTechnologyFields from './PaeeAssistiveTechnologyFields';
import PaeeAttendanceFields from './PaeeAttendanceFields';
import type { PaeeFormProps } from './PaeeForm.types';
import PaeeObjectiveFields from './PaeeObjectiveFields';
import PaeeResourceFields from './PaeeResourceFields';
import PaeeSupportFields from './PaeeSupportFields';
import { usePaeeForm } from './usePaeeForm';
import './PaeeForm.css';

/** Cadastro a partir do Estudo de Caso e edição do PAEE, com objetivos e recursos repetíveis. */
export default function PaeeForm(props: PaeeFormProps): React.JSX.Element {
    const { form, errors, formRef, editorFailed, richText, toggle, save } = usePaeeForm(props);
    const editing = props.mode === 'edit';
    const sectionProps = { form, errors, disabled: form.processing, richText, toggle };
    const cancelHref =
        props.mode === 'edit'
            ? paeeUrls.show(props.paee.id)
            : paeeUrls.caseStudy(props.caseStudyId);
    const cancelLabel = editing
        ? 'Cancelar e voltar ao PAEE'
        : 'Cancelar e voltar ao Estudo de Caso';
    const savingStatus = editing ? 'Salvando alterações…' : 'Salvando PAEE…';
    const submitLabel = editing ? 'Atualizar PAEE' : 'Salvar PAEE';

    return (
        <FormLayout
            ref={formRef}
            aria-label={editing ? 'Editar PAEE' : 'Cadastrar PAEE'}
            aria-busy={form.processing}
            onSubmit={(event) => {
                event.preventDefault();
                save();
            }}
        >
            <CardBox>
                <fieldset disabled={form.processing}>
                    <PaeeAttendanceFields {...sectionProps} />
                    <PaeeAssistiveTechnologyFields {...sectionProps} />
                    <PaeeSupportFields {...sectionProps} />
                    <PaeeObjectiveFields {...sectionProps} />
                    <PaeeResourceFields {...sectionProps} />
                    <PaeeArticulationFields {...sectionProps} />
                </fieldset>
            </CardBox>
            <FormActions status={form.processing ? savingStatus : undefined}>
                <Button
                    href={cancelHref}
                    tone="cancel"
                    label="Cancelar"
                    aria-label={cancelLabel}
                    disabled={form.processing}
                />
                <Button
                    type="submit"
                    tone="save"
                    label="Salvar"
                    title={submitLabel}
                    aria-label={submitLabel}
                    disabled={form.processing || editorFailed}
                />
            </FormActions>
        </FormLayout>
    );
}

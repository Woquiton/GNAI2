import FormActions from '@/components/Forms/FormActions/FormActions';
import FormLayout from '@/components/Forms/FormLayout/FormLayout';
import Button from '@/components/UI/Button/Button';
import CardBox from '@/components/UI/CardBox/CardBox';
import { caseStudyUrls } from '../CaseStudies.routes';
import type { CaseStudyFormProps } from '../CaseStudies.types';
import CaseStudyAcceptanceFields from './CaseStudyAcceptanceFields';
import CaseStudyBarrierFields from './CaseStudyBarrierFields';
import CaseStudyDemandFields from './CaseStudyDemandFields';
import CaseStudyListeningFields from './CaseStudyListeningFields';
import CaseStudyStrategyFields from './CaseStudyStrategyFields';
import CaseStudySupportFields from './CaseStudySupportFields';
import { useCaseStudyForm } from './useCaseStudyForm';

function submissionStatus(processing: boolean, editing: boolean): string | undefined {
    if (!processing) {
        return undefined;
    }

    return editing ? 'Salvando alterações…' : 'Salvando Estudo de Caso…';
}

/** Formulário único de cadastro e edição do Estudo de Caso. */
export default function CaseStudyForm({
    student,
    caseStudy,
    options,
}: CaseStudyFormProps): React.JSX.Element {
    const editing = caseStudy !== null;
    const { form, errors, formRef, editorFailed, reportEditorFailure, save } = useCaseStudyForm({
        student,
        caseStudy,
    });
    const sectionProps = { form, errors, disabled: form.processing };
    const richTextProps = { ...sectionProps, onEditorFailure: reportEditorFailure };
    const cancelHref = caseStudy
        ? caseStudyUrls.show(caseStudy.id)
        : caseStudyUrls.studentRecord(student.id);
    const cancelLabel = editing
        ? 'Cancelar e voltar ao Estudo de Caso'
        : 'Cancelar e voltar ao prontuário do aluno';
    const submitLabel = editing ? 'Atualizar Estudo de Caso' : 'Salvar Estudo de Caso';

    return (
        <FormLayout
            ref={formRef}
            aria-label={editing ? 'Editar Estudo de Caso' : 'Cadastrar Estudo de Caso'}
            aria-busy={form.processing}
            onSubmit={(event) => {
                event.preventDefault();
                save();
            }}
        >
            <CardBox>
                <fieldset disabled={form.processing}>
                    <CaseStudyDemandFields
                        {...richTextProps}
                        demandOrigins={options.demandOrigins}
                    />
                    <CaseStudyListeningFields {...richTextProps} />
                    <CaseStudySupportFields
                        {...richTextProps}
                        neededSupports={options.neededSupports}
                    />
                    <CaseStudyBarrierFields {...sectionProps} barrierTypes={options.barrierTypes} />
                    <CaseStudyStrategyFields {...sectionProps} />
                    <CaseStudyAcceptanceFields
                        {...sectionProps}
                        acceptanceStatuses={options.acceptanceStatuses}
                    />
                </fieldset>
            </CardBox>
            <FormActions status={submissionStatus(form.processing, editing)}>
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

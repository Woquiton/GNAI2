import { useForm } from '@inertiajs/react';
import { RichTextField } from '@/components/Forms/FormFields/FormFields';
import FormGrid, { FormGridWide } from '@/components/Forms/FormGrid/FormGrid';
import FormLayout from '@/components/Forms/FormLayout/FormLayout';
import { useEditorFailure } from '@/components/Forms/FormLayout/useEditorFailure';
import { useFormSubmission } from '@/components/Forms/FormLayout/useFormSubmission';
import FormSection from '@/components/Forms/FormSection/FormSection';
import CardBox from '@/components/UI/CardBox/CardBox';
import InlineAlert from '@/components/UI/InlineAlert/InlineAlert';
import LoanDetails from '../Details/LoanDetails';
import { loanUrls } from '../Loans.routes';
import type { LoanRecord } from '../Loans.types';
import LoanFormActions from './LoanFormActions';
import type { LoanEditFormData } from './LoanForm.types';

interface LoanEditFormProps {
    loan: LoanRecord;
    canSubmit: boolean;
}

/** Edição do empréstimo: os dados do registro ficam em leitura e só as observações mudam. */
export default function LoanEditForm({ loan, canSubmit }: LoanEditFormProps): React.JSX.Element {
    const form = useForm<LoanEditFormData>({ observation: loan.observation ?? '' });
    const { formRef, submit } = useFormSubmission(form);
    const { editorFailed, reportEditorFailure } = useEditorFailure(form);

    function save(): void {
        submit({
            url: loanUrls.update(loan.id),
            method: 'put',
            failureText: 'Não foi possível concluir a operação. Tente novamente.',
            blocked: !canSubmit || editorFailed,
        });
    }

    return (
        <>
            {loan.is_returned ? (
                <InlineAlert variant="info">
                    <strong>Este empréstimo já foi finalizado.</strong> Apenas as observações podem
                    ser atualizadas.
                </InlineAlert>
            ) : null}
            {loan.is_overdue ? (
                <InlineAlert variant="warning">
                    <strong>Este item está com a devolução atrasada.</strong> O prazo encerrou em{' '}
                    {loan.due_date_label}.
                </InlineAlert>
            ) : null}
            <FormLayout
                ref={formRef}
                aria-label="Editar registro de empréstimo"
                aria-busy={form.processing}
                onSubmit={(event) => {
                    event.preventDefault();
                    save();
                }}
            >
                <CardBox>
                    <FormSection
                        id="loan-identification"
                        title="Identificação"
                        variant="inline"
                        iconClass="fa fa-exchange"
                    >
                        <FormGrid>
                            <FormGridWide>
                                <LoanDetails loan={loan} showObservation={false} />
                            </FormGridWide>
                            <FormGridWide>
                                <RichTextField
                                    id="loan-observation"
                                    label="Observações / Estado do Item"
                                    defaultValue={form.data.observation}
                                    height={120}
                                    disabled={form.processing}
                                    error={form.errors.observation}
                                    onLoadError={() =>
                                        reportEditorFailure('observation', 'observações')
                                    }
                                    onChange={(html) => form.setData('observation', html)}
                                />
                            </FormGridWide>
                        </FormGrid>
                    </FormSection>
                </CardBox>
                <LoanFormActions
                    cancelHref={loanUrls.show(loan.id)}
                    submitLabel="Salvar observações"
                    canSubmit={canSubmit}
                    processing={form.processing}
                    blocked={editorFailed}
                />
            </FormLayout>
        </>
    );
}

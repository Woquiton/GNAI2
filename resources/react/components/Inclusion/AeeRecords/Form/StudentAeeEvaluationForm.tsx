import { useForm } from '@inertiajs/react';
import FormActions from '@/components/Forms/FormActions/FormActions';
import FormLayout from '@/components/Forms/FormLayout/FormLayout';
import { useFormSubmission } from '@/components/Forms/FormLayout/useFormSubmission';
import FormSection from '@/components/Forms/FormSection/FormSection';
import Button from '@/components/UI/Button/Button';
import CardBox from '@/components/UI/CardBox/CardBox';
import DetailField from '@/components/UI/DetailField/DetailField';
import DetailGrid from '@/components/UI/DetailGrid/DetailGrid';
import { dateLabel } from '@/utils/formatters';
import { AEE_EVALUATION_SAVE_FAILURE_TEXT, aeeTextValue } from '../AeeRecords.constants';
import { aeeRecordUrls, studentAeeRecordUrls } from '../AeeRecords.routes';
import type { StudentAeeRecordEditProps } from '../AeeRecords.types';
import AeeEvaluationFields from './AeeEvaluationFields';
import { evaluationFromRecord, evaluationPayload } from './aeeEvaluationData';
import type { AeeEvaluationTextField, AeeStudentEvaluationFormData } from './AeeRecordForm.types';

/** Edição da avaliação de um aluno aberta pelo prontuário, com o contexto do atendimento. */
export default function StudentAeeEvaluationForm({
    student,
    evaluation,
    guardians,
}: StudentAeeRecordEditProps): React.JSX.Element {
    const aeeRecord = evaluation.aee_record;
    const session = aeeRecord.attendance_session;
    const urls = studentAeeRecordUrls(student.id);
    const form = useForm<AeeStudentEvaluationFormData>({
        evaluation_id: evaluation.id,
        ...evaluationFromRecord(evaluation),
    });
    const submission = useFormSubmission(form);
    const errors = form.errors as Record<string, string | undefined>;
    const submitLabel = form.processing
        ? 'Salvando avaliação do aluno'
        : 'Salvar avaliação do aluno';

    function submit(event: React.FormEvent<HTMLFormElement>): void {
        event.preventDefault();
        submission.submit({
            url: urls.update(evaluation.id),
            method: 'put',
            failureText: AEE_EVALUATION_SAVE_FAILURE_TEXT,
            transform: () => evaluationPayload(form.data),
        });
    }

    return (
        <FormLayout
            ref={submission.formRef}
            aria-label="Editar avaliação do aluno"
            aria-busy={form.processing}
            onSubmit={submit}
        >
            <CardBox>
                <FormSection
                    id="student-aee-session"
                    title="Informações do atendimento AEE"
                    variant="inline"
                    iconClass="fa fa-calendar"
                >
                    <DetailGrid columns={3}>
                        <DetailField label="Data">{dateLabel(session?.session_date)}</DetailField>
                        <DetailField label="Duração">{aeeRecord.duration}</DetailField>
                        <DetailField label="Profissional">
                            {session?.professional?.person?.name ?? 'Não informado'}
                        </DetailField>
                    </DetailGrid>
                    <DetailGrid>
                        <DetailField label="Objetivo do Atendimento" wide preserveLineBreaks>
                            {aeeTextValue(session?.session_objective)}
                        </DetailField>
                        <DetailField label="Atividades Realizadas" wide preserveLineBreaks>
                            {aeeTextValue(aeeRecord.activities_performed)}
                        </DetailField>
                        <DetailField label="Estratégias Utilizadas" preserveLineBreaks>
                            {aeeTextValue(aeeRecord.strategies_used)}
                        </DetailField>
                        <DetailField label="Recursos Utilizados" preserveLineBreaks>
                            {aeeTextValue(aeeRecord.resources_used)}
                        </DetailField>
                        <DetailField label="Observações Gerais" wide preserveLineBreaks>
                            {aeeTextValue(aeeRecord.general_observations)}
                        </DetailField>
                    </DetailGrid>
                </FormSection>
                <FormSection
                    id="student-aee-evaluation"
                    title="Editar Avaliação Individual"
                    variant="inline"
                    iconClass="fa fa-user"
                >
                    <AeeEvaluationFields
                        idPrefix="student-aee-evaluation"
                        values={form.data}
                        guardians={guardians}
                        errorFor={(field) => errors[field]}
                        disabled={form.processing}
                        onPresenceChange={(present) => form.setData('is_present', present)}
                        onGuardiansChange={(changes) =>
                            form.setData((current) => ({ ...current, ...changes }))
                        }
                        onFieldChange={(field: AeeEvaluationTextField, value) =>
                            form.setData(field, value)
                        }
                    />
                </FormSection>
            </CardBox>
            <FormActions
                secondary={
                    <Button
                        href={aeeRecordUrls.show(aeeRecord.id)}
                        tone="info"
                        leftIconClass="fa fa-clone"
                        label="Ver registro completo"
                        title="Ver registro completo do atendimento AEE"
                        aria-label="Ver registro completo do atendimento AEE"
                        disabled={form.processing}
                    />
                }
                status={form.processing ? 'Salvando avaliação do aluno...' : undefined}
            >
                <Button
                    href={urls.record}
                    tone="cancel"
                    label="Cancelar"
                    title="Cancelar e voltar para o prontuário do aluno"
                    aria-label="Cancelar e voltar para o prontuário do aluno"
                    disabled={form.processing}
                />
                <Button
                    type="submit"
                    tone="save"
                    leftIconClass="fa fa-check"
                    label="Salvar"
                    title="Salvar avaliação do aluno"
                    aria-label={submitLabel}
                    disabled={form.processing}
                />
            </FormActions>
        </FormLayout>
    );
}

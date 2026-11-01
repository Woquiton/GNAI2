import FormActions from '@/components/Forms/FormActions/FormActions';
import FormLayout from '@/components/Forms/FormLayout/FormLayout';
import Button from '@/components/UI/Button/Button';
import CardBox from '@/components/UI/CardBox/CardBox';
import { aeeRecordUrls, aeeSessionUrls } from '../AeeRecords.routes';
import type { AeeGuardiansByStudent, AeeRecordRecord, AeeSession } from '../AeeRecords.types';
import AeeRecordEvaluationFields from './AeeRecordEvaluationFields';
import AeeRecordGeneralFields from './AeeRecordGeneralFields';
import { useAeeRecordForm } from './useAeeRecordForm';

interface AeeRecordFormProps {
    session: AeeSession;
    aeeRecord?: AeeRecordRecord;
    guardiansByStudent: AeeGuardiansByStudent;
}

/** Cadastro e edição do registro do atendimento AEE com a avaliação de cada aluno. */
export default function AeeRecordForm({
    session,
    aeeRecord,
    guardiansByStudent,
}: AeeRecordFormProps): React.JSX.Element {
    const {
        form,
        errors,
        formRef,
        students,
        tabFocus,
        collectionErrors,
        evaluationErrorFor,
        evaluationHasErrors,
        updateEvaluation,
        save,
    } = useAeeRecordForm({ session, aeeRecord });
    const editing = Boolean(aeeRecord);
    const cancelHref = aeeRecord
        ? aeeRecordUrls.show(aeeRecord.id)
        : aeeSessionUrls.show(session.id);
    const formLabel = editing
        ? 'Editar registro de atendimento AEE'
        : 'Cadastrar registro de atendimento AEE';
    const submitLabel = form.processing
        ? 'Salvando registro do atendimento AEE'
        : 'Salvar registro do atendimento AEE';

    return (
        <FormLayout
            ref={formRef}
            aria-label={formLabel}
            aria-busy={form.processing}
            onSubmit={(event) => {
                event.preventDefault();
                save();
            }}
        >
            <CardBox>
                <AeeRecordGeneralFields form={form} errors={errors} disabled={form.processing} />
                <AeeRecordEvaluationFields
                    editing={editing}
                    students={students}
                    evaluations={form.data.evaluations}
                    guardiansByStudent={guardiansByStudent}
                    tabFocus={tabFocus}
                    collectionErrors={collectionErrors}
                    disabled={form.processing}
                    errorFor={evaluationErrorFor}
                    hasErrors={evaluationHasErrors}
                    onChange={updateEvaluation}
                />
            </CardBox>
            <FormActions
                status={form.processing ? 'Salvando registro do atendimento AEE...' : undefined}
            >
                <Button
                    href={cancelHref}
                    tone="cancel"
                    label="Cancelar"
                    title="Cancelar e voltar"
                    aria-label="Cancelar e voltar"
                    disabled={form.processing}
                />
                <Button
                    type="submit"
                    tone="save"
                    leftIconClass="fa fa-check"
                    label="Salvar"
                    title="Salvar registro do atendimento AEE"
                    aria-label={submitLabel}
                    disabled={form.processing}
                />
            </FormActions>
        </FormLayout>
    );
}

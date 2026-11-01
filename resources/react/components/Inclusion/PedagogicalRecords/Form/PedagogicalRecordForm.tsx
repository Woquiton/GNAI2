import { sessionUrls } from '@/components/Inclusion/Sessions/Sessions.routes';
import FormActions from '@/components/Forms/FormActions/FormActions';
import FormLayout from '@/components/Forms/FormLayout/FormLayout';
import Button from '@/components/UI/Button/Button';
import CardBox from '@/components/UI/CardBox/CardBox';
import { pedagogicalRecordUrls } from '../PedagogicalRecords.routes';
import type {
    PedagogicalRecordFormContext,
    PedagogicalRecordFormRecord,
} from '../PedagogicalRecords.types';
import PedagogicalRecordFollowUpFields from './PedagogicalRecordFollowUpFields';
import PedagogicalRecordIdentificationFields from './PedagogicalRecordIdentificationFields';
import { usePedagogicalRecordForm } from './usePedagogicalRecordForm';

interface PedagogicalRecordFormProps {
    context: PedagogicalRecordFormContext;
    record?: PedagogicalRecordFormRecord;
    /** Aluno de origem: cancelar e salvar preservam o retorno ao prontuário. */
    returnStudentId?: number;
}

function submissionStatus(processing: boolean, editing: boolean): string | undefined {
    if (!processing) {
        return undefined;
    }

    return editing ? 'Salvando alterações…' : 'Salvando atendimento…';
}

/** Cadastro e edição do atendimento pedagógico de um agendamento. */
export default function PedagogicalRecordForm({
    context,
    record,
    returnStudentId,
}: PedagogicalRecordFormProps): React.JSX.Element {
    const {
        form,
        errors,
        guardianError,
        formRef,
        updatePresence,
        updateWithGuardians,
        toggleGuardian,
        save,
    } = usePedagogicalRecordForm({ context, record, returnStudentId });
    const editing = Boolean(record);
    const cancelHref = record
        ? pedagogicalRecordUrls.show(record.id, returnStudentId)
        : sessionUrls.show(context.session_id);
    const formLabel = editing
        ? 'Editar atendimento pedagógico'
        : 'Cadastrar atendimento pedagógico';

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
                <fieldset disabled={form.processing}>
                    <PedagogicalRecordIdentificationFields
                        context={context}
                        withGuardians={form.data.with_guardians}
                        guardianIds={form.data.guardian_ids}
                        guardianError={guardianError}
                        disabled={form.processing}
                        onWithGuardiansChange={updateWithGuardians}
                        onGuardianToggle={toggleGuardian}
                    />
                    <PedagogicalRecordFollowUpFields
                        data={form.data}
                        errors={errors}
                        disabled={form.processing}
                        onChange={(name, value) => form.setData(name, value)}
                        onPresenceChange={updatePresence}
                    />
                </fieldset>
            </CardBox>
            <FormActions status={submissionStatus(form.processing, editing)}>
                <Button
                    href={cancelHref}
                    tone="cancel"
                    label="Cancelar"
                    aria-label="Cancelar e voltar"
                    disabled={form.processing}
                />
                <Button
                    type="submit"
                    tone="save"
                    label="Salvar"
                    title="Salvar atendimento pedagógico"
                    aria-label="Salvar atendimento pedagógico"
                    disabled={form.processing}
                />
            </FormActions>
        </FormLayout>
    );
}

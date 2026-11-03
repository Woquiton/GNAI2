import FormActions from '@/components/Forms/FormActions/FormActions';
import FormLayout from '@/components/Forms/FormLayout/FormLayout';
import AttendanceRecordTabNavigation from '@/components/Inclusion/AttendanceRecordTabs/AttendanceRecordTabNavigation';
import AttendanceRecordTabs, {
    type AttendanceRecordTab,
} from '@/components/Inclusion/AttendanceRecordTabs/AttendanceRecordTabs';
import AttendanceDetailsFields from '@/components/Inclusion/Sessions/Form/AttendanceDetailsFields';
import { sessionUrls } from '@/components/Inclusion/Sessions/Sessions.routes';
import Button from '@/components/UI/Button/Button';
import CardBox from '@/components/UI/CardBox/CardBox';
import { pedagogicalRecordUrls } from '../PedagogicalRecords.routes';
import { PEDAGOGICAL_RECORD_TOUR_TARGETS } from '../pedagogicalRecordTours';
import PedagogicalRecordFollowUpFields from './PedagogicalRecordFollowUpFields';
import PedagogicalRecordIdentificationFields from './PedagogicalRecordIdentificationFields';
import {
    type UsePedagogicalRecordFormOptions,
    usePedagogicalRecordForm,
} from './usePedagogicalRecordForm';

function submissionStatus(processing: boolean, editing: boolean): string | undefined {
    if (!processing) {
        return undefined;
    }

    return editing ? 'Salvando alterações…' : 'Salvando atendimento…';
}

function cancelHref(props: UsePedagogicalRecordFormOptions): string {
    if (props.mode === 'edit') {
        return pedagogicalRecordUrls.show(props.record.id, props.returnStudentId);
    }

    return props.mode === 'direct'
        ? props.direct.backUrl
        : sessionUrls.show(props.context.session_id);
}

/**
 * Cadastro e edição do atendimento pedagógico. Pelo agendamento, os dados dele aparecem somente
 * para leitura; a edição corrige data, horário e local, e o registro direto escolhe o aluno.
 */
export default function PedagogicalRecordForm(
    props: UsePedagogicalRecordFormOptions,
): React.JSX.Element {
    const {
        form,
        errors,
        guardianError,
        guardians,
        formRef,
        tabs,
        pending,
        studentRows,
        editorFailed,
        reportEditorFailure,
        updatePresence,
        updateWithGuardians,
        toggleGuardian,
        changeDetail,
        changeStartTime,
        changeStudent,
        save,
    } = usePedagogicalRecordForm(props);
    const editing = props.mode === 'edit';
    const formLabel = editing
        ? 'Editar atendimento pedagógico'
        : 'Cadastrar atendimento pedagógico';
    const sharedDetailsProps = {
        values: form.data,
        errors,
        disabled: form.processing,
        onChange: changeDetail,
        onStartTimeChange: changeStartTime,
    };
    const studentPending = props.mode === 'direct' && !form.data.student_ids[0];
    let detailsSection: React.JSX.Element | null = null;

    if (props.mode === 'direct') {
        detailsSection = (
            <AttendanceDetailsFields
                {...sharedDetailsProps}
                startTimes={props.direct.startTimes}
                endTimes={props.direct.endTimes}
                attendanceTypeLabel={props.direct.attendanceTypeLabel}
                professional={props.direct.professional}
                selection={{
                    students: props.direct.students,
                    rows: studentRows,
                    canAdd: false,
                    onStudentChange: changeStudent,
                }}
            />
        );
    } else if (props.mode === 'edit') {
        detailsSection = (
            <AttendanceDetailsFields
                {...sharedDetailsProps}
                startTimes={props.correction.startTimes}
                endTimes={props.correction.endTimes}
                attendanceTypeLabel={props.correction.attendanceTypeLabel}
                professional={{
                    id: props.context.professional_id,
                    name: props.context.professional_name,
                }}
                studentNames={[props.context.student_name ?? 'Aluno não informado']}
            />
        );
    }

    const guardiansSection = (
        <PedagogicalRecordIdentificationFields
            context={props.mode === 'session' ? props.context : undefined}
            guardians={guardians}
            emptyGuardiansMessage={
                studentPending
                    ? 'Selecione o aluno para ver os responsáveis cadastrados.'
                    : undefined
            }
            withGuardians={form.data.with_guardians}
            guardianIds={form.data.guardian_ids}
            guardianError={guardianError}
            disabled={form.processing}
            onWithGuardiansChange={updateWithGuardians}
            onGuardianToggle={toggleGuardian}
        />
    );
    const followUpSection = (
        <PedagogicalRecordFollowUpFields
            data={form.data}
            errors={errors}
            disabled={form.processing}
            onChange={(name, value) => form.setData(name, value)}
            onPresenceChange={updatePresence}
            onEditorFailure={reportEditorFailure}
        />
    );
    // Com os dados do atendimento editáveis, os responsáveis acompanham o aluno na primeira aba.
    const recordTabs: AttendanceRecordTab[] = detailsSection
        ? [
              {
                  id: 'details',
                  label: 'Dados do Atendimento',
                  icon: 'fa fa-calendar',
                  pending: pending.details,
                  content: (
                      <>
                          <div data-tour={PEDAGOGICAL_RECORD_TOUR_TARGETS.details}>
                              {detailsSection}
                          </div>
                          {guardiansSection}
                      </>
                  ),
              },
              {
                  id: 'general',
                  label: 'Informações Gerais da Execução',
                  icon: 'fa fa-clipboard',
                  pending: pending.general,
                  content: followUpSection,
              },
          ]
        : [
              {
                  id: 'general',
                  label: 'Informações Gerais da Execução',
                  icon: 'fa fa-clipboard',
                  content: (
                      <>
                          {guardiansSection}
                          {followUpSection}
                      </>
                  ),
              },
          ];

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
            <CardBox
                tourTarget={detailsSection ? PEDAGOGICAL_RECORD_TOUR_TARGETS.formTabs : undefined}
            >
                <fieldset disabled={form.processing}>
                    <AttendanceRecordTabs tabs={recordTabs} state={tabs} />
                </fieldset>
            </CardBox>
            <FormActions
                secondary={
                    <AttendanceRecordTabNavigation
                        tabs={recordTabs}
                        state={tabs}
                        disabled={form.processing}
                    />
                }
                status={submissionStatus(form.processing, editing)}
                tourTarget={PEDAGOGICAL_RECORD_TOUR_TARGETS.formActions}
            >
                <Button
                    href={cancelHref(props)}
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
                    disabled={form.processing || editorFailed}
                />
            </FormActions>
        </FormLayout>
    );
}

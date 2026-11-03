import FormActions from '@/components/Forms/FormActions/FormActions';
import FormLayout from '@/components/Forms/FormLayout/FormLayout';
import AttendanceRecordTabNavigation from '@/components/Inclusion/AttendanceRecordTabs/AttendanceRecordTabNavigation';
import AttendanceRecordTabs, {
    type AttendanceRecordTab,
} from '@/components/Inclusion/AttendanceRecordTabs/AttendanceRecordTabs';
import AttendanceDetailsFields from '@/components/Inclusion/Sessions/Form/AttendanceDetailsFields';
import { personName } from '@/components/Inclusion/Sessions/Form/SessionForm.utils';
import Button from '@/components/UI/Button/Button';
import CardBox from '@/components/UI/CardBox/CardBox';
import { aeeRecordUrls, aeeSessionUrls } from '../AeeRecords.routes';
import type { AeeGuardiansByStudent } from '../AeeRecords.types';
import { AEE_RECORD_TOUR_TARGETS } from '../aeeRecordTours';
import AeeRecordEvaluationFields from './AeeRecordEvaluationFields';
import AeeRecordGeneralFields from './AeeRecordGeneralFields';
import { type UseAeeRecordFormOptions, useAeeRecordForm } from './useAeeRecordForm';

type AeeRecordFormProps = UseAeeRecordFormOptions & {
    /** Responsáveis por aluno; no registro direto, vêm das opções do cabeçalho. */
    guardiansByStudent?: AeeGuardiansByStudent;
};

function cancelHref(props: AeeRecordFormProps): string {
    if (props.mode === 'edit') return aeeRecordUrls.show(props.aeeRecord.id);
    if (props.mode === 'direct') return props.direct.backUrl;

    return aeeSessionUrls.show(props.session.id);
}

/**
 * Cadastro e edição do registro do atendimento AEE com a avaliação de cada aluno. A edição
 * corrige data, horário e local; o registro direto escolhe também alunos e formato.
 */
export default function AeeRecordForm(props: AeeRecordFormProps): React.JSX.Element {
    const {
        form,
        errors,
        formRef,
        tabs,
        pending,
        students,
        studentRows,
        canAddStudents,
        tabFocus,
        collectionErrors,
        evaluationErrorFor,
        evaluationHasErrors,
        updateEvaluation,
        changeDetail,
        changeStartTime,
        changeStudent,
        editorFailed,
        reportEditorFailure,
        save,
    } = useAeeRecordForm(props);
    const editing = props.mode === 'edit';
    const guardiansByStudent =
        props.mode === 'direct'
            ? props.direct.guardiansByStudent
            : (props.guardiansByStudent ?? {});
    const formLabel = editing
        ? 'Editar registro de atendimento AEE'
        : 'Cadastrar registro de atendimento AEE';
    const submitLabel = form.processing
        ? 'Salvando registro do atendimento AEE'
        : 'Salvar registro do atendimento AEE';
    const sharedDetailsProps = {
        values: form.data,
        errors,
        disabled: form.processing,
        onChange: changeDetail,
        onStartTimeChange: changeStartTime,
    };
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
                    canAdd: canAddStudents,
                    sessionTypes: props.direct.sessionTypes,
                    onStudentChange: changeStudent,
                    onTypeChange: (value) => form.setData('type', value),
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
                    id: props.session.professional?.id ?? 0,
                    name: personName(props.session.professional),
                }}
                studentNames={students.map((student) => student.name)}
            />
        );
    }

    const detailsTab: AttendanceRecordTab[] = detailsSection
        ? [
              {
                  id: 'details',
                  label: 'Dados do Atendimento',
                  icon: 'fa fa-calendar',
                  pending: pending.details,
                  content: detailsSection,
              },
          ]
        : [];
    const recordTabs: AttendanceRecordTab[] = [
        ...detailsTab,
        {
            id: 'general',
            label: 'Informações Gerais da Execução',
            icon: 'fa fa-clipboard',
            pending: pending.general,
            content: (
                <AeeRecordGeneralFields
                    form={form}
                    errors={errors}
                    disabled={form.processing}
                    onEditorFailure={reportEditorFailure}
                />
            ),
        },
        {
            id: 'evaluations',
            label: 'Avaliação Individual por Aluno',
            icon: 'fa fa-users',
            pending: pending.evaluations,
            content: (
                <AeeRecordEvaluationFields
                    editing={editing}
                    students={students}
                    evaluations={form.data.evaluations}
                    guardiansByStudent={guardiansByStudent}
                    tabFocus={tabFocus}
                    collectionErrors={collectionErrors}
                    disabled={form.processing}
                    emptyMessage={
                        props.mode === 'direct'
                            ? 'Selecione os alunos participantes para preencher as avaliações.'
                            : undefined
                    }
                    errorFor={evaluationErrorFor}
                    hasErrors={evaluationHasErrors}
                    onChange={updateEvaluation}
                    onEditorFailure={reportEditorFailure}
                />
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
            <CardBox tourTarget={AEE_RECORD_TOUR_TARGETS.recordTabs}>
                <AttendanceRecordTabs tabs={recordTabs} state={tabs} />
            </CardBox>
            <FormActions
                tourTarget={AEE_RECORD_TOUR_TARGETS.formActions}
                secondary={
                    <AttendanceRecordTabNavigation
                        tabs={recordTabs}
                        state={tabs}
                        disabled={form.processing}
                    />
                }
                status={form.processing ? 'Salvando registro do atendimento AEE...' : undefined}
            >
                <Button
                    href={cancelHref(props)}
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
                    disabled={form.processing || editorFailed}
                />
            </FormActions>
        </FormLayout>
    );
}

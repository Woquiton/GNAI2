import ChoiceControl from '@/components/Forms/ChoiceControl/ChoiceControl';
import ChoiceGroup from '@/components/Forms/ChoiceGroup/ChoiceGroup';
import FormField from '@/components/Forms/FormField/FormField';
import FormGrid, { FormGridWide, FormStack } from '@/components/Forms/FormGrid/FormGrid';
import FormSection from '@/components/Forms/FormSection/FormSection';
import ToggleControl from '@/components/Forms/ToggleControl/ToggleControl';
import DetailField from '@/components/UI/DetailField/DetailField';
import DetailGrid from '@/components/UI/DetailGrid/DetailGrid';
import type {
    PedagogicalRecordFormContext,
    PedagogicalRecordGuardianOption,
} from '../PedagogicalRecords.types';
import { PEDAGOGICAL_RECORD_TOUR_TARGETS } from '../pedagogicalRecordTours';
import '@styles/components/PedagogicalRecords/Form/PedagogicalRecordForm.css';

interface PedagogicalRecordIdentificationFieldsProps {
    /** Resumo do agendamento; ausente quando os dados do atendimento são editáveis. */
    context?: PedagogicalRecordFormContext;
    guardians: PedagogicalRecordGuardianOption[];
    /** Aviso sem responsáveis; o padrão diz que o aluno não tem responsáveis cadastrados. */
    emptyGuardiansMessage?: string;
    withGuardians: boolean;
    guardianIds: number[];
    guardianError?: string;
    disabled: boolean;
    onWithGuardiansChange: (withGuardians: boolean) => void;
    onGuardianToggle: (id: number, checked: boolean) => void;
}

/** Dados do agendamento (somente leitura) e responsáveis que participaram do atendimento. */
export default function PedagogicalRecordIdentificationFields({
    context,
    guardians,
    emptyGuardiansMessage = 'O aluno não possui responsáveis cadastrados no sistema.',
    withGuardians,
    guardianIds,
    guardianError,
    disabled,
    onWithGuardiansChange,
    onGuardianToggle,
}: PedagogicalRecordIdentificationFieldsProps): React.JSX.Element {
    const hasGuardians = guardians.length > 0;
    const guardiansId = 'pedagogical-record-guardians';
    const guardianDescription = hasGuardians
        ? 'Marque para selecionar os responsáveis que participaram do atendimento.'
        : emptyGuardiansMessage;

    function renderGuardian(guardian: PedagogicalRecordGuardianOption): React.JSX.Element {
        const label = (
            <>
                <strong>{guardian.name}</strong>
                <span className="pedagogicalRecordForm__relationship">
                    {', '}
                    {guardian.relationship_label}
                </span>
            </>
        );

        return (
            <ChoiceControl
                key={guardian.id}
                type="checkbox"
                tone="purple"
                id={`pedagogical-record-guardian-${guardian.id}`}
                name="guardian_ids[]"
                label={label}
                aria-label={`${guardian.name}, ${guardian.relationship_label}`}
                checked={guardianIds.includes(guardian.id)}
                disabled={disabled}
                onChange={(checked) => onGuardianToggle(guardian.id, checked)}
            />
        );
    }

    const summary = context ? (
        <DetailGrid>
            <DetailField label="Aluno">{context.student_name ?? 'Aluno não informado'}</DetailField>
            <DetailField label="Profissional">
                {context.professional_name ?? 'Profissional não informado'}
            </DetailField>
            <DetailField label="Data">{context.session_date ?? 'Não informado'}</DetailField>
            <DetailField label="Horário">
                {`${context.start_time} às ${context.end_time ?? '--:--'}`}
            </DetailField>
            <DetailField label="Tipo">{context.attendance_type_label}</DetailField>
        </DetailGrid>
    ) : null;

    return (
        <FormSection
            id="pedagogical-record-identification"
            title={context ? 'Identificação do Estudante' : 'Responsáveis Participantes'}
            variant="inline"
            iconClass={context ? 'fa fa-user' : 'fa fa-users'}
            tourTarget={PEDAGOGICAL_RECORD_TOUR_TARGETS.identification}
        >
            {summary}
            <FormGrid columns={2}>
                <FormGridWide>
                    <FormStack>
                        <ToggleControl
                            id="pedagogical-record-with-guardians"
                            name="with_guardians"
                            size="small"
                            label="Atendimento realizado com responsável pelo aluno"
                            description={guardianDescription}
                            checked={withGuardians}
                            disabled={!hasGuardians || disabled}
                            onChange={onWithGuardiansChange}
                        />
                    </FormStack>
                </FormGridWide>
                {withGuardians ? (
                    <FormGridWide>
                        <FormField
                            id={guardiansId}
                            label="Responsáveis participantes"
                            error={guardianError}
                        >
                            <ChoiceGroup
                                id={guardiansId}
                                label="Responsáveis participantes"
                                className="pedagogicalRecordForm__guardians"
                                invalid={Boolean(guardianError)}
                                describedBy={guardianError ? `${guardiansId}-error` : undefined}
                            >
                                {guardians.map(renderGuardian)}
                            </ChoiceGroup>
                        </FormField>
                    </FormGridWide>
                ) : null}
            </FormGrid>
        </FormSection>
    );
}

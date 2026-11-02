import ChoiceControl from '@/components/Forms/ChoiceControl/ChoiceControl';
import ChoiceGroup from '@/components/Forms/ChoiceGroup/ChoiceGroup';
import FormField from '@/components/Forms/FormField/FormField';
import { fieldDescribedBy } from '@/components/Forms/FormField/fieldDescription';
import { FormGridWide } from '@/components/Forms/FormGrid/FormGrid';
import ToggleControl from '@/components/Forms/ToggleControl/ToggleControl';
import type { AeeGuardianOption } from '../AeeRecords.types';
import type { AeeEvaluationGuardianChanges } from './AeeRecordForm.types';

interface AeeEvaluationGuardianFieldsProps {
    idPrefix: string;
    nameFor: (field: string) => string;
    values: AeeEvaluationGuardianChanges;
    guardians: AeeGuardianOption[];
    error?: string;
    disabled: boolean;
    onChange: (changes: AeeEvaluationGuardianChanges) => void;
}

/** Devolutiva à família: aparece no PEI como acompanhamento com responsáveis. */
export default function AeeEvaluationGuardianFields({
    idPrefix,
    nameFor,
    values,
    guardians,
    error,
    disabled,
    onChange,
}: AeeEvaluationGuardianFieldsProps): React.JSX.Element {
    const hasGuardians = guardians.length > 0;
    const guardiansId = `${idPrefix}-guardians`;
    const description = hasGuardians
        ? 'Esta conversa será exibida no PEI como devolutiva à família.'
        : 'O aluno não possui responsáveis cadastrados no sistema.';

    function toggleGuardian(id: number, checked: boolean): void {
        const others = values.guardian_ids.filter((item) => item !== id);

        onChange({
            with_guardians: values.with_guardians,
            guardian_ids: checked ? [...others, id] : others,
        });
    }

    return (
        <>
            <FormGridWide>
                <ToggleControl
                    id={`${idPrefix}-with-guardians`}
                    name={nameFor('with_guardians')}
                    size="small"
                    label="Atendimento realizado com participação de responsável"
                    description={description}
                    checked={values.with_guardians}
                    disabled={!hasGuardians || disabled}
                    onChange={(checked) =>
                        onChange({
                            with_guardians: checked,
                            guardian_ids: checked ? values.guardian_ids : [],
                        })
                    }
                />
            </FormGridWide>
            {values.with_guardians ? (
                <FormGridWide>
                    <FormField id={guardiansId} label="Responsáveis participantes" error={error}>
                        <ChoiceGroup
                            id={guardiansId}
                            label="Responsáveis participantes"
                            invalid={Boolean(error)}
                            describedBy={fieldDescribedBy(guardiansId, { error })}
                        >
                            {guardians.map((guardian) => (
                                <ChoiceControl
                                    key={guardian.id}
                                    type="checkbox"
                                    tone="purple"
                                    id={`${guardiansId}-${guardian.id}`}
                                    name={`${nameFor('guardian_ids')}[]`}
                                    label={
                                        <>
                                            <strong>{guardian.name}</strong>
                                            {', '}
                                            {guardian.relationship_label}
                                        </>
                                    }
                                    aria-label={`${guardian.name}, ${guardian.relationship_label}`}
                                    checked={values.guardian_ids.includes(guardian.id)}
                                    disabled={disabled}
                                    onChange={(checked) => toggleGuardian(guardian.id, checked)}
                                />
                            ))}
                        </ChoiceGroup>
                    </FormField>
                </FormGridWide>
            ) : null}
        </>
    );
}

import { optionsFromRecord } from '@/components/Forms/FormFields/fieldOptions';
import ChoiceControl from '@/components/Forms/ChoiceControl/ChoiceControl';
import FormField from '@/components/Forms/FormField/FormField';
import { SelectInputField, TextInputField } from '@/components/Forms/FormFields/FormFields';
import FormGrid from '@/components/Forms/FormGrid/FormGrid';
import type { BarrierFormOptions } from '../Barriers.types';
import type { BarrierFormSectionProps } from './BarrierForm.types';
import './BarrierAffectedPeopleFields.css';

interface BarrierAffectedPeopleFieldsProps extends BarrierFormSectionProps {
    students: BarrierFormOptions['students'];
    professionals: BarrierFormOptions['professionals'];
}

/**
 * Pessoa impactada: relato anônimo (sem identificação), relato geral (nome e cargo informados
 * manualmente) ou estudante/profissional cadastrado. Cada modo limpa os campos dos demais.
 */
export default function BarrierAffectedPeopleFields({
    form,
    errors,
    disabled,
    students,
    professionals,
}: BarrierAffectedPeopleFieldsProps): React.JSX.Element {
    const { is_anonymous: anonymous, not_applicable: general } = form.data;

    function changeAnonymous(checked: boolean): void {
        form.setData((current) => ({
            ...current,
            is_anonymous: checked,
            not_applicable: checked ? false : current.not_applicable,
            ...(checked
                ? {
                      affected_student_id: '',
                      affected_professional_id: '',
                      affected_person_name: '',
                      affected_person_role: '',
                  }
                : {}),
        }));
    }

    function changeGeneral(checked: boolean): void {
        form.setData((current) => ({
            ...current,
            not_applicable: checked,
            ...(checked
                ? { affected_student_id: '', affected_professional_id: '' }
                : { affected_person_name: '', affected_person_role: '' }),
        }));
    }

    const registeredPeople = (
        <FormGrid columns={2}>
            <SelectInputField
                id="barrier-student"
                name="affected_student_id"
                label="Estudante"
                placeholder="Selecione"
                options={optionsFromRecord(students)}
                disabled={disabled}
                value={form.data.affected_student_id}
                error={errors.affected_student_id}
                onChange={(value) => form.setData('affected_student_id', value)}
            />
            <SelectInputField
                id="barrier-professional"
                name="affected_professional_id"
                label="Profissional"
                placeholder="Selecione"
                options={optionsFromRecord(professionals)}
                disabled={disabled}
                value={form.data.affected_professional_id}
                error={errors.affected_professional_id}
                onChange={(value) => form.setData('affected_professional_id', value)}
            />
        </FormGrid>
    );
    const manualPerson = (
        <FormGrid columns={2}>
            <TextInputField
                id="barrier-person-name"
                name="affected_person_name"
                label="Nome"
                maxLength={255}
                disabled={disabled}
                value={form.data.affected_person_name}
                error={errors.affected_person_name}
                onChange={(value) => form.setData('affected_person_name', value)}
            />
            <TextInputField
                id="barrier-person-role"
                name="affected_person_role"
                label="Cargo"
                maxLength={255}
                disabled={disabled}
                value={form.data.affected_person_role}
                error={errors.affected_person_role}
                onChange={(value) => form.setData('affected_person_role', value)}
            />
        </FormGrid>
    );
    let identification: React.ReactNode = registeredPeople;

    if (anonymous) {
        identification = (
            <p className="barrierAffectedPeople__note">
                <i className="fa fa-user-secret" aria-hidden="true" /> A identidade das pessoas
                impactadas não será registrada.
            </p>
        );
    } else if (general) {
        identification = manualPerson;
    }

    return (
        <FormField id="barrier-people" label="Pessoa Impactada">
            <div
                id="barrier-people"
                className="barrierAffectedPeople"
                role="group"
                aria-label="Pessoa Impactada"
            >
                <div className="barrierAffectedPeople__options">
                    <ChoiceControl
                        type="checkbox"
                        tone="purple"
                        id="barrier-anonymous"
                        name="is_anonymous"
                        label="Relato Anônimo"
                        checked={anonymous}
                        disabled={disabled}
                        onChange={changeAnonymous}
                    />
                    {!anonymous ? (
                        <ChoiceControl
                            type="checkbox"
                            tone="purple"
                            id="barrier-not-applicable"
                            name="not_applicable"
                            label="Relato Geral"
                            checked={general}
                            disabled={disabled}
                            onChange={changeGeneral}
                        />
                    ) : null}
                </div>
                {identification}
            </div>
        </FormField>
    );
}

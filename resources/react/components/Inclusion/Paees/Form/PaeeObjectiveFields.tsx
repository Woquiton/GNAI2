import FormField from '@/components/Forms/FormField/FormField';
import { fieldDescribedBy } from '@/components/Forms/FormField/fieldDescription';
import { TextAreaField } from '@/components/Forms/FormFields/FormFields';
import FormSection from '@/components/Forms/FormSection/FormSection';
import RemovableField from '@/components/Forms/RemovableField/RemovableField';
import RepeaterField from '@/components/Forms/RepeaterField/RepeaterField';
import SelectField from '@/components/Forms/SelectField/SelectField';
import { objectiveTermOptions } from '../Paees.constants';
import type { PaeeFormSectionProps, PaeeObjectiveInput } from './PaeeForm.types';
import { paeeFieldId } from './usePaeeForm';

/* Os selects do Blade não tinham opção vazia: o bloco novo começa na primeira opção. */
const newObjective = (): PaeeObjectiveInput => ({
    description: '',
    term: objectiveTermOptions[0].value,
    linked_barrier_id: null,
});

/** Objetivos do plano: descrição e prazo, com inclusão e remoção de blocos. */
export default function PaeeObjectiveFields({
    form,
    errors,
    disabled,
}: PaeeFormSectionProps): React.JSX.Element {
    return (
        <FormSection
            id="paee-objectives"
            title="Objetivos"
            variant="inline"
            iconClass="fa fa-bullseye"
        >
            <RepeaterField<PaeeObjectiveInput>
                items={form.data.objectives}
                onChange={(objectives) => form.setData('objectives', objectives)}
                createItem={newObjective}
                itemLabel={(index) => `Objetivo ${index + 1}`}
                addLabel="Objetivo"
                emptyMessage="Nenhum objetivo adicionado."
                disabled={disabled}
                removePlacement="field"
                renderItem={(objective, index, update, remove) => {
                    const description = `objectives.${index}.description`;
                    const term = `objectives.${index}.term`;
                    const termId = paeeFieldId(term);

                    return (
                        <div className="paeeForm__item paeeForm__item--objective">
                            <TextAreaField
                                id={paeeFieldId(description)}
                                name={`objectives[${index}][description]`}
                                label="Descrição"
                                rows={2}
                                required
                                value={objective.description}
                                error={errors[description]}
                                onChange={(value) => update({ description: value })}
                            />
                            <FormField
                                id={termId}
                                label="Prazo"
                                requiredIndicator
                                error={errors[term]}
                            >
                                <RemovableField
                                    removeLabel={`Remover objetivo ${index + 1}`}
                                    disabled={disabled}
                                    onRemove={remove}
                                >
                                    <SelectField
                                        id={termId}
                                        name={`objectives[${index}][term]`}
                                        label="Prazo"
                                        required
                                        value={objective.term}
                                        options={objectiveTermOptions}
                                        disabled={disabled}
                                        invalid={Boolean(errors[term])}
                                        aria-describedby={fieldDescribedBy(termId, {
                                            error: errors[term],
                                        })}
                                        onChange={(event) => update({ term: event.target.value })}
                                    />
                                </RemovableField>
                            </FormField>
                        </div>
                    );
                }}
            />
        </FormSection>
    );
}

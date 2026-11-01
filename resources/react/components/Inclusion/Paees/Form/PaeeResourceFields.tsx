import FormField from '@/components/Forms/FormField/FormField';
import { fieldDescribedBy } from '@/components/Forms/FormField/fieldDescription';
import { TextAreaField } from '@/components/Forms/FormFields/FormFields';
import FormSection from '@/components/Forms/FormSection/FormSection';
import RemovableField from '@/components/Forms/RemovableField/RemovableField';
import RepeaterField from '@/components/Forms/RepeaterField/RepeaterField';
import SelectField from '@/components/Forms/SelectField/SelectField';
import InfoTooltip from '@/components/UI/InfoTooltip/InfoTooltip';
import { acquisitionTypeOptions } from '../Paees.constants';
import type { PaeeFormSectionProps, PaeeResourceInput } from './PaeeForm.types';
import { paeeFieldId } from './usePaeeForm';

/* Os selects do Blade não tinham opção vazia: o bloco novo começa na primeira opção. */
const newResource = (): PaeeResourceInput => ({
    description: '',
    acquisition_type: acquisitionTypeOptions[0].value,
    assistive_technology_id: null,
});

/** Recursos e materiais do plano: descrição e tipo de aquisição. */
export default function PaeeResourceFields({
    form,
    errors,
    disabled,
}: PaeeFormSectionProps): React.JSX.Element {
    return (
        <FormSection
            id="paee-resources"
            title="Recursos"
            titleAddon={
                <InfoTooltip
                    text="Se não houver necessidade de nenhum recurso ou material, deixe a lista vazia."
                    label="Mais informações sobre recursos"
                />
            }
            variant="inline"
            iconClass="fa fa-cubes"
        >
            <RepeaterField<PaeeResourceInput>
                items={form.data.resources}
                onChange={(resources) => form.setData('resources', resources)}
                createItem={newResource}
                itemLabel={(index) => `Recurso ${index + 1}`}
                addLabel="Recurso"
                emptyMessage="Nenhum recurso adicionado."
                disabled={disabled}
                removePlacement="field"
                renderItem={(resource, index, update, remove) => {
                    const description = `resources.${index}.description`;
                    const acquisition = `resources.${index}.acquisition_type`;
                    const acquisitionId = paeeFieldId(acquisition);
                    // A TA vinculada não tem controle próprio: seu erro aparece no tipo.
                    const acquisitionError =
                        errors[acquisition] ?? errors[`resources.${index}.assistive_technology_id`];

                    return (
                        <div className="paeeForm__item paeeForm__item--resource">
                            <TextAreaField
                                id={paeeFieldId(description)}
                                name={`resources[${index}][description]`}
                                label="Descrição"
                                rows={2}
                                required
                                value={resource.description}
                                error={errors[description]}
                                onChange={(value) => update({ description: value })}
                            />
                            <FormField
                                id={acquisitionId}
                                label="Tipo de aquisição"
                                requiredIndicator
                                error={acquisitionError}
                            >
                                <RemovableField
                                    removeLabel={`Remover recurso ${index + 1}`}
                                    disabled={disabled}
                                    onRemove={remove}
                                >
                                    <SelectField
                                        id={acquisitionId}
                                        name={`resources[${index}][acquisition_type]`}
                                        label="Tipo de aquisição"
                                        required
                                        value={resource.acquisition_type}
                                        options={acquisitionTypeOptions}
                                        disabled={disabled}
                                        invalid={Boolean(acquisitionError)}
                                        aria-describedby={fieldDescribedBy(acquisitionId, {
                                            error: acquisitionError,
                                        })}
                                        onChange={(event) =>
                                            update({ acquisition_type: event.target.value })
                                        }
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

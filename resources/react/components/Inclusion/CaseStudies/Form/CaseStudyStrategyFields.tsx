import FormField from '@/components/Forms/FormField/FormField';
import { fieldDescribedBy } from '@/components/Forms/FormField/fieldDescription';
import FormSection from '@/components/Forms/FormSection/FormSection';
import RemovableField from '@/components/Forms/RemovableField/RemovableField';
import RepeaterField from '@/components/Forms/RepeaterField/RepeaterField';
import TextArea from '@/components/Forms/TextArea/TextArea';
import type { CaseStudyStrategyInput } from '../CaseStudies.types';
import type { CaseStudyFormSectionProps } from './CaseStudyForm.types';

/** Estratégias propostas, cada uma com sua descrição. */
export default function CaseStudyStrategyFields({
    form,
    errors,
    disabled,
}: CaseStudyFormSectionProps): React.JSX.Element {
    function renderStrategy(
        strategy: CaseStudyStrategyInput,
        index: number,
        update: (patch: Partial<CaseStudyStrategyInput>) => void,
        remove: () => void,
    ): React.JSX.Element {
        const id = `case-study-strategies-${index}-description`;
        const error = errors[`strategies.${index}.description`];

        // O botão de remover acompanha a descrição, por isso o controle é isolado.
        return (
            <FormField id={id} label="Descrição da estratégia" requiredIndicator error={error}>
                <RemovableField
                    removeLabel={`Remover estratégia ${index + 1}`}
                    disabled={disabled}
                    onRemove={remove}
                >
                    <TextArea
                        id={id}
                        name={`strategies[${index}][description]`}
                        rows={2}
                        required
                        value={strategy.description}
                        invalid={Boolean(error)}
                        aria-describedby={fieldDescribedBy(id, { error })}
                        onChange={(event) => update({ description: event.target.value })}
                    />
                </RemovableField>
            </FormField>
        );
    }

    return (
        <FormSection
            id="case-study-strategies"
            title="Estratégias Propostas"
            variant="inline"
            iconClass="fa fa-lightbulb-o"
        >
            <RepeaterField<CaseStudyStrategyInput>
                items={form.data.strategies}
                onChange={(strategies) => form.setData('strategies', strategies)}
                createItem={() => ({ description: '' })}
                itemLabel={(index) => `Estratégia ${index + 1}`}
                addLabel="Estratégia"
                emptyMessage="Nenhuma estratégia adicionada."
                disabled={disabled}
                removePlacement="field"
                renderItem={renderStrategy}
            />
        </FormSection>
    );
}

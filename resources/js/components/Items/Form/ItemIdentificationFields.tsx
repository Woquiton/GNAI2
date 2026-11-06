import { optionsFromRecord } from '@/components/Forms/FormFields/fieldOptions';
import {
    CheckboxListField,
    optionsFromNamed,
    RichTextField,
    SelectInputField,
    TextInputField,
} from '@/components/Forms/FormFields/FormFields';
import FormGrid, { FormGridWide } from '@/components/Forms/FormGrid/FormGrid';
import FormSection from '@/components/Forms/FormSection/FormSection';
import { joinClassNames } from '@/utils/joinClassNames';
import { itemNatureOptions } from '../Items.constants';
import type { ItemFormOptions } from '../Items.types';
import { ITEM_TOUR_TARGETS } from '../itemTours';
import '@styles/components/Items/Form/ItemIdentificationFields.css';
import type { ItemFormSectionProps } from './ItemForm.types';

interface ItemIdentificationFieldsProps extends ItemFormSectionProps {
    options: ItemFormOptions;
    onEditorFailure: (message: string) => void;
}

/** Tipo, descrição, natureza, patrimônio, descrição detalhada, recursos e público-alvo. */
export default function ItemIdentificationFields({
    form,
    errors,
    disabled,
    options,
    onEditorFailure,
}: ItemIdentificationFieldsProps): React.JSX.Element {
    const digital = form.data.is_digital;

    function changeNature(value: string): void {
        const toDigital = value === '1';

        // Recursos digitais não têm patrimônio: o valor é descartado ao trocar a natureza.
        form.setData((data) => ({
            ...data,
            is_digital: toDigital,
            asset_code: toDigital ? '' : data.asset_code,
        }));
    }

    return (
        <FormSection
            id="item-identification-form"
            title="Identificação"
            variant="inline"
            iconClass="fa fa-cube"
            tourTarget={ITEM_TOUR_TARGETS.identification}
        >
            <FormGrid>
                <FormGridWide>
                    <div
                        className={joinClassNames(
                            'itemIdentification__mainRow',
                            digital && 'itemIdentification__mainRow--digital',
                        )}
                    >
                        <div className="itemIdentification__cell">
                            <SelectInputField
                                id="item-type"
                                name="item_type"
                                label="Tipo do Item"
                                required
                                options={optionsFromRecord(options.itemTypes)}
                                value={form.data.item_type}
                                error={errors.item_type}
                                onChange={(value) => form.setData('item_type', value)}
                            />
                        </div>
                        <div className="itemIdentification__cell">
                            <TextInputField
                                id="item-name"
                                name="name"
                                label="Descrição do Item"
                                required
                                maxLength={255}
                                placeholder="Ex: Cadeira de Rodas Motorizada, Livro em Braille..."
                                value={form.data.name}
                                error={errors.name}
                                onChange={(value) => form.setData('name', value)}
                            />
                        </div>
                        <div className="itemIdentification__cell">
                            <SelectInputField
                                id="item-digital"
                                name="is_digital"
                                label="Natureza do Recurso"
                                required
                                options={itemNatureOptions}
                                value={form.data.is_digital ? '1' : '0'}
                                error={errors.is_digital}
                                onChange={changeNature}
                            />
                        </div>
                        <div
                            className="itemIdentification__cell itemIdentification__cell--asset"
                            inert={digital}
                        >
                            <TextInputField
                                id="item-asset-code"
                                name="asset_code"
                                label="Patrimônio / Tombamento"
                                maxLength={50}
                                disabled={digital}
                                value={form.data.asset_code}
                                error={errors.asset_code}
                                onChange={(value) => form.setData('asset_code', value)}
                            />
                        </div>
                    </div>
                </FormGridWide>
                <FormGridWide>
                    <RichTextField
                        id="item-notes"
                        label="Descrição Detalhada"
                        defaultValue={form.data.notes}
                        height={120}
                        disabled={disabled}
                        error={errors.notes}
                        onLoadError={() =>
                            onEditorFailure(
                                'Não foi possível carregar o editor de descrição. Atualize a página e tente novamente.',
                            )
                        }
                        onChange={(html) => form.setData('notes', html)}
                    />
                </FormGridWide>
                <FormGridWide>
                    <CheckboxListField
                        id="item-accessibility-features"
                        name="accessibility_features"
                        label="Recursos presentes no item"
                        options={optionsFromNamed(options.accessibilityFeatures)}
                        value={form.data.accessibility_features}
                        error={errors.accessibility_features}
                        onChange={(values) => form.setData('accessibility_features', values)}
                    />
                </FormGridWide>
                <FormGridWide>
                    <CheckboxListField
                        id="item-deficiencies"
                        name="deficiencies"
                        label="Público Alvo"
                        required
                        options={optionsFromNamed(options.deficiencies)}
                        value={form.data.deficiencies}
                        error={errors.deficiencies}
                        onChange={(values) => form.setData('deficiencies', values)}
                    />
                </FormGridWide>
            </FormGrid>
        </FormSection>
    );
}

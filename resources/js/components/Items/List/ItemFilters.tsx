import CheckboxSelect from '@/components/Forms/CheckboxSelect/CheckboxSelect';
import TableListCreatedFilters from '@/components/Tables/TableList/TableListCreatedFilters';
import { booleanOptions, optionsFromRecord } from '@/components/Forms/FormFields/fieldOptions';
import { SelectInputField, TextInputField } from '@/components/Forms/FormFields/FormFields';
import { TableListFilters } from '@/components/Tables/TableList/TableList';
import { itemFilterOptions } from '../Items.constants';
import type { ItemFilters as ItemFilterValues } from '../Items.types';

interface ItemFiltersProps {
    deficiencyOptions: Array<{ id: number; name: string }>;
    values: ItemFilterValues;
    itemTypeOptions: Record<string, string>;
    accessibilityFeatureOptions: Record<string, string>;
    errors: Record<string, string | undefined>;
    onUpdate: (name: keyof ItemFilterValues, value: string) => void;
    onClear: () => void;
    onSubmit: () => void;
}

export default function ItemFilters({
    deficiencyOptions,
    values,
    itemTypeOptions,
    accessibilityFeatureOptions,
    errors,
    onUpdate,
    onClear,
    onSubmit,
}: ItemFiltersProps): React.JSX.Element {
    const moreFilters = (
        <>
            <SelectInputField
                id="item-is-active"
                name="is_active"
                label="Status"
                placeholder="Todos"
                options={itemFilterOptions.status}
                value={values.is_active}
                error={errors.is_active}
                onChange={(value) => onUpdate('is_active', value)}
            />
            <SelectInputField
                id="item-available"
                name="available"
                label="Disponibilidade"
                placeholder="Todos"
                options={itemFilterOptions.availability}
                value={values.available}
                error={errors.available}
                onChange={(value) => onUpdate('available', value)}
            />
        </>
    );

    return (
        <TableListFilters
            label="Filtrar itens"
            moreFilters={
                <>
                    {moreFilters}
                    <TextInputField
                        id="items-filter-asset_code"
                        name="asset_code"
                        label="Código patrimonial"
                        maxLength={255}
                        value={values.asset_code}
                        error={errors.asset_code}
                        onChange={(value) => onUpdate('asset_code', value)}
                    />
                    <CheckboxSelect
                        id="items-filter-deficiency_ids"
                        name="deficiency_ids"
                        label="Perfil de atendimento"
                        options={deficiencyOptions.map((profile) => ({
                            value: String(profile.id),
                            label: profile.name,
                        }))}
                        value={values.deficiency_ids}
                        error={errors.deficiency_ids}
                        onChange={(value) => onUpdate('deficiency_ids', value)}
                    />
                    <SelectInputField
                        id="items-filter-is_loanable"
                        name="is_loanable"
                        label="Permite empréstimo"
                        placeholder="Todos"
                        options={booleanOptions('Sim', 'Não')}
                        value={values.is_loanable}
                        error={errors.is_loanable}
                        onChange={(value) => onUpdate('is_loanable', value)}
                    />
                    <TableListCreatedFilters values={values} errors={errors} onUpdate={onUpdate} />
                </>
            }
            onClear={onClear}
            onSubmit={onSubmit}
        >
            <TextInputField
                id="item-name"
                name="name"
                label="Descrição"
                maxLength={255}
                placeholder="Filtrar por descrição..."
                value={values.name}
                error={errors.name}
                onChange={(value) => onUpdate('name', value)}
            />
            <SelectInputField
                id="item-type"
                name="item_type"
                label="Tipo"
                placeholder="Todos"
                options={optionsFromRecord(itemTypeOptions, { omitEmpty: true })}
                value={values.item_type}
                error={errors.item_type}
                onChange={(value) => onUpdate('item_type', value)}
            />
            <SelectInputField
                id="item-is-digital"
                name="is_digital"
                label="Natureza"
                placeholder="Todos"
                options={itemFilterOptions.nature}
                value={values.is_digital}
                error={errors.is_digital}
                onChange={(value) => onUpdate('is_digital', value)}
            />
            <SelectInputField
                id="item-accessibility-feature"
                name="accessibility_feature_id"
                label="Recurso de acessibilidade"
                placeholder="Todos"
                options={optionsFromRecord(accessibilityFeatureOptions, { omitEmpty: true })}
                value={values.accessibility_feature_id}
                error={errors.accessibility_feature_id}
                onChange={(value) => onUpdate('accessibility_feature_id', value)}
            />
        </TableListFilters>
    );
}

import { optionsFromRecord } from '@/components/Forms/FormFields/fieldOptions';
import { SelectInputField, TextInputField } from '@/components/Forms/FormFields/FormFields';
import { TableListFilters } from '@/components/Tables/TableList/TableList';
import { itemFilterOptions } from '../Items.constants';
import type { ItemFilters as ItemFilterValues } from '../Items.types';

interface ItemFiltersProps {
    values: ItemFilterValues;
    itemTypeOptions: Record<string, string>;
    accessibilityFeatureOptions: Record<string, string>;
    errors: Record<string, string | undefined>;
    onUpdate: (name: keyof ItemFilterValues, value: string) => void;
    onClear: () => void;
    onSubmit: () => void;
}

export default function ItemFilters({
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
            moreFilters={moreFilters}
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

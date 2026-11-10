import TableListCreatedFilters from '@/components/Tables/TableList/TableListCreatedFilters';
import { SelectInputField, TextInputField } from '@/components/Forms/FormFields/FormFields';
import { TableListFilters } from '@/components/Tables/TableList/TableList';
import { accessibilityFeatureStatusOptions } from '../AccessibilityFeatures.constants';
import type { AccessibilityFeatureFilters as FilterValues } from '../AccessibilityFeatures.types';

interface AccessibilityFeatureFiltersProps {
    values: FilterValues;
    errors: Record<string, string | undefined>;
    onUpdate: (name: keyof FilterValues, value: string) => void;
    onClear: () => void;
    onSubmit: () => void;
}

export default function AccessibilityFeatureFilters({
    values,
    errors,
    onUpdate,
    onClear,
    onSubmit,
}: AccessibilityFeatureFiltersProps): React.JSX.Element {
    return (
        <TableListFilters
            moreFilters={
                <TableListCreatedFilters values={values} errors={errors} onUpdate={onUpdate} />
            }
            label="Filtrar recursos de acessibilidade"
            onClear={onClear}
            onSubmit={onSubmit}
        >
            <TextInputField
                id="accessibility-feature-filter-name"
                name="name"
                label="Nome"
                maxLength={255}
                placeholder="Filtrar por nome..."
                value={values.name}
                error={errors.name}
                onChange={(value) => onUpdate('name', value)}
            />
            <SelectInputField
                id="accessibility-feature-filter-status"
                name="is_active"
                label="Status"
                placeholder="Todos"
                options={accessibilityFeatureStatusOptions}
                value={values.is_active}
                error={errors.is_active}
                onChange={(value) => onUpdate('is_active', value)}
            />
        </TableListFilters>
    );
}

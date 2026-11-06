import { SelectInputField, TextInputField } from '@/components/Forms/FormFields/FormFields';
import { TableListFilters } from '@/components/Tables/TableList/TableList';
import { barrierCategoryStatusOptions } from '../BarrierCategories.constants';
import type { BarrierCategoryFilters as FilterValues } from '../BarrierCategories.types';

interface BarrierCategoryFiltersProps {
    values: FilterValues;
    errors: Record<string, string | undefined>;
    onUpdate: (name: keyof FilterValues, value: string) => void;
    onClear: () => void;
    onSubmit: () => void;
}

export default function BarrierCategoryFilters({
    values,
    errors,
    onUpdate,
    onClear,
    onSubmit,
}: BarrierCategoryFiltersProps): React.JSX.Element {
    return (
        <TableListFilters
            label="Filtrar categorias de barreiras"
            onClear={onClear}
            onSubmit={onSubmit}
        >
            <TextInputField
                id="barrier-category-filter-name"
                name="name"
                label="Nome da Categoria"
                maxLength={150}
                placeholder="Filtrar por nome da categoria..."
                value={values.name}
                error={errors.name}
                onChange={(value) => onUpdate('name', value)}
            />
            <SelectInputField
                id="barrier-category-filter-status"
                name="is_active"
                label="Status"
                placeholder="Todos"
                options={barrierCategoryStatusOptions}
                value={values.is_active}
                error={errors.is_active}
                onChange={(value) => onUpdate('is_active', value)}
            />
        </TableListFilters>
    );
}

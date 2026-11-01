import { SelectInputField, TextInputField } from '@/components/Forms/FormFields/FormFields';
import { TableListFilters } from '@/components/Tables/TableList/TableList';
import { tagStatusOptions } from '../Tags.constants';
import type { TagFilters as FilterValues } from '../Tags.types';

interface TagFiltersProps {
    values: FilterValues;
    errors: Record<string, string | undefined>;
    onUpdate: (name: keyof FilterValues, value: string) => void;
    onClear: () => void;
    onSubmit: () => void;
}

export default function TagFilters({
    values,
    errors,
    onUpdate,
    onClear,
    onSubmit,
}: TagFiltersProps): React.JSX.Element {
    return (
        <TableListFilters label="Filtrar etiquetas" onClear={onClear} onSubmit={onSubmit}>
            <TextInputField
                id="tag-filter-name"
                name="name"
                label="Nome"
                maxLength={100}
                placeholder="Filtrar por nome..."
                value={values.name}
                error={errors.name}
                onChange={(value) => onUpdate('name', value)}
            />
            <SelectInputField
                id="tag-filter-status"
                name="is_active"
                label="Status"
                placeholder="Todos"
                options={tagStatusOptions}
                value={values.is_active}
                error={errors.is_active}
                onChange={(value) => onUpdate('is_active', value)}
            />
        </TableListFilters>
    );
}

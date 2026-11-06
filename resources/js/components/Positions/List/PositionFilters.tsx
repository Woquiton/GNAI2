import { SelectInputField, TextInputField } from '@/components/Forms/FormFields/FormFields';
import { TableListFilters } from '@/components/Tables/TableList/TableList';
import { positionStatusOptions } from '../Positions.constants';
import type { PositionFilters as PositionFilterValues } from '../Positions.types';

interface PositionFiltersProps {
    values: PositionFilterValues;
    errors: Record<string, string | undefined>;
    onUpdate: (name: keyof PositionFilterValues, value: string) => void;
    onClear: () => void;
    onSubmit: () => void;
}

export default function PositionFilters({
    values,
    errors,
    onUpdate,
    onClear,
    onSubmit,
}: PositionFiltersProps): React.JSX.Element {
    return (
        <TableListFilters label="Filtrar cargos" onClear={onClear} onSubmit={onSubmit}>
            <TextInputField
                id="position-filter-name"
                name="name"
                label="Nome"
                maxLength={255}
                placeholder="Buscar por nome..."
                value={values.name}
                error={errors.name}
                onChange={(value) => onUpdate('name', value)}
            />
            <TextInputField
                id="position-filter-description"
                name="description"
                label="Descrição"
                placeholder="Descrição..."
                value={values.description}
                error={errors.description}
                onChange={(value) => onUpdate('description', value)}
            />
            <SelectInputField
                id="position-filter-status"
                name="is_active"
                label="Status"
                placeholder="Todos"
                options={positionStatusOptions}
                value={values.is_active}
                error={errors.is_active}
                onChange={(value) => onUpdate('is_active', value)}
            />
        </TableListFilters>
    );
}

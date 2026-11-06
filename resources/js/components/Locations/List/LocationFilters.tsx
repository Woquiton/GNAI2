import { SelectInputField, TextInputField } from '@/components/Forms/FormFields/FormFields';
import { TableListFilters } from '@/components/Tables/TableList/TableList';
import { locationStatusOptions } from '../Locations.constants';
import type { LocationFilters as LocationFilterValues } from '../Locations.types';

interface LocationFiltersProps {
    values: LocationFilterValues;
    errors: Record<string, string | undefined>;
    onUpdate: (name: keyof LocationFilterValues, value: string) => void;
    onClear: () => void;
    onSubmit: () => void;
}

export default function LocationFilters({
    values,
    errors,
    onUpdate,
    onClear,
    onSubmit,
}: LocationFiltersProps): React.JSX.Element {
    return (
        <TableListFilters
            label="Filtrar pontos de referência"
            onClear={onClear}
            onSubmit={onSubmit}
        >
            <TextInputField
                id="location-filter-name"
                name="name"
                label="Nome do Local"
                maxLength={255}
                placeholder="Filtrar por nome do local..."
                value={values.name}
                error={errors.name}
                onChange={(value) => onUpdate('name', value)}
            />
            <TextInputField
                id="location-filter-institution"
                name="institution_name"
                label="Instituição"
                maxLength={255}
                placeholder="Filtrar por instituição..."
                value={values.institution_name}
                error={errors.institution_name}
                onChange={(value) => onUpdate('institution_name', value)}
            />
            <SelectInputField
                id="location-filter-status"
                name="is_active"
                label="Status"
                placeholder="Todos"
                options={locationStatusOptions}
                value={values.is_active}
                error={errors.is_active}
                onChange={(value) => onUpdate('is_active', value)}
            />
        </TableListFilters>
    );
}

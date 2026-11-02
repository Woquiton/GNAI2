import { SelectInputField, TextInputField } from '@/components/Forms/FormFields/FormFields';
import { TableListFilters } from '@/components/Tables/TableList/TableList';
import { disciplineStatusOptions } from '../Disciplines.constants';
import type { DisciplineFilters as DisciplineFilterValues } from '../Disciplines.types';

interface DisciplineFiltersProps {
    values: DisciplineFilterValues;
    errors: Record<string, string | undefined>;
    onUpdate: (name: keyof DisciplineFilterValues, value: string) => void;
    onClear: () => void;
    onSubmit: () => void;
}

export default function DisciplineFilters({
    values,
    errors,
    onUpdate,
    onClear,
    onSubmit,
}: DisciplineFiltersProps): React.JSX.Element {
    return (
        <TableListFilters label="Filtrar disciplinas" onClear={onClear} onSubmit={onSubmit}>
            <TextInputField
                id="discipline-filter-name"
                name="name"
                label="Nome da Disciplina"
                maxLength={255}
                placeholder="Nome da disciplina..."
                value={values.name}
                error={errors.name}
                onChange={(value) => onUpdate('name', value)}
            />
            <SelectInputField
                id="discipline-filter-status"
                name="is_active"
                label="Status"
                placeholder="Todos"
                options={disciplineStatusOptions}
                value={values.is_active}
                error={errors.is_active}
                onChange={(value) => onUpdate('is_active', value)}
            />
        </TableListFilters>
    );
}

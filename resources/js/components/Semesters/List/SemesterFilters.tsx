import { SelectInputField, TextInputField } from '@/components/Forms/FormFields/FormFields';
import { TableListFilters } from '@/components/Tables/TableList/TableList';
import { semesterFilterOptions } from '../Semesters.constants';
import type { SemesterFilters as SemesterFilterValues } from '../Semesters.types';

interface SemesterFiltersProps {
    values: SemesterFilterValues;
    errors: Record<string, string | undefined>;
    onUpdate: (name: keyof SemesterFilterValues, value: string) => void;
    onClear: () => void;
    onSubmit: () => void;
}

export default function SemesterFilters({
    values,
    errors,
    onUpdate,
    onClear,
    onSubmit,
}: SemesterFiltersProps): React.JSX.Element {
    return (
        <TableListFilters label="Filtrar semestres" onClear={onClear} onSubmit={onSubmit}>
            <TextInputField
                id="semester-filter-year"
                name="year"
                label="Ano"
                inputMode="numeric"
                maxLength={4}
                placeholder="Ano..."
                value={values.year}
                error={errors.year}
                onChange={(value) => onUpdate('year', value)}
            />
            <SelectInputField
                id="semester-filter-term"
                name="term"
                label="Período"
                placeholder="Todos"
                options={semesterFilterOptions.term}
                value={values.term}
                error={errors.term}
                onChange={(value) => onUpdate('term', value)}
            />
            <TextInputField
                id="semester-filter-label"
                name="label"
                label="Rótulo"
                maxLength={255}
                placeholder="Rótulo..."
                value={values.label}
                error={errors.label}
                onChange={(value) => onUpdate('label', value)}
            />
            <SelectInputField
                id="semester-filter-current"
                name="is_current"
                label="Status"
                placeholder="Todos"
                options={semesterFilterOptions.current}
                value={values.is_current}
                error={errors.is_current}
                onChange={(value) => onUpdate('is_current', value)}
            />
        </TableListFilters>
    );
}

import { SelectInputField } from '@/components/Forms/FormFields/FormFields';
import { TableListFilters } from '@/components/Tables/TableList/TableList';
import { severityOptions } from '../StudentDeficiencies.constants';
import type { StudentDeficiencyFilters as StudentDeficiencyFilterValues } from '../StudentDeficiencies.types';

interface StudentDeficiencyFiltersProps {
    values: StudentDeficiencyFilterValues;
    profileOptions: { value: string; label: string }[];
    errors: Record<string, string | undefined>;
    onUpdate: (name: keyof StudentDeficiencyFilterValues, value: string) => void;
    onClear: () => void;
    onSubmit: () => void;
}

export default function StudentDeficiencyFilters({
    values,
    profileOptions,
    errors,
    onUpdate,
    onClear,
    onSubmit,
}: StudentDeficiencyFiltersProps): React.JSX.Element {
    return (
        <TableListFilters
            label="Filtrar perfis de atendimento"
            onClear={onClear}
            onSubmit={onSubmit}
        >
            <SelectInputField
                id="student-deficiency-filter-profile"
                name="deficiency_id"
                label="Perfil"
                placeholder="Todos"
                options={profileOptions}
                value={values.deficiency_id}
                error={errors.deficiency_id}
                onChange={(value) => onUpdate('deficiency_id', value)}
            />
            <SelectInputField
                id="student-deficiency-filter-severity"
                name="severity"
                label="Severidade"
                placeholder="Todas"
                options={severityOptions}
                value={values.severity}
                error={errors.severity}
                onChange={(value) => onUpdate('severity', value)}
            />
        </TableListFilters>
    );
}

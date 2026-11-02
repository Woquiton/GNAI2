import { SelectInputField, TextInputField } from '@/components/Forms/FormFields/FormFields';
import type { FieldOption } from '@/components/Forms/FormFields/FormFields';
import { TableListFilters } from '@/components/Tables/TableList/TableList';
import { paeeStatusOptions } from '../Paees.constants';
import type { PaeeListFilters } from '../Paees.types';

interface PaeeFiltersProps {
    values: PaeeListFilters;
    semesters: FieldOption[];
    /** Na listagem do aluno, a busca por nome não é exibida. */
    showSearch: boolean;
    errors: Record<string, string | undefined>;
    onUpdate: (name: keyof PaeeListFilters, value: string) => void;
    onClear: () => void;
    onSubmit: () => void;
}

export default function PaeeFilters({
    values,
    semesters,
    showSearch,
    errors,
    onUpdate,
    onClear,
    onSubmit,
}: PaeeFiltersProps): React.JSX.Element {
    return (
        <TableListFilters label="Filtrar PAEEs" onClear={onClear} onSubmit={onSubmit}>
            {showSearch ? (
                <TextInputField
                    id="paee-filter-search"
                    name="search"
                    label="Aluno"
                    placeholder="Nome do aluno..."
                    value={values.search}
                    error={errors.search}
                    onChange={(value) => onUpdate('search', value)}
                />
            ) : null}
            <SelectInputField
                id="paee-filter-semester"
                name="semester_id"
                label="Semestre"
                placeholder="Todos"
                options={semesters}
                value={values.semester_id}
                error={errors.semester_id}
                onChange={(value) => onUpdate('semester_id', value)}
            />
            <SelectInputField
                id="paee-filter-status"
                name="status"
                label="Status"
                placeholder="Todos"
                options={paeeStatusOptions}
                value={values.status}
                error={errors.status}
                onChange={(value) => onUpdate('status', value)}
            />
        </TableListFilters>
    );
}

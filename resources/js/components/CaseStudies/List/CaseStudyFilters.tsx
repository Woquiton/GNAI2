import TableListCreatedFilters from '@/components/Tables/TableList/TableListCreatedFilters';
import { SelectInputField, TextInputField } from '@/components/Forms/FormFields/FormFields';
import type { SelectFieldOption } from '@/components/Forms/SelectField/SelectField.types';
import { TableListFilters } from '@/components/Tables/TableList/TableList';
import type { CaseStudyListFilters } from '../CaseStudies.types';

interface CaseStudyFiltersProps {
    values: CaseStudyListFilters;
    semesters: SelectFieldOption[];
    statuses: SelectFieldOption[];
    /** A busca por aluno só existe na listagem geral. */
    showSearch: boolean;
    errors: Record<string, string | undefined>;
    onUpdate: (name: keyof CaseStudyListFilters, value: string) => void;
    onClear: () => void;
    onSubmit: () => void;
}

export default function CaseStudyFilters({
    values,
    semesters,
    statuses,
    showSearch,
    errors,
    onUpdate,
    onClear,
    onSubmit,
}: CaseStudyFiltersProps): React.JSX.Element {
    return (
        <TableListFilters
            moreFilters={
                <TableListCreatedFilters values={values} errors={errors} onUpdate={onUpdate} />
            }
            label="Filtrar Estudos de Caso"
            onClear={onClear}
            onSubmit={onSubmit}
        >
            {showSearch ? (
                <TextInputField
                    id="case-study-filter-search"
                    name="search"
                    label="Aluno"
                    placeholder="Nome do aluno..."
                    value={values.search}
                    error={errors.search}
                    onChange={(value) => onUpdate('search', value)}
                />
            ) : null}
            <SelectInputField
                id="case-study-filter-semester"
                name="semester_id"
                label="Semestre"
                placeholder="Todos"
                options={semesters}
                value={values.semester_id}
                error={errors.semester_id}
                onChange={(value) => onUpdate('semester_id', value)}
            />
            <SelectInputField
                id="case-study-filter-status"
                name="status"
                label="Status"
                placeholder="Todos"
                options={statuses}
                value={values.status}
                error={errors.status}
                onChange={(value) => onUpdate('status', value)}
            />
        </TableListFilters>
    );
}

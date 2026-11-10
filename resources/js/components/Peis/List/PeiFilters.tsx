import TableListCreatedFilters from '@/components/Tables/TableList/TableListCreatedFilters';
import { SelectInputField, TextInputField } from '@/components/Forms/FormFields/FormFields';
import { TableListFilters } from '@/components/Tables/TableList/TableList';
import { peiStatusOptions } from '../Peis.constants';
import type { PeiListFilters, PeiListOption, PeiListVariant } from '../Peis.types';

interface PeiFiltersProps {
    variant: PeiListVariant;
    values: PeiListFilters;
    semesters: PeiListOption[];
    students: PeiListOption[];
    errors: Record<string, string | undefined>;
    onUpdate: (name: keyof PeiListFilters, value: string) => void;
    onClear: () => void;
    onSubmit: () => void;
}

/** Filtros das listagens; o estudante só aparece na listagem geral. */
export default function PeiFilters({
    variant,
    values,
    semesters,
    students,
    errors,
    onUpdate,
    onClear,
    onSubmit,
}: PeiFiltersProps): React.JSX.Element {
    const studentFilter =
        variant === 'all' ? (
            <SelectInputField
                id="pei-filter-student"
                name="student_id"
                label="Estudante"
                placeholder="Todos"
                options={students}
                value={values.student_id}
                error={errors.student_id}
                onChange={(value) => onUpdate('student_id', value)}
            />
        ) : null;

    return (
        <TableListFilters
            moreFilters={
                <TableListCreatedFilters values={values} errors={errors} onUpdate={onUpdate} />
            }
            label="Filtrar PEIs"
            onClear={onClear}
            onSubmit={onSubmit}
        >
            {studentFilter}
            <SelectInputField
                id="pei-filter-semester"
                name="semester_id"
                label="Semestre"
                placeholder="Todos"
                options={semesters}
                value={values.semester_id}
                error={errors.semester_id}
                onChange={(value) => onUpdate('semester_id', value)}
            />
            <TextInputField
                id="pei-filter-version"
                name="version"
                label="Versão"
                inputMode="numeric"
                placeholder="Versão..."
                value={values.version}
                error={errors.version}
                onChange={(value) => onUpdate('version', value)}
            />
            <SelectInputField
                id="pei-filter-status"
                name="is_finished"
                label="Status"
                placeholder="Todos"
                options={peiStatusOptions}
                value={values.is_finished}
                error={errors.is_finished}
                onChange={(value) => onUpdate('is_finished', value)}
            />
        </TableListFilters>
    );
}

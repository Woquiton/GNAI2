import { SelectInputField, type FieldOption } from '@/components/Forms/FormFields/FormFields';
import { TableListFilters } from '@/components/Tables/TableList/TableList';
import {
    AEE_WITHOUT_COURSE_OPTION,
    aeePresenceFilterOptions,
    aeeRecordFilterLabels,
} from '../AeeRecords.constants';
import type {
    AeeRecordFilterName,
    AeeRecordFilterOptions,
    AeeRecordFilters as AeeRecordFilterValues,
} from '../AeeRecords.types';

interface AeeRecordFiltersProps extends Partial<AeeRecordFilterOptions> {
    idPrefix: string;
    label: string;
    /** Filtros aceitos pela tela, na ordem de exibição. */
    fields: AeeRecordFilterName[];
    values: AeeRecordFilterValues;
    errors: Record<string, string | undefined>;
    onUpdate: (name: AeeRecordFilterName, value: string) => void;
    onClear: () => void;
    onSubmit: () => void;
}

/** Filtros das listagens de atendimentos; cada tela informa os campos que o controller aceita. */
export default function AeeRecordFilters({
    idPrefix,
    label,
    fields,
    values,
    errors,
    students = [],
    professionals = [],
    courses = [],
    onUpdate,
    onClear,
    onSubmit,
}: AeeRecordFiltersProps): React.JSX.Element {
    const options: Record<AeeRecordFilterName, FieldOption[]> = {
        student: students.map((student) => ({
            value: String(student.id),
            label: student.person?.name ?? `ID ${student.id}`,
        })),
        professional_id: professionals.map((professional) => ({
            value: String(professional.id),
            label: professional.person?.name ?? `ID ${professional.id}`,
        })),
        course_id: [
            AEE_WITHOUT_COURSE_OPTION,
            ...courses.map((course) => ({ value: String(course.id), label: course.name })),
        ],
        is_present: aeePresenceFilterOptions,
    };

    const renderFilter = (name: AeeRecordFilterName) => (
        <SelectInputField
            key={name}
            id={`${idPrefix}-filter-${name.replace('_', '-')}`}
            name={name}
            label={aeeRecordFilterLabels[name].label}
            placeholder={aeeRecordFilterLabels[name].placeholder}
            options={options[name]}
            value={values[name]}
            error={errors[name]}
            onChange={(value) => onUpdate(name, value)}
        />
    );
    const moreFilters = fields.length > 2 ? fields.slice(2).map(renderFilter) : undefined;

    return (
        <TableListFilters
            moreFilters={moreFilters}
            label={label}
            onClear={onClear}
            onSubmit={onSubmit}
        >
            {fields.slice(0, 2).map(renderFilter)}
        </TableListFilters>
    );
}

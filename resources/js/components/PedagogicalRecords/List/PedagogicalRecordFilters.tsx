import { SelectInputField, type FieldOption } from '@/components/Forms/FormFields/FormFields';
import { TableListFilters } from '@/components/Tables/TableList/TableList';
import { pedagogicalRecordFilterOptions } from '../PedagogicalRecords.constants';
import type {
    PedagogicalRecordFilterName,
    PedagogicalRecordFilters as PedagogicalRecordFilterValues,
    PedagogicalRecordOption,
} from '../PedagogicalRecords.types';

interface PedagogicalRecordFiltersProps {
    values: PedagogicalRecordFilterValues;
    students: PedagogicalRecordOption[];
    professionals: PedagogicalRecordOption[];
    courses: PedagogicalRecordOption[];
    /** Filtros sempre visíveis, na ordem exibida. */
    primary: PedagogicalRecordFilterName[];
    /** Filtros do acordeão "Mais filtros". */
    more?: PedagogicalRecordFilterName[];
    errors: Record<string, string | undefined>;
    onUpdate: (name: PedagogicalRecordFilterName, value: string) => void;
    onClear: () => void;
    onSubmit: () => void;
}

interface FilterConfig {
    label: string;
    placeholder: string;
    options: FieldOption[];
}

function stringOptions(records: PedagogicalRecordOption[]): FieldOption[] {
    return records.map((record) => ({ value: String(record.id), label: record.name }));
}

/** Filtros das listagens geral, pessoal e do histórico do aluno. */
export default function PedagogicalRecordFilters({
    values,
    students,
    professionals,
    courses,
    primary,
    more = [],
    errors,
    onUpdate,
    onClear,
    onSubmit,
}: PedagogicalRecordFiltersProps): React.JSX.Element {
    const fields: Record<PedagogicalRecordFilterName, FilterConfig> = {
        student: {
            label: 'Estudante',
            placeholder: 'Estudante (Todos)',
            options: stringOptions(students),
        },
        professional_id: {
            label: 'Profissional',
            placeholder: 'Profissional (Todos)',
            options: stringOptions(professionals),
        },
        course_id: {
            label: 'Curso',
            placeholder: 'Curso (Todos)',
            options: [pedagogicalRecordFilterOptions.withoutCourse, ...stringOptions(courses)],
        },
        is_present: {
            label: 'Presença',
            placeholder: 'Presença (Todas)',
            options: pedagogicalRecordFilterOptions.presence,
        },
        with_guardians: {
            label: 'Com responsáveis',
            placeholder: 'Com responsáveis (Todos)',
            options: pedagogicalRecordFilterOptions.guardians,
        },
    };

    function renderFilter(name: PedagogicalRecordFilterName): React.JSX.Element {
        const field = fields[name];

        return (
            <SelectInputField
                key={name}
                id={`pedagogical-record-filter-${name.replace('_', '-')}`}
                name={name}
                label={field.label}
                placeholder={field.placeholder}
                options={field.options}
                value={values[name]}
                error={errors[name]}
                onChange={(value) => onUpdate(name, value)}
            />
        );
    }

    const moreFilters = more.length ? more.map(renderFilter) : undefined;

    return (
        <TableListFilters
            label="Filtrar atendimentos pedagógicos"
            moreFilters={moreFilters}
            onClear={onClear}
            onSubmit={onSubmit}
        >
            {primary.map(renderFilter)}
        </TableListFilters>
    );
}

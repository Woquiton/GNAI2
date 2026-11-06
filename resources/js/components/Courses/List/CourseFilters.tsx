import { SelectInputField, TextInputField } from '@/components/Forms/FormFields/FormFields';
import { TableListFilters } from '@/components/Tables/TableList/TableList';
import { courseStatusOptions } from '../Courses.constants';
import type { CourseFilters as CourseFilterValues } from '../Courses.types';

interface CourseFiltersProps {
    values: CourseFilterValues;
    errors: Record<string, string | undefined>;
    onUpdate: (name: keyof CourseFilterValues, value: string) => void;
    onClear: () => void;
    onSubmit: () => void;
}

export default function CourseFilters({
    values,
    errors,
    onUpdate,
    onClear,
    onSubmit,
}: CourseFiltersProps): React.JSX.Element {
    return (
        <TableListFilters label="Filtrar cursos" onClear={onClear} onSubmit={onSubmit}>
            <TextInputField
                id="course-filter-name"
                name="name"
                label="Nome do Curso"
                maxLength={255}
                placeholder="Buscar por nome do curso..."
                value={values.name}
                error={errors.name}
                onChange={(value) => onUpdate('name', value)}
            />
            <SelectInputField
                id="course-filter-status"
                name="is_active"
                label="Status"
                placeholder="Todos"
                options={courseStatusOptions}
                value={values.is_active}
                error={errors.is_active}
                onChange={(value) => onUpdate('is_active', value)}
            />
        </TableListFilters>
    );
}

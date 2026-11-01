import { SelectInputField, TextInputField } from '@/components/Forms/FormFields/FormFields';
import { TableListFilters } from '@/components/Tables/TableList/TableList';
import { studentCourseStatusOptions } from '../StudentCourses.constants';
import type { StudentCourseFilters as StudentCourseFilterValues } from '../StudentCourses.types';

interface StudentCourseFiltersProps {
    values: StudentCourseFilterValues;
    courseOptions: { value: string; label: string }[];
    errors: Record<string, string | undefined>;
    onUpdate: (name: keyof StudentCourseFilterValues, value: string) => void;
    onClear: () => void;
    onSubmit: () => void;
}

export default function StudentCourseFilters({
    values,
    courseOptions,
    errors,
    onUpdate,
    onClear,
    onSubmit,
}: StudentCourseFiltersProps): React.JSX.Element {
    return (
        <TableListFilters label="Filtrar matrículas" onClear={onClear} onSubmit={onSubmit}>
            <SelectInputField
                id="student-course-filter-course"
                name="course_id"
                label="Curso (histórico)"
                placeholder="Todos"
                options={courseOptions}
                value={values.course_id}
                error={errors.course_id}
                onChange={(value) => onUpdate('course_id', value)}
            />
            <TextInputField
                id="student-course-filter-year"
                name="academic_year"
                label="Ano letivo"
                inputMode="numeric"
                maxLength={4}
                placeholder="Ano letivo"
                value={values.academic_year}
                error={errors.academic_year}
                onChange={(value) => onUpdate('academic_year', value)}
            />
            <SelectInputField
                id="student-course-filter-status"
                name="is_current"
                label="Status"
                placeholder="Todos"
                options={studentCourseStatusOptions}
                value={values.is_current}
                error={errors.is_current}
                onChange={(value) => onUpdate('is_current', value)}
            />
        </TableListFilters>
    );
}

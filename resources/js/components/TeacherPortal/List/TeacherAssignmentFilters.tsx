import { TextInputField } from '@/components/Forms/FormFields/FormFields';
import { TableListFilters } from '@/components/Tables/TableList/TableList';
import type { TeacherAssignmentFilters as FilterValues } from '../TeacherPortal.types';

interface TeacherAssignmentFiltersProps {
    values: FilterValues;
    errors: Record<string, string | undefined>;
    onUpdate: (name: keyof FilterValues, value: string) => void;
    onClear: () => void;
    onSubmit: () => void;
}

export default function TeacherAssignmentFilters({
    values,
    errors,
    onUpdate,
    onClear,
    onSubmit,
}: TeacherAssignmentFiltersProps): React.JSX.Element {
    return (
        <TableListFilters
            label="Filtrar meus alunos e adaptações"
            onClear={onClear}
            onSubmit={onSubmit}
        >
            <TextInputField
                id="teacher-assignment-filter-student"
                name="student"
                label="Aluno"
                placeholder="Filtrar por nome do aluno..."
                maxLength={255}
                value={values.student}
                error={errors.student}
                onChange={(value) => onUpdate('student', value)}
            />
            <TextInputField
                id="teacher-assignment-filter-discipline"
                name="discipline"
                label="Disciplina"
                placeholder="Filtrar por disciplina..."
                maxLength={255}
                value={values.discipline}
                error={errors.discipline}
                onChange={(value) => onUpdate('discipline', value)}
            />
            <TextInputField
                id="teacher-assignment-filter-course"
                name="course"
                label="Curso"
                placeholder="Filtrar por curso..."
                maxLength={255}
                value={values.course}
                error={errors.course}
                onChange={(value) => onUpdate('course', value)}
            />
        </TableListFilters>
    );
}

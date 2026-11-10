import TableListCreatedFilters from '@/components/Tables/TableList/TableListCreatedFilters';
import { TextInputField } from '@/components/Forms/FormFields/FormFields';
import { TableListFilters } from '@/components/Tables/TableList/TableList';
import type { TeacherFilters as TeacherFilterValues } from '../Teachers.types';

interface TeacherFiltersProps {
    values: TeacherFilterValues;
    errors: Record<string, string | undefined>;
    onUpdate: (name: keyof TeacherFilterValues, value: string) => void;
    onClear: () => void;
    onSubmit: () => void;
}

export default function TeacherFilters({
    values,
    errors,
    onUpdate,
    onClear,
    onSubmit,
}: TeacherFiltersProps): React.JSX.Element {
    return (
        <TableListFilters
            moreFilters={
                <>
                    <TextInputField
                        id="teachers-filter-course_name"
                        name="course_name"
                        label="Curso vinculado (qualquer semestre)"
                        maxLength={255}
                        value={values.course_name}
                        error={errors.course_name}
                        onChange={(value) => onUpdate('course_name', value)}
                    />
                    <TextInputField
                        id="teachers-filter-discipline_name"
                        name="discipline_name"
                        label="Disciplina vinculada (qualquer semestre)"
                        maxLength={255}
                        value={values.discipline_name}
                        error={errors.discipline_name}
                        onChange={(value) => onUpdate('discipline_name', value)}
                    />
                    <TableListCreatedFilters values={values} errors={errors} onUpdate={onUpdate} />
                </>
            }
            label="Filtrar professores"
            onClear={onClear}
            onSubmit={onSubmit}
        >
            <TextInputField
                id="teacher-filter-name"
                name="name"
                label="Nome do professor"
                maxLength={255}
                placeholder="Nome do professor..."
                value={values.name}
                error={errors.name}
                onChange={(value) => onUpdate('name', value)}
            />
            <TextInputField
                id="teacher-filter-email"
                name="email"
                label="E-mail"
                maxLength={255}
                placeholder="E-mail..."
                value={values.email}
                error={errors.email}
                onChange={(value) => onUpdate('email', value)}
            />
            <TextInputField
                id="teacher-filter-registration"
                name="registration"
                label="Matrícula"
                maxLength={50}
                placeholder="Matrícula..."
                value={values.registration}
                error={errors.registration}
                onChange={(value) => onUpdate('registration', value)}
            />
        </TableListFilters>
    );
}

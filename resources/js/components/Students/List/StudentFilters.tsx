import CheckboxSelect from '@/components/Forms/CheckboxSelect/CheckboxSelect';
import TableListCreatedFilters from '@/components/Tables/TableList/TableListCreatedFilters';
import { optionsFromRecord } from '@/components/Forms/FormFields/fieldOptions';
import {
    optionsFromNamed,
    SelectInputField,
    TextInputField,
} from '@/components/Forms/FormFields/FormFields';
import { TableListFilters } from '@/components/Tables/TableList/TableList';
import { studentWithoutCourseOption, studentWithoutProfileOption } from '../Students.constants';
import type { StudentFilters as StudentFilterValues, StudentIndexProps } from '../Students.types';

type StudentFiltersProps = Pick<
    StudentIndexProps,
    'courses' | 'deficiencies' | 'studentStatuses' | 'followUpTypes'
> & {
    values: StudentFilterValues;
    errors: Record<string, string | undefined>;
    onUpdate: (name: keyof StudentFilterValues, value: string) => void;
    onClear: () => void;
    onSubmit: () => void;
};

/** Nome, situação e curso visíveis; acompanhamento e contatos em "Mais filtros". */
export default function StudentFilters({
    courses,
    deficiencies,
    studentStatuses,
    followUpTypes,
    values,
    errors,
    onUpdate,
    onClear,
    onSubmit,
}: StudentFiltersProps): React.JSX.Element {
    const statusOptions = optionsFromRecord(studentStatuses);
    const courseOptions = [
        studentWithoutCourseOption,
        ...optionsFromNamed(courses).map(({ value, label }) => ({ value: String(value), label })),
    ];
    const profileOptions = [
        studentWithoutProfileOption,
        ...optionsFromNamed(deficiencies).map(({ value, label }) => ({
            value: String(value),
            label,
        })),
    ];
    const moreFilters = (
        <>
            <TextInputField
                id="filter-registration"
                name="registration"
                label="Matrícula"
                maxLength={50}
                placeholder="Matrícula..."
                value={values.registration}
                error={errors.registration}
                onChange={(value) => onUpdate('registration', value)}
            />
            <SelectInputField
                id="filter-follow_up_type"
                name="follow_up_type"
                label="Tipo de acompanhamento"
                placeholder="Tipo de acompanhamento (Todos)"
                options={[
                    ...optionsFromRecord(followUpTypes),
                    { value: 'not_informed', label: 'Não informado' },
                ]}
                value={values.follow_up_type}
                error={errors.follow_up_type}
                onChange={(value) => onUpdate('follow_up_type', value)}
            />
            <TextInputField
                id="filter-phone"
                name="phone"
                label="Telefone"
                maxLength={15}
                placeholder="Telefone..."
                value={values.phone}
                error={errors.phone}
                onChange={(value) => onUpdate('phone', value)}
            />
            <TextInputField
                id="filter-email"
                name="email"
                label="E-mail"
                maxLength={255}
                placeholder="E-mail..."
                value={values.email}
                error={errors.email}
                onChange={(value) => onUpdate('email', value)}
            />
            <CheckboxSelect
                id="filter-deficiency_id"
                name="deficiency_id"
                label="Perfil de atendimento"
                options={profileOptions}
                value={values.deficiency_id}
                error={errors.deficiency_id}
                onChange={(value) => onUpdate('deficiency_id', value)}
            />
        </>
    );

    return (
        <TableListFilters
            label="Filtrar alunos"
            moreFilters={
                <>
                    {moreFilters}
                    <TableListCreatedFilters values={values} errors={errors} onUpdate={onUpdate} />
                </>
            }
            onClear={onClear}
            onSubmit={onSubmit}
        >
            <TextInputField
                id="filter-name"
                name="name"
                label="Nome do aluno"
                maxLength={255}
                placeholder="Nome do aluno..."
                value={values.name}
                error={errors.name}
                onChange={(value) => onUpdate('name', value)}
            />
            <SelectInputField
                id="filter-status"
                name="status"
                label="Situação"
                placeholder="Situação (Todas)"
                options={statusOptions}
                value={values.status}
                error={errors.status}
                onChange={(value) => onUpdate('status', value)}
            />
            <SelectInputField
                id="filter-course_id"
                name="course_id"
                label="Curso"
                placeholder="Curso (Todos)"
                options={courseOptions}
                value={values.course_id}
                error={errors.course_id}
                onChange={(value) => onUpdate('course_id', value)}
            />
        </TableListFilters>
    );
}

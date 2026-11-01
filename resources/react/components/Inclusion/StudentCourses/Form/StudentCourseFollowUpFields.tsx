import {
    CheckboxListField,
    optionsFromNamed,
    TextAreaField,
} from '@/components/Forms/FormFields/FormFields';
import FormGrid, { FormGridWide } from '@/components/Forms/FormGrid/FormGrid';
import FormSection from '@/components/Forms/FormSection/FormSection';
import type { StudentCourseDiscipline } from '../StudentCourses.types';
import type { DisciplineGroupName, StudentCourseFormSectionProps } from './StudentCourseForm.types';

const disciplineGroups: { name: DisciplineGroupName; title: string }[] = [
    { name: 'failed_discipline_ids', title: 'Disciplinas com Reprovação' },
    { name: 'at_risk_discipline_ids', title: 'Disciplinas com Risco de Insucesso Acadêmico' },
];

/** Erro do grupo ou do primeiro item (`failed_discipline_ids.0`). */
function groupError(
    errors: Record<string, string | undefined>,
    name: DisciplineGroupName,
): string | undefined {
    return errors[name] ?? Object.entries(errors).find(([key]) => key.startsWith(`${name}.`))?.[1];
}

interface StudentCourseFollowUpFieldsProps extends StudentCourseFormSectionProps {
    /** Disciplinas do curso selecionado; `null` enquanto nenhum curso foi escolhido. */
    disciplines: StudentCourseDiscipline[] | null;
}

/** Frequência escolar e disciplinas com reprovação ou risco no curso atual. */
export default function StudentCourseFollowUpFields({
    form,
    errors,
    disabled,
    disciplines,
}: StudentCourseFollowUpFieldsProps): React.JSX.Element {
    const disciplineOptions = optionsFromNamed(disciplines ?? []);
    const emptyMessage =
        disciplines?.length === 0 ? (
            <p className="studentCourseForm__empty">Nenhuma disciplina vinculada ao curso.</p>
        ) : null;

    return (
        <FormSection
            id="student-course-follow-up"
            title="Acompanhamento Acadêmico do Curso Atual"
            variant="inline"
            iconClass="fa fa-line-chart"
        >
            <FormGrid>
                <FormGridWide>
                    <TextAreaField
                        id="student-course-attendance"
                        name="school_attendance_status"
                        label="Situação da Frequência Escolar"
                        rows={3}
                        placeholder="Descreva como está a frequência escolar do aluno neste curso..."
                        value={form.data.school_attendance_status}
                        error={errors.school_attendance_status}
                        onChange={(value) => form.setData('school_attendance_status', value)}
                    />
                </FormGridWide>
                {disciplines
                    ? disciplineGroups.map((group) => (
                          <CheckboxListField
                              key={group.name}
                              id={`student-course-${group.name.replace(/_/g, '-')}`}
                              name={group.name}
                              label={group.title}
                              options={disciplineOptions}
                              disabled={disabled}
                              value={form.data[group.name]}
                              error={groupError(errors, group.name)}
                              onChange={(values) => form.setData(group.name, values)}
                          >
                              {emptyMessage}
                          </CheckboxListField>
                      ))
                    : null}
            </FormGrid>
        </FormSection>
    );
}

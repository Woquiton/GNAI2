import {
    CheckboxListField,
    optionsFromNamed,
    RichTextField,
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
    onEditorFailure: () => void;
}

/** Frequência escolar e disciplinas com reprovação ou risco no curso atual. */
export default function StudentCourseFollowUpFields({
    form,
    errors,
    disabled,
    disciplines,
    onEditorFailure,
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
                    <RichTextField
                        id="student-course-attendance"
                        label="Situação da Frequência Escolar"
                        defaultValue={form.data.school_attendance_status}
                        height={120}
                        disabled={disabled}
                        error={errors.school_attendance_status}
                        onLoadError={onEditorFailure}
                        onChange={(html) => form.setData('school_attendance_status', html)}
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

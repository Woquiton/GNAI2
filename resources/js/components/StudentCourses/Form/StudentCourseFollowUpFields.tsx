import {
    CheckboxListField,
    optionsFromNamed,
    RichTextField,
} from '@/components/Forms/FormFields/FormFields';
import FormGrid, { FormGridWide } from '@/components/Forms/FormGrid/FormGrid';
import FormSection from '@/components/Forms/FormSection/FormSection';
import type { StudentCourseDependency, StudentCourseDiscipline } from '../StudentCourses.types';
import { STUDENT_COURSE_TOUR_TARGETS } from '../studentCourseTours';
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
    /** Rótulo do semestre escolhido na matrícula. */
    semesterLabel?: string;
    /** Reprovações de semestres anteriores ainda pendentes no semestre escolhido. */
    dependencies: StudentCourseDependency[];
    onEditorFailure: () => void;
}

/**
 * Frequência escolar, disciplinas com reprovação ou risco no semestre escolhido e dependências de
 * semestres anteriores aprovadas nele.
 */
export default function StudentCourseFollowUpFields({
    form,
    errors,
    disabled,
    disciplines,
    semesterLabel,
    dependencies,
    onEditorFailure,
}: StudentCourseFollowUpFieldsProps): React.JSX.Element {
    const disciplineOptions = optionsFromNamed(disciplines ?? []);
    const semesterHint = semesterLabel
        ? `Registrado no semestre ${semesterLabel}. Marque só as exceções: as demais disciplinas são consideradas sem reprovação.`
        : 'Escolha o semestre da matrícula para registrar reprovações e riscos.';
    const dependencyOptions = dependencies.map((dependency) => ({
        value: dependency.discipline_id,
        label: dependency.failed_semester_label
            ? `${dependency.name} (reprovada em ${dependency.failed_semester_label})`
            : dependency.name,
    }));
    const emptyMessage =
        disciplines?.length === 0 ? (
            <p className="studentCourseForm__empty">Nenhuma disciplina vinculada ao curso.</p>
        ) : null;

    return (
        <FormSection
            id="student-course-follow-up"
            title="Acompanhamento Acadêmico no Semestre"
            variant="inline"
            iconClass="fa fa-line-chart"
            tourTarget={STUDENT_COURSE_TOUR_TARGETS.formFollowUp}
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
                              hint={semesterHint}
                              value={form.data[group.name]}
                              error={groupError(errors, group.name)}
                              onChange={(values) => form.setData(group.name, values)}
                          >
                              {emptyMessage}
                          </CheckboxListField>
                      ))
                    : null}
                {dependencyOptions.length ? (
                    <FormGridWide>
                        <CheckboxListField
                            id="student-course-resolved-dependencies"
                            name="resolved_dependency_ids"
                            label="Dependências aprovadas neste semestre"
                            hint="Reprovações de semestres anteriores que ainda estão pendentes. Marque as que o aluno foi aprovado neste semestre."
                            options={dependencyOptions}
                            disabled={disabled}
                            value={form.data.resolved_dependency_ids}
                            error={
                                errors.resolved_dependency_ids ??
                                Object.entries(errors).find(([key]) =>
                                    key.startsWith('resolved_dependency_ids.'),
                                )?.[1]
                            }
                            onChange={(values) => form.setData('resolved_dependency_ids', values)}
                        />
                    </FormGridWide>
                ) : null}
            </FormGrid>
        </FormSection>
    );
}

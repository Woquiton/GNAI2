import { useForm } from '@inertiajs/react';
import FormActions from '@/components/Forms/FormActions/FormActions';
import FieldError from '@/components/Forms/FormField/FieldError';
import FormLayout from '@/components/Forms/FormLayout/FormLayout';
import { useFormSubmission } from '@/components/Forms/FormLayout/useFormSubmission';
import FormSection from '@/components/Forms/FormSection/FormSection';
import Button from '@/components/UI/Button/Button';
import CardBox from '@/components/UI/CardBox/CardBox';
import { teacherUrls } from '@/components/Inclusion/Teachers/Teachers.routes';
import type { TeacherDisciplinesProps } from '@/components/Inclusion/Teachers/Teachers.types';
import TeacherSelectionGroup from './TeacherSelectionGroup';

export default function TeacherDisciplinesForm({
    teacher,
    courses,
    selectedByCourse,
}: TeacherDisciplinesProps): React.JSX.Element {
    const availableCourses = courses.filter((course) => course.disciplines.length > 0);
    // Como no formulário legado, envia somente disciplinas ativas dos cursos disponíveis.
    const initialAssignments = Object.fromEntries(
        availableCourses.map((course) => {
            const selected = (selectedByCourse[course.id] ?? []).map(Number);
            return [
                course.id,
                course.disciplines
                    .filter((discipline) => selected.includes(discipline.id))
                    .map((discipline) => discipline.id),
            ];
        }),
    );
    const form = useForm<{ assignments: Record<string, number[]> }>({
        assignments: initialAssignments,
    });
    const submission = useFormSubmission(form);
    const errors = form.errors as Record<string, string | undefined>;

    function toggle(courseId: number, ids: number[], checked: boolean): void {
        form.setData((data) => {
            const selected = data.assignments[courseId] ?? [];
            return {
                assignments: {
                    ...data.assignments,
                    [courseId]: checked
                        ? [...new Set([...selected, ...ids])]
                        : selected.filter((id) => !ids.includes(id)),
                },
            };
        });
    }

    return (
        <FormLayout
            ref={submission.formRef}
            aria-label="Matriz curricular do professor"
            aria-busy={form.processing}
            onSubmit={(event) => {
                event.preventDefault();
                submission.submit({
                    url: teacherUrls.disciplines(teacher.id),
                    method: 'put',
                    failureText: 'Não foi possível salvar a matriz curricular. Tente novamente.',
                });
            }}
        >
            <CardBox>
                <FormSection
                    id="teacher-disciplines"
                    title="Atribuição de disciplinas por curso"
                    variant="inline"
                    iconClass="fa fa-book"
                >
                    <p>Selecione as disciplinas deste professor em cada curso.</p>
                    <FieldError id="teacher-assignments" error={errors.assignments} />
                    {availableCourses.length === 0 ? (
                        <p>Nenhum curso ou disciplina disponível para atribuição.</p>
                    ) : null}
                </FormSection>
                {availableCourses.map((course) => {
                    const selected = form.data.assignments[course.id] ?? [];
                    const itemErrors = Object.fromEntries(
                        selected.map((id, index) => [
                            id,
                            errors[`assignments.${course.id}.${index}`],
                        ]),
                    );
                    return (
                        <TeacherSelectionGroup
                            key={course.id}
                            id={`teacher-course-${course.id}`}
                            title={course.name}
                            iconClass="fa fa-graduation-cap"
                            name={`assignments[${course.id}]`}
                            options={course.disciplines}
                            selected={selected}
                            error={errors[`assignments.${course.id}`] ?? errors.assignments}
                            errorId={
                                errors[`assignments.${course.id}`]
                                    ? undefined
                                    : 'teacher-assignments-error'
                            }
                            itemErrors={itemErrors}
                            disabled={form.processing}
                            onChange={(ids, checked) => toggle(course.id, ids, checked)}
                        />
                    );
                })}
            </CardBox>
            <FormActions status={form.processing ? 'Salvando matriz curricular...' : undefined}>
                <Button
                    href={teacherUrls.show(teacher.id)}
                    tone="cancel"
                    label="Cancelar"
                    disabled={form.processing}
                />
                <Button
                    type="submit"
                    tone="save"
                    label="Salvar"
                    title="Salvar matriz curricular"
                    disabled={form.processing}
                />
            </FormActions>
        </FormLayout>
    );
}

import { router, useForm } from '@inertiajs/react';
import FormActions from '@/components/Forms/FormActions/FormActions';
import FieldError from '@/components/Forms/FormField/FieldError';
import { SelectInputField } from '@/components/Forms/FormFields/FormFields';
import FormLayout from '@/components/Forms/FormLayout/FormLayout';
import { useFormSubmission } from '@/components/Forms/FormLayout/useFormSubmission';
import FormSection from '@/components/Forms/FormSection/FormSection';
import Button from '@/components/UI/Button/Button';
import CardBox from '@/components/UI/CardBox/CardBox';
import ConfirmActionModal from '@/components/UI/ConfirmActionModal/ConfirmActionModal';
import { useConfirmedAction } from '@/components/UI/ConfirmActionModal/useConfirmedAction';
import { teacherUrls } from '@/components/Inclusion/Teachers/Teachers.routes';
import type {
    TeacherDisciplinesProps,
    TeacherSemesterOption,
} from '@/components/Inclusion/Teachers/Teachers.types';
import TeacherSelectionGroup from './TeacherSelectionGroup';

export default function TeacherDisciplinesForm({
    teacher,
    courses,
    selectedByCourse,
    semesters,
    semester,
    previousSemester,
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
    const form = useForm<{ semester_id: string; assignments: Record<string, number[]> }>({
        semester_id: semester ? String(semester.id) : '',
        assignments: initialAssignments,
    });
    const submission = useFormSubmission(form);
    const copy = useConfirmedAction<TeacherSemesterOption>({
        failureText: 'Não foi possível copiar os vínculos. Tente novamente.',
    });
    const errors = form.errors as Record<string, string | undefined>;
    const semesterOptions = semesters.map((option) => ({
        value: String(option.id),
        label: option.label,
    }));
    const busy = form.processing || copy.processing;

    function changeSemester(value: string): void {
        if (value && value !== form.data.semester_id) {
            router.get(teacherUrls.disciplinesInSemester(teacher.id, Number(value)));
        }
    }

    function confirmCopy(): void {
        if (semester) {
            copy.submit('post', teacherUrls.copyDisciplines(teacher.id), {
                semester_id: semester.id,
            });
        }
    }

    function toggle(courseId: number, ids: number[], checked: boolean): void {
        form.setData((data) => {
            const selected = data.assignments[courseId] ?? [];
            return {
                ...data,
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
                    id="teacher-disciplines-semester"
                    title="Semestre letivo"
                    variant="inline"
                    iconClass="fa fa-calendar"
                >
                    {semester ? (
                        <>
                            <SelectInputField
                                id="teacher-disciplines-semester-select"
                                name="semester_id"
                                label="Semestre dos vínculos"
                                hint="Os vínculos valem para o semestre escolhido. Ao trocar de semestre, as alterações não salvas são descartadas."
                                required
                                options={semesterOptions}
                                placeholder={null}
                                disabled={busy}
                                value={form.data.semester_id}
                                error={errors.semester_id}
                                onChange={changeSemester}
                            />
                            {previousSemester ? (
                                <Button
                                    type="button"
                                    tone="white"
                                    labelIconClass="fa fa-copy"
                                    disabled={busy}
                                    onClick={() => copy.open(previousSemester)}
                                >
                                    {`Copiar vínculos de ${previousSemester.label}`}
                                </Button>
                            ) : null}
                        </>
                    ) : (
                        <p>
                            Cadastre um semestre letivo antes de atribuir disciplinas ao professor.
                        </p>
                    )}
                </FormSection>
                <FormSection
                    id="teacher-disciplines"
                    title="Atribuição de disciplinas por curso"
                    variant="inline"
                    iconClass="fa fa-book"
                >
                    <p>
                        {semester
                            ? `Selecione as disciplinas deste professor em cada curso no semestre ${semester.label}.`
                            : 'Selecione as disciplinas deste professor em cada curso.'}
                    </p>
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
                            disabled={busy || !semester}
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
                    disabled={busy}
                />
                <Button
                    type="submit"
                    tone="save"
                    label="Salvar"
                    title="Salvar matriz curricular"
                    disabled={busy || !semester}
                />
            </FormActions>
            <ConfirmActionModal
                open={Boolean(copy.target)}
                title="Copiar vínculos do semestre anterior"
                message={
                    copy.target && semester
                        ? `Copiar as disciplinas que ${teacher.person.name} tinha em ${copy.target.label} para ${semester.label}? Os vínculos já existentes em ${semester.label} são mantidos.`
                        : ''
                }
                details="Vínculos com cursos ou disciplinas inativos, ou com disciplinas que saíram da matriz, não são copiados. Alterações não salvas nesta tela são descartadas."
                processing={copy.processing}
                confirmLabel="Copiar vínculos"
                processingLabel="Copiando vínculos..."
                onClose={copy.close}
                onConfirm={confirmCopy}
            />
        </FormLayout>
    );
}

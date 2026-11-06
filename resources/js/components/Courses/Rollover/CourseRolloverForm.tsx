import { router, useForm } from '@inertiajs/react';
import ChoiceControl from '@/components/Forms/ChoiceControl/ChoiceControl';
import ChoiceGroup from '@/components/Forms/ChoiceGroup/ChoiceGroup';
import FormActions from '@/components/Forms/FormActions/FormActions';
import FieldError from '@/components/Forms/FormField/FieldError';
import { SelectInputField } from '@/components/Forms/FormFields/FormFields';
import FormLayout from '@/components/Forms/FormLayout/FormLayout';
import { useFormSubmission } from '@/components/Forms/FormLayout/useFormSubmission';
import FormSection from '@/components/Forms/FormSection/FormSection';
import { coursePeriodLabel, coursePeriodOptions } from '@/components/coursePeriods';
import Button from '@/components/UI/Button/Button';
import CardBox from '@/components/UI/CardBox/CardBox';
import EmptyText from '@/components/UI/EmptyText/EmptyText';
import InlineAlert from '@/components/UI/InlineAlert/InlineAlert';
import { COURSE_TOUR_TARGETS } from '../courseTours';
import { courseUrls } from '../Courses.routes';
import type {
    CourseRolloverAction,
    CourseRolloverProps,
    CourseRolloverStudent,
} from '../Courses.types';
import '@styles/components/Courses/Rollover/CourseRolloverForm.css';

type RolloverRow = { action: CourseRolloverAction; course_period: string };

type RolloverFormData = {
    semester_id: string;
    rows: Record<string, RolloverRow>;
};

/** Período resultante da ação; nulo quando depende de escolha (aluno sem período anterior). */
function resultingPeriod(
    student: CourseRolloverStudent,
    action: CourseRolloverAction,
): number | null {
    if (action === 'skip' || student.previous_period === null) {
        return null;
    }

    return action === 'advance' ? student.previous_period + 1 : student.previous_period;
}

function actionLabels(student: CourseRolloverStudent): Record<CourseRolloverAction, string> {
    const advance = resultingPeriod(student, 'advance');
    const retain = resultingPeriod(student, 'retain');

    return {
        advance: advance ? `Avança para o ${coursePeriodLabel(advance)}` : 'Avança',
        retain: retain ? `Permanece no ${coursePeriodLabel(retain)}` : 'Permanece',
        skip: 'Não registrar',
    };
}

function previousText(student: CourseRolloverStudent): string {
    return student.previous_period && student.previous_semester_label
        ? `${coursePeriodLabel(student.previous_period)} em ${student.previous_semester_label}`
        : 'Sem período registrado em semestres anteriores';
}

interface RolloverStudentRowProps {
    student: CourseRolloverStudent;
    index: number;
    row: RolloverRow;
    semesterLabel: string;
    periodOptions: ReturnType<typeof coursePeriodOptions>;
    errors: Record<string, string | undefined>;
    disabled: boolean;
    onChange: (row: RolloverRow) => void;
}

/** Um aluno: período anterior, situação no novo semestre e, sem histórico, o período escolhido. */
function RolloverStudentRow({
    student,
    index,
    row,
    semesterLabel,
    periodOptions,
    errors,
    disabled,
    onChange,
}: RolloverStudentRowProps): React.JSX.Element {
    const id = `course-rollover-${student.student_course_id}`;
    const labels = actionLabels(student);
    const actionError = errors[`rows.${index}.action`];
    const periodError = errors[`rows.${index}.course_period`];
    const needsPeriod = student.previous_period === null && row.action !== 'skip';

    return (
        <li
            className="courseRollover__row"
            data-tour={index === 0 ? COURSE_TOUR_TARGETS.rolloverStudent : undefined}
        >
            <div className="courseRollover__student">
                <strong>{student.student_name}</strong>
                {student.registration ? <span>Matrícula {student.registration}</span> : null}
                <span>Antes: {previousText(student)}</span>
                {student.target_period ? (
                    <span>
                        Já registrado em {semesterLabel}: {coursePeriodLabel(student.target_period)}
                    </span>
                ) : null}
            </div>
            <div className="courseRollover__choices">
                <ChoiceGroup
                    id={`${id}-action`}
                    label={`Situação de ${student.student_name} em ${semesterLabel}`}
                    invalid={Boolean(actionError)}
                    describedBy={actionError ? `${id}-action-error` : undefined}
                >
                    {(Object.keys(labels) as CourseRolloverAction[]).map((action) => (
                        <ChoiceControl
                            key={action}
                            id={`${id}-${action}`}
                            type="radio"
                            name={`rows[${index}][action]`}
                            value={action}
                            label={labels[action]}
                            tone="purple"
                            inline
                            checked={row.action === action}
                            disabled={disabled}
                            onChange={(checked) => {
                                if (checked) onChange({ ...row, action });
                            }}
                        />
                    ))}
                </ChoiceGroup>
                <FieldError id={`${id}-action`} error={actionError} />
                {needsPeriod ? (
                    <SelectInputField
                        id={`${id}-period`}
                        name={`rows[${index}][course_period]`}
                        label={`Período em ${semesterLabel}`}
                        required
                        options={periodOptions.filter((option) => option.value !== '')}
                        searchable={false}
                        disabled={disabled}
                        value={row.course_period}
                        error={periodError}
                        onChange={(coursePeriod) =>
                            onChange({ ...row, course_period: coursePeriod })
                        }
                    />
                ) : null}
            </div>
        </li>
    );
}

/**
 * Virada de semestre em lote: todos os alunos ativos do curso avançam um período por padrão; a equipe
 * marca só as exceções (quem permanece no mesmo período ou não deve ser registrado).
 */
export default function CourseRolloverForm({
    course,
    semesters,
    semester,
    maxCoursePeriod,
    students,
}: CourseRolloverProps): React.JSX.Element {
    const form = useForm<RolloverFormData>({
        semester_id: semester ? String(semester.id) : '',
        rows: Object.fromEntries(
            students.map((student) => [
                String(student.student_course_id),
                { action: student.default_action, course_period: '' },
            ]),
        ),
    });
    const submission = useFormSubmission(form);
    const errors = form.errors as Record<string, string | undefined>;
    const semesterLabel = semester?.label ?? '';
    const periodOptions = coursePeriodOptions(maxCoursePeriod);
    const semesterOptions = semesters.map((option) => ({
        value: String(option.id),
        label: option.label,
    }));
    const registeredCount = students.filter(
        (student) => form.data.rows[String(student.student_course_id)]?.action !== 'skip',
    ).length;
    const status = form.processing ? 'Registrando alunos no semestre…' : undefined;

    function rowOf(student: CourseRolloverStudent): RolloverRow {
        return (
            form.data.rows[String(student.student_course_id)] ?? {
                action: student.default_action,
                course_period: '',
            }
        );
    }

    function updateRow(student: CourseRolloverStudent, row: RolloverRow): void {
        form.setData((data) => ({
            ...data,
            rows: { ...data.rows, [String(student.student_course_id)]: row },
        }));
    }

    function markAll(action: CourseRolloverAction): void {
        form.setData((data) => ({
            ...data,
            rows: Object.fromEntries(
                Object.entries(data.rows).map(([key, row]) => [key, { ...row, action }]),
            ),
        }));
    }

    function changeSemester(value: string): void {
        if (value && value !== form.data.semester_id) {
            router.get(courseUrls.rolloverInSemester(course.id, Number(value)));
        }
    }

    function submit(event: React.FormEvent<HTMLFormElement>): void {
        event.preventDefault();
        submission.submit({
            url: courseUrls.rolloverStore(course.id),
            // As linhas seguem a ordem da lista, para os erros (`rows.0.course_period`) apontarem o aluno.
            transform: (data) => {
                const formData = data as RolloverFormData;

                return {
                    semester_id: formData.semester_id,
                    rows: students.map((student) => {
                        const row = formData.rows[String(student.student_course_id)];

                        return {
                            student_course_id: student.student_course_id,
                            action: row?.action ?? student.default_action,
                            course_period: row?.course_period ?? '',
                        };
                    }),
                };
            },
            failureText: 'Não foi possível registrar os alunos no semestre. Tente novamente.',
        });
    }

    const content = students.length ? (
        <>
            <div className="courseRollover__bulk" data-tour={COURSE_TOUR_TARGETS.rolloverBulk}>
                <Button
                    type="button"
                    tone="white"
                    labelIconClass="fa fa-forward"
                    disabled={form.processing}
                    onClick={() => markAll('advance')}
                >
                    Todos avançam
                </Button>
                <Button
                    type="button"
                    tone="white"
                    labelIconClass="fa fa-ban"
                    disabled={form.processing}
                    onClick={() => markAll('skip')}
                >
                    Nenhum registrado
                </Button>
                <span role="status">
                    {registeredCount === 1
                        ? `1 aluno será registrado em ${semesterLabel}.`
                        : `${registeredCount} alunos serão registrados em ${semesterLabel}.`}
                </span>
            </div>
            <FieldError id="course-rollover-rows" error={errors.rows} />
            <ul className="courseRollover">
                {students.map((student, index) => (
                    <RolloverStudentRow
                        key={student.student_course_id}
                        student={student}
                        index={index}
                        row={rowOf(student)}
                        semesterLabel={semesterLabel}
                        periodOptions={periodOptions}
                        errors={errors}
                        disabled={form.processing}
                        onChange={(row) => updateRow(student, row)}
                    />
                ))}
            </ul>
        </>
    ) : (
        <EmptyText>Nenhum aluno ativo com matrícula vigente neste curso.</EmptyText>
    );

    return (
        <FormLayout
            ref={submission.formRef}
            aria-label={`Virada de semestre do curso ${course.name}`}
            aria-busy={form.processing}
            onSubmit={submit}
        >
            <CardBox>
                <FormSection
                    id="course-rollover-semester"
                    title="Semestre de Destino"
                    variant="inline"
                    iconClass="fa fa-calendar"
                    tourTarget={COURSE_TOUR_TARGETS.rolloverSemester}
                >
                    {semester ? (
                        <SelectInputField
                            id="course-rollover-semester-select"
                            name="semester_id"
                            label="Registrar os alunos em"
                            hint="Ao trocar de semestre, as escolhas não salvas são descartadas."
                            required
                            options={semesterOptions}
                            placeholder={null}
                            disabled={form.processing}
                            value={form.data.semester_id}
                            error={errors.semester_id}
                            onChange={changeSemester}
                        />
                    ) : (
                        <EmptyText>Cadastre um semestre letivo antes da virada.</EmptyText>
                    )}
                    <InlineAlert variant="info">
                        Por padrão, todos os alunos avançam um período. Marque só as exceções: quem
                        permanece no mesmo período ou quem não deve ser registrado, como alunos que
                        trancaram. Reprovações e dependências continuam sendo informadas na
                        matrícula de cada aluno.
                    </InlineAlert>
                </FormSection>
                {semester ? (
                    <FormSection
                        id="course-rollover-students"
                        title="Alunos do Curso"
                        variant="inline"
                        iconClass="fa fa-users"
                        tourTarget={COURSE_TOUR_TARGETS.rolloverStudents}
                    >
                        <fieldset disabled={form.processing}>{content}</fieldset>
                    </FormSection>
                ) : null}
            </CardBox>
            <FormActions status={status} tourTarget={COURSE_TOUR_TARGETS.rolloverActions}>
                <Button
                    href={courseUrls.show(course.id)}
                    tone="cancel"
                    label="Cancelar"
                    aria-label="Cancelar e voltar ao curso"
                    disabled={form.processing}
                />
                {semester && students.length ? (
                    <Button
                        type="submit"
                        tone="save"
                        label="Salvar"
                        title={`Registrar alunos em ${semesterLabel}`}
                        aria-label={`Registrar alunos em ${semesterLabel}`}
                        disabled={form.processing || registeredCount === 0}
                    />
                ) : null}
            </FormActions>
        </FormLayout>
    );
}

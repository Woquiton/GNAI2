import { useForm } from '@inertiajs/react';
import FormActions from '@/components/Forms/FormActions/FormActions';
import FormField from '@/components/Forms/FormField/FormField';
import FormLayout from '@/components/Forms/FormLayout/FormLayout';
import { useFormSubmission } from '@/components/Forms/FormLayout/useFormSubmission';
import FormSection from '@/components/Forms/FormSection/FormSection';
import SelectField from '@/components/Forms/SelectField/SelectField';
import { coursePeriodLabel } from '@/components/Inclusion/coursePeriods';
import Button from '@/components/UI/Button/Button';
import CardBox from '@/components/UI/CardBox/CardBox';
import InlineAlert from '@/components/UI/InlineAlert/InlineAlert';
import { PEI_DISCIPLINE_BULK_FAILURE_TEXT } from '../../Peis.constants';
import { peiDisciplineUrls, peiUrls } from '../../Peis.routes';
import type { PeiBulkDiscipline, PeiDisciplineBulkProps } from '../../Peis.types';
import './PeiDisciplineBulkForm.css';
import EmptyText from '@/components/UI/EmptyText/EmptyText';

type BulkAssignForm = {
    teacher_ids: Record<string, string>;
};

interface BulkDisciplineRowProps {
    discipline: PeiBulkDiscipline;
    value: string;
    disabled: boolean;
    onChange: (teacherId: string) => void;
}

/** Disciplina com o professor responsável, ou o aviso quando não há professor na matriz. */
function BulkDisciplineRow({
    discipline,
    value,
    disabled,
    onChange,
}: BulkDisciplineRowProps): React.JSX.Element {
    const id = `pei-discipline-teacher-${discipline.id}`;
    const details = [
        discipline.course_period ? coursePeriodLabel(discipline.course_period) : null,
        discipline.dependency_semester_label
            ? `dependência, reprovada em ${discipline.dependency_semester_label}`
            : null,
    ].filter(Boolean);
    const label = details.length ? `${discipline.name} (${details.join('; ')})` : discipline.name;
    const control = discipline.teachers.length ? (
        <SelectField
            id={id}
            name={`teacher_ids[${discipline.id}]`}
            label={discipline.name}
            placeholder="Selecione o professor..."
            value={value}
            options={discipline.teachers}
            disabled={disabled}
            onChange={(event) => onChange(event.target.value)}
        />
    ) : (
        <EmptyText id={id}>
            <i className="fa fa-exclamation-triangle" aria-hidden="true" /> Nenhum professor
            vinculado a esta disciplina neste curso no semestre do PEI.
        </EmptyText>
    );

    return (
        <li className="peiDisciplineBulk__row">
            <FormField id={id} label={label} layout="horizontal">
                {control}
            </FormField>
        </li>
    );
}

/** Mensagem sobre a sugestão das disciplinas pelo período do aluno e pelas dependências. */
function suggestionNotice(
    studentPeriod: number | null,
    semesterLabel: string | null,
    hasPeriodSuggestions: boolean,
    dependencyCount: number,
): string {
    const semester = semesterLabel ?? 'do PEI';
    const dependencies = dependencyCount
        ? ` ${dependencyCount === 1 ? 'Uma dependência pendente também aparece' : `${dependencyCount} dependências pendentes também aparecem`} entre as sugeridas.`
        : '';

    if (studentPeriod === null) {
        return `O período do curso do aluno no semestre ${semester} não foi informado na matrícula, então as disciplinas não são sugeridas pelo período.${dependencies}`;
    }

    return hasPeriodSuggestions
        ? `O aluno está no ${coursePeriodLabel(studentPeriod)} em ${semester}. As disciplinas desse período aparecem primeiro.${dependencies}`
        : `O aluno está no ${coursePeriodLabel(studentPeriod)} em ${semester}, mas nenhuma disciplina sem adaptação está marcada com esse período na matriz do curso.${dependencies}`;
}

/**
 * Atribuição em lote: para cada disciplina do curso ainda sem adaptação,
 * escolhe-se o professor responsável. As disciplinas do período do aluno vêm
 * primeiro. O conteúdo pedagógico de cada adaptação é preenchido depois,
 * individualmente.
 */
export default function PeiDisciplineBulkForm({
    pei,
    semesterLabel,
    studentPeriod,
    disciplines,
}: PeiDisciplineBulkProps): React.JSX.Element {
    const form = useForm<BulkAssignForm>({ teacher_ids: {} });
    const submission = useFormSubmission(form);
    const hasDisciplines = disciplines.length > 0;
    const status = form.processing ? 'Salvando adaptações…' : undefined;

    function submit(event: React.FormEvent<HTMLFormElement>): void {
        event.preventDefault();
        submission.submit({
            url: peiDisciplineUrls.store(pei.id),
            failureText: PEI_DISCIPLINE_BULK_FAILURE_TEXT,
        });
    }

    function selectTeacher(disciplineId: number, teacherId: string): void {
        form.setData('teacher_ids', {
            ...form.data.teacher_ids,
            [disciplineId]: teacherId,
        });
    }

    const suggested = disciplines.filter((discipline) => discipline.suggested);
    const others = disciplines.filter((discipline) => !discipline.suggested);

    function rows(items: PeiBulkDiscipline[]): React.JSX.Element {
        return (
            <ul className="peiDisciplineBulk">
                {items.map((discipline) => (
                    <BulkDisciplineRow
                        key={discipline.id}
                        discipline={discipline}
                        value={form.data.teacher_ids[discipline.id] ?? ''}
                        disabled={form.processing}
                        onChange={(teacherId) => selectTeacher(discipline.id, teacherId)}
                    />
                ))}
            </ul>
        );
    }

    const content = hasDisciplines ? (
        <>
            <InlineAlert variant="info">
                {suggestionNotice(
                    studentPeriod,
                    semesterLabel,
                    suggested.some(
                        (discipline) =>
                            studentPeriod !== null && discipline.course_period === studentPeriod,
                    ),
                    suggested.filter((discipline) => discipline.dependency_semester_label).length,
                )}
            </InlineAlert>
            {suggested.length ? rows(suggested) : null}
        </>
    ) : (
        <InlineAlert variant="info">
            Todas as disciplinas do curso já possuem uma adaptação cadastrada neste PEI.
        </InlineAlert>
    );

    return (
        <FormLayout
            ref={submission.formRef}
            aria-label="Cadastrar adaptações curriculares"
            aria-busy={form.processing}
            onSubmit={submit}
        >
            <CardBox>
                <fieldset disabled={form.processing}>
                    <FormSection
                        id="pei-discipline-identification"
                        title={
                            suggested.length ? 'Disciplinas Sugeridas' : 'Identificação da Disciplina'
                        }
                        variant="inline"
                        iconClass="fa fa-graduation-cap"
                    >
                        {content}
                    </FormSection>
                    {hasDisciplines && others.length ? (
                        <FormSection
                            id="pei-discipline-other-disciplines"
                            title={
                                suggested.length
                                    ? 'Outras Disciplinas do Curso'
                                    : 'Disciplinas do Curso'
                            }
                            variant="inline"
                            iconClass="fa fa-book"
                        >
                            {rows(others)}
                        </FormSection>
                    ) : null}
                </fieldset>
            </CardBox>
            <FormActions status={status}>
                <Button
                    href={peiUrls.showTab(pei.id, 'disciplines')}
                    tone="cancel"
                    label="Cancelar"
                    aria-label="Cancelar e voltar ao PEI"
                    disabled={form.processing}
                />
                {hasDisciplines ? (
                    <Button
                        type="submit"
                        tone="save"
                        label="Salvar"
                        title="Salvar adaptações"
                        aria-label="Salvar adaptações"
                        disabled={form.processing}
                    />
                ) : null}
            </FormActions>
        </FormLayout>
    );
}

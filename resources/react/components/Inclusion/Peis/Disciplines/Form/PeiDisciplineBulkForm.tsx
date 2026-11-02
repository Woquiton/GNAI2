import { useForm } from '@inertiajs/react';
import FormActions from '@/components/Forms/FormActions/FormActions';
import FormField from '@/components/Forms/FormField/FormField';
import FormLayout from '@/components/Forms/FormLayout/FormLayout';
import { useFormSubmission } from '@/components/Forms/FormLayout/useFormSubmission';
import FormSection from '@/components/Forms/FormSection/FormSection';
import SelectField from '@/components/Forms/SelectField/SelectField';
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
            vinculado a esta disciplina na matriz curricular.
        </EmptyText>
    );

    return (
        <li className="peiDisciplineBulk__row">
            <FormField id={id} label={discipline.name} layout="horizontal">
                {control}
            </FormField>
        </li>
    );
}

/**
 * Atribuição em lote: para cada disciplina do curso ainda sem adaptação,
 * escolhe-se o professor responsável. O conteúdo pedagógico de cada adaptação
 * é preenchido depois, individualmente.
 */
export default function PeiDisciplineBulkForm({
    pei,
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

    const content = hasDisciplines ? (
        <ul className="peiDisciplineBulk">
            {disciplines.map((discipline) => (
                <BulkDisciplineRow
                    key={discipline.id}
                    discipline={discipline}
                    value={form.data.teacher_ids[discipline.id] ?? ''}
                    disabled={form.processing}
                    onChange={(teacherId) => selectTeacher(discipline.id, teacherId)}
                />
            ))}
        </ul>
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
                        title="Identificação da Disciplina"
                        variant="inline"
                        iconClass="fa fa-graduation-cap"
                    >
                        {content}
                    </FormSection>
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

import { useForm } from '@inertiajs/react';
import FormActions from '@/components/Forms/FormActions/FormActions';
import { TextAreaField, TextInputField } from '@/components/Forms/FormFields/FormFields';
import FormGrid, { FormGridWide } from '@/components/Forms/FormGrid/FormGrid';
import FormLayout from '@/components/Forms/FormLayout/FormLayout';
import { useFormSubmission } from '@/components/Forms/FormLayout/useFormSubmission';
import FormSection from '@/components/Forms/FormSection/FormSection';
import Button from '@/components/UI/Button/Button';
import CardBox from '@/components/UI/CardBox/CardBox';
import { PEI_DISCIPLINE_UPDATE_FAILURE_TEXT } from '../../Peis.constants';
import { peiDisciplineUrls, peiUrls } from '../../Peis.routes';
import type { PeiDisciplineEditProps } from '../../Peis.types';
import type {
    PeiDisciplineFormData,
    PeiDisciplineTextFieldConfig,
} from './PeiDisciplineForm.types';
import { peiDisciplineFormData, peiDisciplineTextFields } from './peiDisciplineFields';

const keepReadOnly = (): void => undefined;

/**
 * Edição do planejamento de uma adaptação. A criação é feita em lote
 * (Disciplines/Create), só com disciplina e professor responsável.
 */
export default function PeiDisciplineForm({
    pei,
    peiDiscipline,
}: PeiDisciplineEditProps): React.JSX.Element {
    const form = useForm<PeiDisciplineFormData>(peiDisciplineFormData(peiDiscipline));
    const submission = useFormSubmission(form);
    const errors = form.errors as Partial<Record<keyof PeiDisciplineFormData, string>>;
    const status = form.processing ? 'Salvando alterações…' : undefined;

    function submit(event: React.FormEvent<HTMLFormElement>): void {
        event.preventDefault();
        submission.submit({
            url: peiDisciplineUrls.update(pei.id, peiDiscipline.id),
            method: 'put',
            failureText: PEI_DISCIPLINE_UPDATE_FAILURE_TEXT,
        });
    }

    function renderTextField(field: PeiDisciplineTextFieldConfig): React.JSX.Element {
        const id = `pei-discipline-${field.name.replace(/_/g, '-')}`;
        const common = {
            id,
            name: field.name,
            label: field.label,
            hint: field.hint,
            required: field.required,
            value: form.data[field.name],
            error: errors[field.name],
            onChange: (next: string) => form.setData(field.name, next),
        };
        const control = field.singleLine ? (
            <TextInputField key={field.name} {...common} maxLength={255} />
        ) : (
            <TextAreaField key={field.name} {...common} rows={4} />
        );

        return field.wide === false ? (
            control
        ) : (
            <FormGridWide key={field.name}>{control}</FormGridWide>
        );
    }

    return (
        <FormLayout
            ref={submission.formRef}
            aria-label="Editar adaptação curricular"
            aria-busy={form.processing}
            onSubmit={submit}
        >
            <CardBox>
                <fieldset disabled={form.processing}>
                    <FormSection
                        id="pei-discipline-identification"
                        title="Identificação (Somente Leitura)"
                        variant="inline"
                        iconClass="fa fa-graduation-cap"
                    >
                        <FormGrid columns={2}>
                            <TextInputField
                                id="pei-discipline-teacher"
                                name="teacher_display"
                                label="Professor Responsável"
                                value={peiDiscipline.teacher?.person?.name ?? ''}
                                error={errors.teacher_id}
                                disabled
                                readOnly
                                onChange={keepReadOnly}
                            />
                            <TextInputField
                                id="pei-discipline-discipline"
                                name="discipline_display"
                                label="Disciplina"
                                value={peiDiscipline.discipline?.name ?? ''}
                                error={errors.discipline_id}
                                disabled
                                readOnly
                                onChange={keepReadOnly}
                            />
                        </FormGrid>
                    </FormSection>
                    <FormSection
                        id="pei-discipline-planning"
                        title="Planejamento Adaptado"
                        variant="inline"
                        iconClass="fa fa-book"
                    >
                        <FormGrid columns={2}>
                            {peiDisciplineTextFields.map(renderTextField)}
                        </FormGrid>
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
                <Button
                    type="submit"
                    tone="save"
                    label="Salvar"
                    title="Atualizar adaptação"
                    aria-label="Atualizar adaptação"
                    disabled={form.processing}
                />
            </FormActions>
        </FormLayout>
    );
}

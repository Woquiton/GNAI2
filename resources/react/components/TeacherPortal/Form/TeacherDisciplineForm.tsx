import FormActions from '@/components/Forms/FormActions/FormActions';
import { TextAreaField, TextInputField } from '@/components/Forms/FormFields/FormFields';
import FormGrid, { FormGridWide } from '@/components/Forms/FormGrid/FormGrid';
import FormLayout from '@/components/Forms/FormLayout/FormLayout';
import FormSection from '@/components/Forms/FormSection/FormSection';
import Button from '@/components/UI/Button/Button';
import CardBox from '@/components/UI/CardBox/CardBox';
import { TEACHER_DISCIPLINE_FIELDS } from '../TeacherPortal.constants';
import { teacherPortalUrls } from '../TeacherPortal.routes';
import type { TeacherPortalDisciplineEditProps } from '../TeacherPortal.types';
import type { TeacherDisciplineField } from './TeacherDisciplineForm.types';
import { useTeacherDisciplineForm } from './useTeacherDisciplineForm';

/** Adaptação da disciplina no PEI preenchida pelo professor vinculado. */
export default function TeacherDisciplineForm({
    peiDiscipline,
}: TeacherPortalDisciplineEditProps): React.JSX.Element {
    const { form, errors, formRef, save } = useTeacherDisciplineForm(peiDiscipline);
    const disciplineName = peiDiscipline.discipline_name ?? 'Disciplina';

    function renderField(field: TeacherDisciplineField): React.JSX.Element {
        const common = {
            id: `teacher-portal-${field.name.replace(/_/g, '-')}`,
            name: field.name,
            label: field.label,
            hint: field.hint,
            required: field.required,
            placeholder: field.placeholder,
            value: form.data[field.name],
            error: errors[field.name],
            onChange: (value: string) => form.setData(field.name, value),
        };

        return field.input ? (
            <TextInputField {...common} maxLength={255} />
        ) : (
            <TextAreaField {...common} rows={field.rows ?? 3} />
        );
    }

    return (
        <FormLayout
            ref={formRef}
            aria-label={`Editar adaptação de ${disciplineName}`}
            aria-busy={form.processing}
            onSubmit={(event) => {
                event.preventDefault();
                save();
            }}
        >
            <CardBox>
                <fieldset disabled={form.processing}>
                    <FormSection
                        id="teacher-portal-discipline-planning"
                        title="Planejamento Adaptado"
                        variant="inline"
                        iconClass="fa fa-book"
                    >
                        <FormGrid columns={2}>
                            {TEACHER_DISCIPLINE_FIELDS.map((field) => (
                                <FormGridWide key={field.name}>{renderField(field)}</FormGridWide>
                            ))}
                        </FormGrid>
                    </FormSection>
                </fieldset>
            </CardBox>
            <FormActions status={form.processing ? 'Salvando adaptação…' : undefined}>
                <Button
                    href={teacherPortalUrls.index}
                    tone="cancel"
                    label="Cancelar"
                    aria-label="Cancelar e voltar para meus alunos"
                    disabled={form.processing}
                />
                <Button
                    type="submit"
                    tone="save"
                    label="Salvar"
                    title="Salvar adaptação"
                    aria-label="Salvar adaptação"
                    disabled={form.processing}
                />
            </FormActions>
        </FormLayout>
    );
}

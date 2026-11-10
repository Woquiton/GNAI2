import FormActions from '@/components/Forms/FormActions/FormActions';
import {
    RichTextField,
    TextAreaField,
    TextInputField,
} from '@/components/Forms/FormFields/FormFields';
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
import { TEACHER_PORTAL_TOUR_TARGETS } from '../teacherPortalTours';

/** Adaptação da disciplina no PEI preenchida pelo professor vinculado. */
export default function TeacherDisciplineForm({
    peiDiscipline,
}: TeacherPortalDisciplineEditProps): React.JSX.Element {
    const { form, errors, formRef, save, editorFailed, reportEditorFailure } =
        useTeacherDisciplineForm(peiDiscipline);
    const disciplineName = peiDiscipline.discipline_name ?? 'Disciplina';

    function renderField(field: TeacherDisciplineField): React.JSX.Element {
        const id = `teacher-portal-${field.name.replace(/_/g, '-')}`;

        if (field.rich) {
            return (
                <RichTextField
                    id={id}
                    label={field.label}
                    hint={field.hint}
                    required={field.required}
                    defaultValue={form.data[field.name]}
                    height={120}
                    disabled={form.processing}
                    error={errors[field.name]}
                    onLoadError={() => reportEditorFailure(field.name, field.label.toLowerCase())}
                    onChange={(html) => form.setData(field.name, html)}
                />
            );
        }

        const common = {
            id,
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
                        tourTarget={TEACHER_PORTAL_TOUR_TARGETS.planning}
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
            <FormActions
                status={form.processing ? 'Salvando adaptação…' : undefined}
                tourTarget={TEACHER_PORTAL_TOUR_TARGETS.formActions}
            >
                <Button
                    href={teacherPortalUrls.studentPei(peiDiscipline.student_id)}
                    tone="cancel"
                    label="Cancelar"
                    title="Cancelar e voltar ao PEI do aluno"
                    aria-label="Cancelar e voltar ao PEI do aluno"
                    disabled={form.processing}
                />
                <Button
                    type="submit"
                    tone="save"
                    label="Salvar"
                    title="Salvar adaptação"
                    aria-label="Salvar adaptação"
                    disabled={form.processing || editorFailed}
                />
            </FormActions>
        </FormLayout>
    );
}

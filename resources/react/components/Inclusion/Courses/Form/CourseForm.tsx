import FormActions from '@/components/Forms/FormActions/FormActions';
import {
    SelectInputField,
    TextAreaField,
    TextInputField,
} from '@/components/Forms/FormFields/FormFields';
import FormGrid, { FormGridWide } from '@/components/Forms/FormGrid/FormGrid';
import FormLayout from '@/components/Forms/FormLayout/FormLayout';
import FormSection from '@/components/Forms/FormSection/FormSection';
import Button from '@/components/UI/Button/Button';
import CardBox from '@/components/UI/CardBox/CardBox';
import { courseStatusOptions } from '../Courses.constants';
import { courseUrls } from '../Courses.routes';
import type { CourseDisciplineOption, CourseRecord } from '../Courses.types';
import CourseCurriculumFields from './CourseCurriculumFields';
import { useCourseForm } from './useCourseForm';

interface CourseFormProps {
    disciplines: CourseDisciplineOption[];
    course?: CourseRecord;
}

function submissionStatus(processing: boolean, editing: boolean): string | undefined {
    if (!processing) {
        return undefined;
    }

    return editing ? 'Salvando alterações…' : 'Cadastrando curso…';
}

/** Cadastro e edição de cursos: dados básicos, status (na edição) e matriz curricular. */
export default function CourseForm({ disciplines, course }: CourseFormProps): React.JSX.Element {
    const { form, errors, disciplinesError, formRef, save } = useCourseForm(disciplines, course);
    const editing = Boolean(course);

    return (
        <FormLayout
            ref={formRef}
            aria-label={editing ? 'Editar curso' : 'Cadastrar curso'}
            aria-busy={form.processing}
            onSubmit={(event) => {
                event.preventDefault();
                save();
            }}
        >
            <CardBox>
                <fieldset disabled={form.processing}>
                    <FormSection
                        id="course-information"
                        title={editing ? 'Informações Básicas' : 'Dados do Curso'}
                        variant="inline"
                        iconClass="fa fa-university"
                    >
                        <FormGrid columns={2}>
                            <FormGridWide>
                                <TextInputField
                                    id="course-name"
                                    name="name"
                                    label="Nome do Curso"
                                    required
                                    maxLength={255}
                                    value={form.data.name}
                                    error={errors.name}
                                    onChange={(value) => form.setData('name', value)}
                                />
                            </FormGridWide>
                            <FormGridWide>
                                <TextAreaField
                                    id="course-description"
                                    name="description"
                                    label="Descrição"
                                    rows={4}
                                    value={form.data.description}
                                    error={errors.description}
                                    onChange={(value) => form.setData('description', value)}
                                />
                            </FormGridWide>
                            {editing ? (
                                <SelectInputField
                                    id="course-status"
                                    name="is_active"
                                    label="Status do Curso"
                                    required
                                    options={courseStatusOptions}
                                    value={form.data.is_active ?? ''}
                                    disabled={form.processing}
                                    error={errors.is_active}
                                    onChange={(value) => form.setData('is_active', value)}
                                />
                            ) : null}
                        </FormGrid>
                    </FormSection>
                    <CourseCurriculumFields
                        editing={editing}
                        disciplines={disciplines}
                        value={form.data.discipline_ids}
                        error={disciplinesError}
                        disabled={form.processing}
                        onChange={(ids) => form.setData('discipline_ids', ids)}
                    />
                </fieldset>
            </CardBox>
            <FormActions status={submissionStatus(form.processing, editing)}>
                <Button
                    href={course ? courseUrls.show(course.id) : courseUrls.index}
                    tone="cancel"
                    label="Cancelar"
                    aria-label="Cancelar e voltar"
                    disabled={form.processing}
                />
                <Button type="submit" tone="save" label="Salvar" disabled={form.processing} />
            </FormActions>
        </FormLayout>
    );
}

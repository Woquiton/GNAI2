import FormActions from '@/components/Forms/FormActions/FormActions';
import { RichTextField, TextInputField } from '@/components/Forms/FormFields/FormFields';
import FormGrid, { FormGridWide } from '@/components/Forms/FormGrid/FormGrid';
import FormLayout from '@/components/Forms/FormLayout/FormLayout';
import FormSection from '@/components/Forms/FormSection/FormSection';
import FieldError from '@/components/Forms/FormField/FieldError';
import { fieldErrorId } from '@/components/Forms/FormField/fieldDescription';
import ToggleControl from '@/components/Forms/ToggleControl/ToggleControl';
import Button from '@/components/UI/Button/Button';
import CardBox from '@/components/UI/CardBox/CardBox';
import { COURSE_TOUR_TARGETS } from '../courseTours';
import { courseUrls } from '../Courses.routes';
import type { CourseDisciplineOption, CourseRecord } from '../Courses.types';
import CourseCurriculumFields from './CourseCurriculumFields';
import { useCourseForm } from './useCourseForm';

interface CourseFormProps {
    disciplines: CourseDisciplineOption[];
    maxCoursePeriod: number;
    course?: CourseRecord;
}

function submissionStatus(processing: boolean, editing: boolean): string | undefined {
    if (!processing) {
        return undefined;
    }

    return editing ? 'Salvando alterações…' : 'Cadastrando curso…';
}

/** Cadastro e edição de cursos: dados básicos, status (na edição) e matriz curricular. */
export default function CourseForm({
    disciplines,
    maxCoursePeriod,
    course,
}: CourseFormProps): React.JSX.Element {
    const {
        form,
        errors,
        disciplinesError,
        disciplinePeriodErrors,
        formRef,
        save,
        editorFailed,
        reportEditorFailure,
    } = useCourseForm(disciplines, course);
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
                        title="Identificação"
                        variant="inline"
                        iconClass="fa fa-university"
                        tourTarget={COURSE_TOUR_TARGETS.information}
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
                                <RichTextField
                                    id="course-description"
                                    label="Descrição"
                                    defaultValue={form.data.description}
                                    height={120}
                                    disabled={form.processing}
                                    error={errors.description}
                                    onLoadError={() =>
                                        reportEditorFailure('description', 'descrição')
                                    }
                                    onChange={(html) => form.setData('description', html)}
                                />
                            </FormGridWide>
                            {editing ? (
                                <div data-tour={COURSE_TOUR_TARGETS.status}>
                                    <ToggleControl
                                        id="course-status"
                                        name="is_active"
                                        label="Curso Ativo"
                                        size="small"
                                        checked={form.data.is_active === '1'}
                                        disabled={form.processing}
                                        invalid={Boolean(errors.is_active)}
                                        describedBy={
                                            errors.is_active
                                                ? fieldErrorId('course-status')
                                                : undefined
                                        }
                                        onChange={(checked) =>
                                            form.setData('is_active', checked ? '1' : '0')
                                        }
                                    />
                                    <FieldError id="course-status" error={errors.is_active} />
                                </div>
                            ) : null}
                        </FormGrid>
                    </FormSection>
                    <CourseCurriculumFields
                        editing={editing}
                        disciplines={disciplines}
                        value={form.data.discipline_ids}
                        periods={form.data.discipline_periods}
                        maxCoursePeriod={maxCoursePeriod}
                        error={disciplinesError}
                        periodErrors={disciplinePeriodErrors}
                        disabled={form.processing}
                        onChange={(ids) => form.setData('discipline_ids', ids)}
                        onPeriodChange={(disciplineId, period) =>
                            form.setData((data) => ({
                                ...data,
                                discipline_periods: {
                                    ...data.discipline_periods,
                                    [String(disciplineId)]: period,
                                },
                            }))
                        }
                    />
                </fieldset>
            </CardBox>
            <FormActions
                status={submissionStatus(form.processing, editing)}
                tourTarget={COURSE_TOUR_TARGETS.formActions}
            >
                <Button
                    href={course ? courseUrls.show(course.id) : courseUrls.index}
                    tone="cancel"
                    label="Cancelar"
                    aria-label="Cancelar e voltar"
                    disabled={form.processing}
                />
                <Button
                    type="submit"
                    tone="save"
                    label="Salvar"
                    disabled={form.processing || editorFailed}
                />
            </FormActions>
        </FormLayout>
    );
}

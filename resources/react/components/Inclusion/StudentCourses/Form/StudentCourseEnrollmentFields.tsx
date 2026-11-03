import { fieldErrorId } from '@/components/Forms/FormField/fieldDescription';
import {
    SelectInputField,
    TextInputField,
    type FieldOption,
} from '@/components/Forms/FormFields/FormFields';
import FormGrid, { FormGridWide } from '@/components/Forms/FormGrid/FormGrid';
import FormSection from '@/components/Forms/FormSection/FormSection';
import ToggleControl from '@/components/Forms/ToggleControl/ToggleControl';
import { coursePeriodOptions } from '@/components/Inclusion/coursePeriods';
import { STUDENT_COURSE_TOUR_TARGETS } from '../studentCourseTours';
import type {
    StudentCourseFormMode,
    StudentCourseFormSectionProps,
} from './StudentCourseForm.types';

interface StudentCourseEnrollmentFieldsProps extends StudentCourseFormSectionProps {
    mode: StudentCourseFormMode;
    courseOptions: FieldOption[];
    semesterOptions: FieldOption[];
    maxCoursePeriod: number;
    onSemesterChange: (semesterId: string) => void;
    isCurrent: boolean;
    mustBeCurrent: boolean;
}

/** Curso (no cadastro), ano letivo, semestre, período do curso e definição do curso atual (no cadastro). */
export default function StudentCourseEnrollmentFields({
    form,
    errors,
    disabled,
    mode,
    courseOptions,
    semesterOptions,
    maxCoursePeriod,
    onSemesterChange,
    isCurrent,
    mustBeCurrent,
}: StudentCourseEnrollmentFieldsProps): React.JSX.Element {
    const creating = mode === 'create';
    const currentDescription = mustBeCurrent
        ? 'Este será o primeiro curso do aluno e precisa ser definido como atual.'
        : 'Ao marcar, o curso atual anterior será movido para o histórico.';

    return (
        <FormSection
            id="student-course-enrollment"
            title="Dados da Matrícula"
            variant="inline"
            iconClass="fa fa-graduation-cap"
            tourTarget={STUDENT_COURSE_TOUR_TARGETS.formEnrollment}
        >
            <FormGrid>
                {creating ? (
                    <SelectInputField
                        id="student-course-course"
                        name="course_id"
                        label="Curso / Série"
                        required
                        options={courseOptions}
                        disabled={disabled}
                        value={form.data.course_id}
                        error={errors.course_id}
                        onChange={(value) => form.setData('course_id', value)}
                    />
                ) : null}
                <TextInputField
                    id="student-course-academic-year"
                    name="academic_year"
                    type="number"
                    label="Ano Letivo"
                    required
                    inputMode="numeric"
                    value={form.data.academic_year}
                    error={errors.academic_year}
                    onChange={(value) => form.setData('academic_year', value)}
                />
                <SelectInputField
                    id="student-course-semester"
                    name="semester_id"
                    label="Semestre"
                    options={semesterOptions}
                    disabled={disabled}
                    value={form.data.semester_id}
                    error={errors.semester_id}
                    hint="Período do curso, reprovações e riscos são registrados neste semestre."
                    onChange={onSemesterChange}
                />
                <SelectInputField
                    id="student-course-course-period"
                    name="course_period"
                    label="Período do Curso"
                    hint="Semestre ou série em que o aluno está no semestre informado. Usado para sugerir as disciplinas do PEI."
                    options={coursePeriodOptions(maxCoursePeriod)}
                    placeholder={null}
                    searchable={false}
                    disabled={disabled}
                    value={form.data.course_period}
                    error={errors.course_period}
                    onChange={(value) => form.setData('course_period', value)}
                />
                {creating ? (
                    <FormGridWide>
                        <ToggleControl
                            id="student-course-is-current"
                            name="is_current"
                            size="small"
                            label="Definir este como o curso atual do aluno"
                            description={currentDescription}
                            checked={isCurrent}
                            disabled={mustBeCurrent || disabled}
                            onChange={(checked) => {
                                if (!mustBeCurrent) {
                                    form.setData('is_current', checked);
                                }
                            }}
                        />
                        {errors.is_current ? (
                            <span
                                id={fieldErrorId('student-course-is-current')}
                                className="formField__error"
                            >
                                {errors.is_current}
                            </span>
                        ) : null}
                    </FormGridWide>
                ) : null}
            </FormGrid>
        </FormSection>
    );
}

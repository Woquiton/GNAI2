import FormActions from '@/components/Forms/FormActions/FormActions';
import FormLayout from '@/components/Forms/FormLayout/FormLayout';
import Button from '@/components/UI/Button/Button';
import CardBox from '@/components/UI/CardBox/CardBox';
import { studentUrls } from '../Students.routes';
import type { Student, StudentFormOptions } from '../Students.types';
import { STUDENT_TOUR_TARGETS } from '../studentTours';
import StudentAcademicFields from './StudentAcademicFields';
import StudentPersonalFields from './StudentPersonalFields';
import type { StudentFormMode } from './StudentForm.types';
import { useStudentForm } from './useStudentForm';
import './StudentForm.css';

interface StudentFormProps {
    mode: StudentFormMode;
    options: StudentFormOptions;
    student?: Student;
}

function submissionStatus(
    photoValidating: boolean,
    processing: boolean,
    percentage: number | undefined,
): string {
    if (photoValidating) {
        return 'Preparando a foto selecionada...';
    }

    if (!processing) {
        return '';
    }

    return percentage !== undefined
        ? `Enviando foto: ${percentage}%`
        : 'Salvando dados do aluno...';
}

/** Cadastro e edição de alunos com foto, endereço em editor rico e dados acadêmicos. */
export default function StudentForm({
    mode,
    options,
    student,
}: StudentFormProps): React.JSX.Element {
    const {
        form,
        errors,
        formRef,
        editorFailed,
        photoValidating,
        setPhotoValidating,
        reportEditorFailure,
        selectPhoto,
        removePhoto,
        save,
    } = useStudentForm({ mode, options, student });
    const sectionProps = { form, errors, disabled: form.processing };

    return (
        <FormLayout
            ref={formRef}
            aria-label={mode === 'create' ? 'Cadastrar aluno' : 'Editar aluno'}
            aria-busy={form.processing}
            encType="multipart/form-data"
            onSubmit={(event) => {
                event.preventDefault();
                save();
            }}
        >
            <CardBox>
                <fieldset disabled={form.processing}>
                    <StudentPersonalFields
                        {...sectionProps}
                        person={student?.person}
                        genders={options.genders}
                        onPhotoChange={selectPhoto}
                        onPhotoRemove={removePhoto}
                        onPhotoValidatingChange={setPhotoValidating}
                        onEditorFailure={reportEditorFailure}
                    />
                    <StudentAcademicFields
                        {...sectionProps}
                        studentStatuses={options.studentStatuses}
                        followUpTypes={options.followUpTypes}
                    />
                </fieldset>
            </CardBox>
            <FormActions
                tourTarget={STUDENT_TOUR_TARGETS.formActions}
                status={submissionStatus(
                    photoValidating,
                    form.processing,
                    form.progress?.percentage,
                )}
            >
                <Button
                    href={student ? studentUrls.show(student.id) : studentUrls.index}
                    tone="cancel"
                    label="Cancelar"
                    title="Cancelar e voltar"
                    aria-label="Cancelar e voltar"
                    disabled={form.processing}
                />
                <Button
                    type="submit"
                    tone="save"
                    leftIconClass="fa fa-check"
                    label="Salvar"
                    title="Salvar aluno"
                    aria-label={form.processing ? 'Salvando aluno' : 'Salvar aluno'}
                    disabled={form.processing || editorFailed || photoValidating}
                />
            </FormActions>
        </FormLayout>
    );
}

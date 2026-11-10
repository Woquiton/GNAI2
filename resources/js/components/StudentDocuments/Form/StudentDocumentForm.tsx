import FormActions from '@/components/Forms/FormActions/FormActions';
import FormLayout from '@/components/Forms/FormLayout/FormLayout';
import Button from '@/components/UI/Button/Button';
import CardBox from '@/components/UI/CardBox/CardBox';
import { studentDocumentUrls } from '../StudentDocuments.routes';
import type { StudentDocumentFormOptions, StudentDocumentRecord } from '../StudentDocuments.types';
import { STUDENT_DOCUMENT_TOUR_TARGETS } from '../studentDocumentTours';
import StudentDocumentFileFields from './StudentDocumentFileFields';
import StudentDocumentInfoFields from './StudentDocumentInfoFields';
import { useStudentDocumentForm } from './useStudentDocumentForm';
import '@styles/components/StudentDocuments/Form/StudentDocumentForm.css';

type StudentDocumentFormProps = StudentDocumentFormOptions & {
    studentDocument?: StudentDocumentRecord;
};

function submissionStatus(
    processing: boolean,
    percentage: number | undefined,
    editing: boolean,
): string | undefined {
    if (!processing) {
        return undefined;
    }

    if (percentage !== undefined) {
        return `Enviando arquivo: ${percentage}%`;
    }

    return editing ? 'Salvando documento...' : 'Enviando documento...';
}

/** Envio de um novo documento do aluno ou edição do título, tipo e arquivo existentes. */
export default function StudentDocumentForm({
    student,
    types,
    customTypes,
    semester,
    studentDocument,
}: StudentDocumentFormProps): React.JSX.Element {
    const { form, errors, formRef, editing, selectFile, rejectFile, clearFile, save } =
        useStudentDocumentForm({ student, studentDocument });
    const sectionProps = { form, errors, disabled: form.processing, editing };
    const submitAction = editing ? (
        <Button
            type="submit"
            tone="save"
            label="Salvar"
            title="Salvar documento"
            aria-label={form.processing ? 'Salvando documento' : 'Salvar documento'}
            disabled={form.processing}
        />
    ) : (
        <Button
            type="submit"
            tone="save"
            leftIconClass="fa fa-upload"
            label="Realizar Upload"
            title="Realizar upload do documento"
            aria-label={form.processing ? 'Enviando documento' : 'Realizar upload do documento'}
            disabled={form.processing}
        />
    );

    return (
        <FormLayout
            ref={formRef}
            aria-label={editing ? 'Editar documento' : 'Cadastrar documento'}
            aria-busy={form.processing}
            encType="multipart/form-data"
            onSubmit={(event) => {
                event.preventDefault();
                save();
            }}
        >
            <CardBox>
                <fieldset disabled={form.processing}>
                    <StudentDocumentInfoFields
                        {...sectionProps}
                        types={types}
                        customTypes={customTypes}
                        semester={semester}
                    />
                    <StudentDocumentFileFields
                        {...sectionProps}
                        studentDocument={studentDocument}
                        onSelect={selectFile}
                        onReject={rejectFile}
                        onClear={clearFile}
                    />
                </fieldset>
            </CardBox>
            <FormActions
                tourTarget={STUDENT_DOCUMENT_TOUR_TARGETS.formActions}
                status={submissionStatus(form.processing, form.progress?.percentage, editing)}
            >
                <Button
                    href={studentDocumentUrls(student.id).record}
                    tone="cancel"
                    label="Cancelar"
                    title="Cancelar e voltar para o prontuário do aluno"
                    aria-label="Cancelar e voltar para o prontuário do aluno"
                    disabled={form.processing}
                />
                {submitAction}
            </FormActions>
        </FormLayout>
    );
}

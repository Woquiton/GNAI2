import { useForm } from '@inertiajs/react';
import { useFormSubmission } from '@/components/Forms/FormLayout/useFormSubmission';
import { studentDocumentMaxFileSize } from '../StudentDocuments.constants';
import { studentDocumentFileUrls, studentDocumentUrls } from '../StudentDocuments.routes';
import type { StudentDocumentRecord, StudentDocumentStudent } from '../StudentDocuments.types';
import type { StudentDocumentFormData } from './StudentDocumentForm.types';

interface UseStudentDocumentFormOptions {
    student: StudentDocumentStudent;
    studentDocument?: StudentDocumentRecord;
}

/** Estado, seleção do arquivo (limite de 10 MB) e envio multipart dos documentos do aluno. */
export function useStudentDocumentForm({
    student,
    studentDocument,
}: UseStudentDocumentFormOptions) {
    const editing = Boolean(studentDocument);
    const form = useForm<StudentDocumentFormData>({
        title: studentDocument?.title ?? '',
        type: studentDocument?.type ?? '',
        custom_type: studentDocument?.custom_type ?? '',
        show_in_teacher_portal:
            studentDocument?.type === 'technical report' ||
            (studentDocument?.show_in_teacher_portal ?? false),
        file: null,
    });
    const { formRef, submit } = useFormSubmission(form);
    const errors = form.errors as Partial<Record<keyof StudentDocumentFormData, string>>;

    function selectFile(file: File | undefined): void {
        if (!file) {
            return;
        }

        if (file.size > studentDocumentMaxFileSize) {
            rejectFile('O arquivo não pode ultrapassar 10 MB.');
            return;
        }

        form.clearErrors('file');
        form.setData('file', file);
    }

    /** Arquivo recusado (tamanho ou formato): a seleção é limpa e o motivo fica no campo. */
    function rejectFile(message: string): void {
        form.setData('file', null);
        form.setError('file', message);
    }

    function clearFile(): void {
        form.setData('file', null);
        form.clearErrors('file');
    }

    function save(): void {
        submit({
            url: studentDocument
                ? studentDocumentFileUrls.update(studentDocument.id)
                : studentDocumentUrls(student.id).store,
            method: studentDocument ? 'put' : 'post',
            files: true,
            failureText: studentDocument
                ? 'Não foi possível atualizar o documento. Atualize a página e tente novamente.'
                : 'Não foi possível enviar o documento. Atualize a página e tente novamente.',
        });
    }

    return { form, errors, formRef, editing, selectFile, rejectFile, clearFile, save };
}

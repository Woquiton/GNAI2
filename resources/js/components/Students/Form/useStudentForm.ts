import { useForm } from '@inertiajs/react';
import { useState } from 'react';
import { useFormSubmission } from '@/components/Forms/FormLayout/useFormSubmission';
import { STUDENT_FAILURE_TEXT } from '../Students.constants';
import { studentUrls } from '../Students.routes';
import type { Student, StudentFormOptions } from '../Students.types';
import type { StudentFormData, StudentFormMode } from './StudentForm.types';

function initialData(
    mode: StudentFormMode,
    options: StudentFormOptions,
    student?: Student,
): StudentFormData {
    const person = student?.person;
    const data: StudentFormData = {
        name: person?.name ?? '',
        document: person?.document ?? '',
        birth_date: person?.birth_date?.slice(0, 10) ?? '',
        gender: person?.gender ?? options.defaultGender ?? '',
        email: person?.email ?? '',
        phone: person?.phone ?? '',
        address: person?.address ?? '',
        registration: student?.registration ?? '',
        entry_date: student?.entry_date?.slice(0, 10) ?? '',
        follow_up_type: student?.follow_up_type ?? '',
        status: student?.status ?? options.defaultStatus,
        photo: null,
    };

    // A remoção de uma foto salva pertence somente à edição.
    return mode === 'edit'
        ? {
              ...data,
              remove_photo: false,
          }
        : data;
}

interface UseStudentFormOptions {
    mode: StudentFormMode;
    options: StudentFormOptions;
    student?: Student;
}

/** Estado, foto, falha do editor de endereço e envio multipart do cadastro/edição de alunos. */
export function useStudentForm({ mode, options, student }: UseStudentFormOptions) {
    const form = useForm<StudentFormData>(initialData(mode, options, student));
    const { formRef, submit } = useFormSubmission(form);
    const [editorFailed, setEditorFailed] = useState(false);
    const [photoValidating, setPhotoValidating] = useState(false);
    const errors = form.errors as Partial<Record<keyof StudentFormData, string>>;

    /** Bloqueia o envio quando o editor do endereço não carrega, para não perder o conteúdo. */
    function reportEditorFailure(): void {
        setEditorFailed(true);
        form.setError(
            'address',
            'Não foi possível carregar o editor de endereço. Atualize a página e tente novamente.',
        );
    }

    function selectPhoto(photo: File): void {
        form.setData((data) =>
            mode === 'edit' ? { ...data, photo, remove_photo: false } : { ...data, photo },
        );
        form.clearErrors('photo', 'remove_photo');
    }

    /** Na edição, remover também apaga a foto salva; no cadastro, apenas descarta o arquivo. */
    function removePhoto(): void {
        form.setData((data) =>
            mode === 'edit'
                ? { ...data, photo: null, remove_photo: true }
                : { ...data, photo: null },
        );
        form.clearErrors('photo');
    }

    function save(): void {
        submit({
            url: mode === 'edit' && student ? studentUrls.update(student.id) : studentUrls.store,
            method: mode === 'edit' ? 'put' : 'post',
            files: true,
            failureText: STUDENT_FAILURE_TEXT,
            blocked: editorFailed || photoValidating,
        });
    }

    return {
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
    };
}

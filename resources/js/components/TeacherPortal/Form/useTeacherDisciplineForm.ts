import { useForm } from '@inertiajs/react';
import { useEditorFailure } from '@/components/Forms/FormLayout/useEditorFailure';
import { useFormSubmission } from '@/components/Forms/FormLayout/useFormSubmission';
import { TEACHER_DISCIPLINE_FAILURE_TEXT } from '../TeacherPortal.constants';
import { teacherPortalUrls } from '../TeacherPortal.routes';
import type { TeacherPortalDisciplineRecord } from '../TeacherPortal.types';
import type { TeacherDisciplineFormData } from './TeacherDisciplineForm.types';

function initialData(peiDiscipline: TeacherPortalDisciplineRecord): TeacherDisciplineFormData {
    return {
        specific_objectives: peiDiscipline.specific_objectives ?? '',
        objectives_deadline: peiDiscipline.objectives_deadline ?? '',
        content_programmatic: peiDiscipline.content_programmatic ?? '',
        curricular_reference: peiDiscipline.curricular_reference ?? '',
        methodologies: peiDiscipline.methodologies ?? '',
        materials_and_assistive_technology: peiDiscipline.materials_and_assistive_technology ?? '',
        evaluations: peiDiscipline.evaluations ?? '',
        opinion: peiDiscipline.opinion ?? '',
        complementary_records: peiDiscipline.complementary_records ?? '',
    };
}

/** Estado e envio da adaptação do professor (`PUT`); o sucesso vem do redirect com `flash`. */
export function useTeacherDisciplineForm(peiDiscipline: TeacherPortalDisciplineRecord) {
    const form = useForm<TeacherDisciplineFormData>(initialData(peiDiscipline));
    const submission = useFormSubmission(form);
    const { editorFailed, reportEditorFailure } = useEditorFailure(form);
    const errors = form.errors as Partial<Record<keyof TeacherDisciplineFormData, string>>;

    function save(): void {
        submission.submit({
            url: teacherPortalUrls.updateDiscipline(peiDiscipline.id),
            method: 'put',
            failureText: TEACHER_DISCIPLINE_FAILURE_TEXT,
            blocked: editorFailed,
        });
    }

    return {
        form,
        errors,
        formRef: submission.formRef,
        save,
        editorFailed,
        reportEditorFailure,
    };
}

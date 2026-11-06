import { useForm } from '@inertiajs/react';
import { useState } from 'react';
import { useFormSubmission } from '@/components/Forms/FormLayout/useFormSubmission';
import { paeeFailureTexts } from '../Paees.constants';
import { paeeUrls } from '../Paees.routes';
import type { PaeeEditRecord } from '../Paees.types';
import type {
    PaeeBooleanField,
    PaeeFormData,
    PaeeFormProps,
    PaeeRichTextControl,
    PaeeTextField,
    PaeeToggleControl,
} from './PaeeForm.types';

/** IDs dos controles a partir do nome do campo ou do caminho do erro (`objectives.0.term`). */
export const paeeFieldId = (name: string): string => `paee-${name.replace(/[._]/g, '-')}`;

function initialData(paee?: PaeeEditRecord): PaeeFormData {
    return {
        attendance_frequency_per_week:
            paee?.attendance_frequency_per_week == null
                ? ''
                : String(paee.attendance_frequency_per_week),
        attendance_duration_minutes:
            paee?.attendance_duration_minutes == null
                ? ''
                : String(paee.attendance_duration_minutes),
        attendance_format: paee?.attendance_format ?? '',
        attendance_location: paee?.attendance_location ?? '',
        assistive_technology_needed: paee?.assistive_technology_needed ?? false,
        assistive_technology_notes: paee?.assistive_technology_notes ?? '',
        assistive_technology_availability_capacity:
            paee?.assistive_technology_availability_capacity ?? '',
        caa_needed: paee?.caa_needed ?? false,
        caa_notes: paee?.caa_notes ?? '',
        is_assistive_technology_portable_digital_device:
            paee?.is_assistive_technology_portable_digital_device ?? false,
        assistive_technology_pedagogical_opinion:
            paee?.assistive_technology_pedagogical_opinion ?? '',
        support_professional_needed: paee?.support_professional_needed ?? false,
        support_professional_justification: paee?.support_professional_justification ?? '',
        libras_interpreter_needed: paee?.libras_interpreter_needed ?? false,
        libras_interpreter_justification: paee?.libras_interpreter_justification ?? '',
        guide_interpreter_needed: paee?.guide_interpreter_needed ?? false,
        guide_interpreter_justification: paee?.guide_interpreter_justification ?? '',
        school_professionals_orientation: paee?.school_professionals_orientation ?? '',
        common_teachers_articulation: paee?.common_teachers_articulation ?? '',
        family_articulation: paee?.family_articulation ?? '',
        intersectoral_articulation: paee?.intersectoral_articulation ?? '',
        training_demands: paee?.training_demands ?? '',
        objectives: paee?.objectives.map((objective) => ({ ...objective })) ?? [],
        resources: paee?.resources.map((resource) => ({ ...resource })) ?? [],
    };
}

/** Estado, controles ligados, falhas dos editores e envio do cadastro/edição do PAEE. */
export function usePaeeForm(props: PaeeFormProps) {
    const paee = props.mode === 'edit' ? props.paee : undefined;
    const form = useForm<PaeeFormData>(initialData(paee));
    const { formRef, submit } = useFormSubmission(form);
    const [editorFailed, setEditorFailed] = useState(false);
    const errors = form.errors as Record<string, string | undefined>;
    const disabled = form.processing;

    /** Bloqueia o envio quando um editor rico não carrega, para não perder o conteúdo. */
    function reportEditorFailure(name: PaeeTextField): void {
        setEditorFailed(true);
        form.setError(name, paeeFailureTexts.editor);
    }

    function richText(name: PaeeTextField): PaeeRichTextControl {
        return {
            id: paeeFieldId(name),
            error: errors[name],
            height: 120,
            defaultValue: form.data[name],
            disabled,
            onChange: (html) => form.setData(name, html),
            onLoadError: () => reportEditorFailure(name),
        };
    }

    function toggle(name: PaeeBooleanField): PaeeToggleControl {
        return {
            id: paeeFieldId(name),
            name,
            size: 'small',
            description: errors[name],
            checked: form.data[name],
            disabled,
            onChange: (checked) => form.setData(name, checked),
        };
    }

    function save(): void {
        submit({
            url: props.mode === 'edit' ? paeeUrls.update(props.paee.id) : paeeUrls.store,
            method: props.mode === 'edit' ? 'put' : 'post',
            blocked: editorFailed,
            transform: () =>
                props.mode === 'edit'
                    ? { ...form.data }
                    : { ...form.data, case_study_id: props.caseStudyId },
            failureText: paeeFailureTexts.save,
        });
    }

    return { form, errors, formRef, editorFailed, richText, toggle, save };
}

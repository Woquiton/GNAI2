import { useForm } from '@inertiajs/react';
import { useState } from 'react';
import { useFormSubmission } from '@/components/Forms/FormLayout/useFormSubmission';
import { caseStudyFailureTexts } from '../CaseStudies.constants';
import { caseStudyUrls } from '../CaseStudies.routes';
import type { CaseStudyFormRecord, CaseStudyStudent } from '../CaseStudies.types';
import type { CaseStudyFormData, CaseStudyTextField } from './CaseStudyForm.types';

function initialData(caseStudy: CaseStudyFormRecord | null): CaseStudyFormData {
    return {
        demand_origin: caseStudy?.demand_origin ?? '',
        participants_summary: caseStudy?.participants_summary ?? '',
        study_date: caseStudy?.study_date ?? '',
        student_observation: caseStudy?.student_observation ?? '',
        student_family_listening: caseStudy?.student_family_listening ?? '',
        teachers_listening: caseStudy?.teachers_listening ?? '',
        other_info: caseStudy?.other_info ?? '',
        care_network_notes: caseStudy?.care_network_notes ?? '',
        favorable_aspects: caseStudy?.favorable_aspects ?? '',
        potentials_interests: caseStudy?.potentials_interests ?? '',
        needed_supports: caseStudy?.needed_supports ?? [],
        needed_supports_justification: caseStudy?.needed_supports_justification ?? '',
        acceptance_status: caseStudy?.acceptance_status ?? '',
        acceptance_date: caseStudy?.acceptance_date ?? '',
        barriers: caseStudy?.barriers ?? [],
        strategies: caseStudy?.strategies ?? [],
    };
}

interface UseCaseStudyFormOptions {
    student: CaseStudyStudent;
    caseStudy: CaseStudyFormRecord | null;
}

/** Estado, falhas dos editores e envio do cadastro/edição do Estudo de Caso. */
export function useCaseStudyForm({ student, caseStudy }: UseCaseStudyFormOptions) {
    const form = useForm<CaseStudyFormData>(initialData(caseStudy));
    const { formRef, submit } = useFormSubmission(form);
    const [editorFailed, setEditorFailed] = useState(false);
    const errors = form.errors as Record<string, string | undefined>;

    /** Bloqueia o envio quando um editor rico não carrega, para não perder o conteúdo. */
    function reportEditorFailure(field: CaseStudyTextField): void {
        setEditorFailed(true);
        form.setError(
            field,
            'Não foi possível carregar o editor. Atualize a página e tente novamente.',
        );
    }

    function save(): void {
        submit({
            url: caseStudy ? caseStudyUrls.update(caseStudy.id) : caseStudyUrls.store(student.id),
            method: caseStudy ? 'put' : 'post',
            blocked: editorFailed,
            failureText: caseStudyFailureTexts.save,
        });
    }

    return { form, errors, formRef, editorFailed, reportEditorFailure, save };
}

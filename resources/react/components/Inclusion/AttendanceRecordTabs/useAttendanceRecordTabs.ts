import { useState, type RefObject } from 'react';
import { focusFirstInvalid } from '@/components/Forms/FormLayout/useFormSubmission';

/** Abas dos registros de atendimento AEE e pedagógico. */
export type AttendanceRecordTabId = 'details' | 'general' | 'evaluations';

/** Campos da aba "Dados do Atendimento", inclusive os responsáveis do atendimento pedagógico. */
const detailFields = new Set([
    'student_ids',
    'type',
    'professional_id',
    'session_date',
    'start_time',
    'end_time',
    'location',
    'with_guardians',
    'guardian_ids',
]);

/** Texto vazio, inclusive o HTML que um editor rico deixa sem conteúdo (`<p><br></p>`). */
export function isBlankText(value: string | null | undefined): boolean {
    const html = value ?? '';

    if (/<img\b/i.test(html)) return false;

    return (
        html
            .replace(/<[^>]*>/g, '')
            .replace(/&nbsp;/gi, ' ')
            .trim() === ''
    );
}

/** Obrigatórios vazios do cabeçalho; `student_ids` só conta no registro direto. */
export function pendingAttendanceDetails(
    values: {
        session_date: string;
        start_time: string;
        end_time: string;
        location: string;
        student_ids: string[];
    },
    withStudents: boolean,
): number {
    const blanks = [values.session_date, values.start_time, values.end_time, values.location]
        .filter((value) => isBlankText(value)).length;

    return blanks + (withStudents && !values.student_ids.some(Boolean) ? 1 : 0);
}

/** Aba que contém o campo do erro (`evaluations.0.recommendations`, `student_ids.1`...). */
export function attendanceTabOf(errorKey: string): AttendanceRecordTabId {
    if (errorKey.startsWith('evaluations')) return 'evaluations';

    return detailFields.has(errorKey.split('.')[0]) ? 'details' : 'general';
}

/**
 * Aba ativa do formulário e sinalização de erros: após uma resposta com erros de validação, abre a
 * primeira aba, na ordem do formulário, que tem campos a corrigir e focaliza o primeiro deles.
 */
export function useAttendanceRecordTabs(
    tabIds: AttendanceRecordTabId[],
    errors: Record<string, string | undefined>,
    formRef: RefObject<HTMLFormElement | null>,
) {
    const [activeTab, setActiveTab] = useState<AttendanceRecordTabId>(tabIds[0]);

    function tabHasErrors(id: AttendanceRecordTabId): boolean {
        return Object.entries(errors).some(
            ([key, message]) => message && attendanceTabOf(key) === id,
        );
    }

    function revealErrors(received: Record<string, string>): void {
        const keys = Object.keys(received);
        const target = tabIds.find((id) => keys.some((key) => attendanceTabOf(key) === id));

        if (target) setActiveTab(target);

        // O painel da aba só existe depois da renderização seguinte.
        requestAnimationFrame(() => focusFirstInvalid(formRef.current));
    }

    /** Troca de aba pelo rodapé: volta ao topo das abas e leva o foco à aba aberta. */
    function goTo(id: AttendanceRecordTabId): void {
        setActiveTab(id);
        requestAnimationFrame(() => {
            const tab = formRef.current?.querySelector<HTMLElement>(
                '[role="tab"][aria-selected="true"]',
            );

            tab?.scrollIntoView({ block: 'center' });
            tab?.focus({ preventScroll: true });
        });
    }

    return {
        activeTab,
        goTo,
        changeTab: (id: string) => setActiveTab(id as AttendanceRecordTabId),
        tabHasErrors,
        revealErrors,
    };
}

export type AttendanceRecordTabsState = ReturnType<typeof useAttendanceRecordTabs>;

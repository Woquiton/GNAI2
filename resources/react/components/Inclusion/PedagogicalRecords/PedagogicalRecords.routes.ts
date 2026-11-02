import { inclusionBase } from '@/components/Inclusion/Inclusion.routes';
import { sessionUrls } from '@/components/Inclusion/Sessions/Sessions.routes';
import {
    studentRecordUrl,
    studentUrl,
    studentUrls,
} from '@/components/Inclusion/Students/Students.routes';
import type { PageBreadcrumbItem } from '@/components/Navigation/PageBreadcrumb/PageBreadcrumb';
import { resourceBreadcrumb } from '@/components/Navigation/PageBreadcrumb/resourceBreadcrumb';

const base = `${inclusionBase}/atendimentos-pedagogicos`;

/** Aba "Atendimentos pedagógicos" do prontuário do aluno. */
export const STUDENT_PEDAGOGICAL_RECORD_TAB = 'pedagogical-attendance';

/** Mantém a origem no prontuário (`student_id`) nas telas abertas a partir do aluno. */
function withStudent(url: string, studentId?: number): string {
    return studentId ? `${url}?${new URLSearchParams({ student_id: String(studentId) })}` : url;
}

/** Endereços das rotas `specialized-educational-support.pedagogical-records.*`. */
export const pedagogicalRecordUrls = {
    index: base,
    myRecords: `${inclusionBase}/meus-atendimentos-pedagogicos`,
    create: (sessionId: number) => `${base}/${sessionId}/criar`,
    store: `${base}/salvar`,
    show: (id: number, studentId?: number) => withStudent(`${base}/${id}/visualizar`, studentId),
    edit: (id: number, studentId?: number) => withStudent(`${base}/${id}/editar`, studentId),
    update: (id: number, studentId?: number) => withStudent(`${base}/${id}`, studentId),
    destroy: (id: number, studentId?: number) => withStudent(`${base}/${id}`, studentId),
    pdf: (id: number) => `${base}/${id}/pdf`,
    /** Rota `specialized-educational-support.students.pedagogical-records.index`. */
    student: (studentId: number) => studentUrl(studentId, 'atendimentos-pedagogicos'),
};

/** Destino de voltar: a aba do prontuário, quando aberto pelo aluno, ou o agendamento. */
export function pedagogicalRecordReturnUrl(sessionId: number, studentId?: number): string {
    return studentId
        ? studentRecordUrl(studentId, STUDENT_PEDAGOGICAL_RECORD_TAB)
        : sessionUrls.show(sessionId);
}

/** Home › Atendimentos Pedagógicos: listagens geral e pessoal. */
export function pedagogicalRecordListBreadcrumb(): PageBreadcrumbItem[] {
    return resourceBreadcrumb({
        collection: { label: 'Atendimentos Pedagógicos', href: pedagogicalRecordUrls.index },
    });
}

/**
 * Home › Agendamentos › Agendamento #id › Atendimento Pedagógico › [Etapa]: o registro pertence
 * ao agendamento em que foi realizado.
 */
export function pedagogicalRecordBreadcrumb({
    sessionId,
    recordId,
    current,
}: {
    sessionId: number;
    recordId?: number;
    current?: string;
}): PageBreadcrumbItem[] {
    const recordLabel = 'Atendimento Pedagógico';
    const hasStep = Boolean(recordId && current);

    return resourceBreadcrumb({
        parents: [{ label: 'Agendamentos', href: sessionUrls.index }],
        collection: { label: `Agendamento #${sessionId}`, href: sessionUrls.show(sessionId) },
        record:
            hasStep && recordId
                ? { label: recordLabel, href: pedagogicalRecordUrls.show(recordId) }
                : undefined,
        current: hasStep ? current : recordLabel,
    });
}

/** Home › Alunos › Aluno › Atendimentos pedagógicos. */
export function studentPedagogicalRecordBreadcrumb(student: {
    id: number;
    name: string;
}): PageBreadcrumbItem[] {
    return resourceBreadcrumb({
        parents: [
            { label: 'Alunos', href: studentUrls.index },
            { label: student.name, href: studentUrl(student.id) },
        ],
        collection: {
            label: 'Atendimentos pedagógicos',
            href: pedagogicalRecordUrls.student(student.id),
        },
    });
}

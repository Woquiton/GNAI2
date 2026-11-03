import { inclusionBase } from '@/components/Inclusion/Inclusion.routes';
import { studentRecordUrl, studentUrls } from '@/components/Inclusion/Students/Students.routes';
import type { PageBreadcrumbItem } from '@/components/Navigation/PageBreadcrumb/PageBreadcrumb';
import {
    DASHBOARD_BREADCRUMB,
    resourceBreadcrumb,
} from '@/components/Navigation/PageBreadcrumb/resourceBreadcrumb';

const recordsBase = `${inclusionBase}/atendimentos-aee`;
const sessionsBase = `${inclusionBase}/agendamentos`;

/** Aba "Atendimentos AEE" do prontuário do aluno. */
export const STUDENT_AEE_RECORD_TAB = 'aee-attendance';

/** Endereços das rotas `specialized-educational-support.aee-records.*`. */
export const aeeRecordUrls = {
    index: recordsBase,
    myRecords: `${inclusionBase}/meus-atendimentos-aee`,
    store: `${recordsBase}/salvar`,
    /** Registro direto, sem agendamento prévio (`aee-records.direct.*`). */
    directCreate: `${recordsBase}/registro-direto/criar`,
    directStore: `${recordsBase}/registro-direto/salvar`,
    show: (id: number) => `${recordsBase}/${id}/visualizar`,
    edit: (id: number) => `${recordsBase}/${id}/editar`,
    update: (id: number) => `${recordsBase}/${id}`,
    destroy: (id: number) => `${recordsBase}/${id}`,
    pdf: (id: number) => `${recordsBase}/${id}/pdf`,
};

/** Agendamentos (`specialized-educational-support.sessions.*`) usados como origem dos registros. */
export const aeeSessionUrls = {
    index: sessionsBase,
    show: (id: number) => `${sessionsBase}/${id}/visualizar`,
};

/** Avaliações individuais do aluno (`specialized-educational-support.students.aee-records.*`). */
export function studentAeeRecordUrls(studentId: number) {
    const base = `${studentUrls.index}/${studentId}/atendimentos-aee`;

    return {
        index: base,
        show: (id: number) => `${base}/${id}/visualizar`,
        edit: (id: number) => `${base}/${id}/editar`,
        update: (id: number) => `${base}/${id}`,
        destroy: (id: number) => `${base}/${id}`,
        pdf: (id: number) => `${base}/${id}/pdf`,
        /** Aba do prontuário, destino de voltar/cancelar. */
        record: studentRecordUrl(studentId, STUDENT_AEE_RECORD_TAB),
    };
}

/** Home › [Listagem]: as listagens gerais não têm níveis intermediários. */
export function aeeRecordListBreadcrumb(label: string): PageBreadcrumbItem[] {
    return [DASHBOARD_BREADCRUMB, { label }];
}

/** Home › Atendimentos Especializados › Cadastrar, no registro direto. */
export function aeeRecordDirectBreadcrumb(listUrl: string): PageBreadcrumbItem[] {
    return resourceBreadcrumb({
        collection: { label: 'Atendimentos Especializados', href: listUrl },
        current: 'Cadastrar',
    });
}

/**
 * Home › Agendamentos › Agendamento › [Registro] › [Etapa]: o registro pertence ao agendamento
 * em que foi realizado.
 */
export function aeeRecordBreadcrumb({
    sessionId,
    sessionLabel = 'Agendamento',
    recordId,
    current,
}: {
    sessionId: number;
    sessionLabel?: string;
    recordId?: number;
    current: string;
}): PageBreadcrumbItem[] {
    return resourceBreadcrumb({
        parents: [{ label: 'Agendamentos', href: aeeSessionUrls.index }],
        collection: { label: sessionLabel, href: aeeSessionUrls.show(sessionId) },
        record: recordId ? { label: 'Registro', href: aeeRecordUrls.show(recordId) } : undefined,
        current,
    });
}

/**
 * Home › Alunos › Aluno › Registros de atendimento AEE › [Avaliação] › [Etapa], para as telas
 * abertas a partir do prontuário.
 */
export function studentAeeRecordBreadcrumb({
    studentId,
    studentName,
    evaluationId,
    current,
}: {
    studentId: number;
    studentName: string;
    evaluationId?: number;
    current?: string;
}): PageBreadcrumbItem[] {
    const urls = studentAeeRecordUrls(studentId);

    return resourceBreadcrumb({
        parents: [
            { label: 'Alunos', href: studentUrls.index },
            { label: studentName, href: urls.record },
        ],
        collection: { label: 'Registros de atendimento AEE', href: urls.index },
        record: evaluationId ? { label: 'Visualizar', href: urls.show(evaluationId) } : undefined,
        current,
    });
}

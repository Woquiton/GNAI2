import { studentRecordUrl, studentUrls } from '@/components/Students/Students.routes';
import { resourceBreadcrumb } from '@/components/Navigation/PageBreadcrumb/resourceBreadcrumb';

const base = '/solicitacoes-de-atendimento';
export const supportRequestUrls = {
    index: base,
    create: `${base}/criar`,
    createForStudent: (id: number, fromStudent = false) =>
        `${base}/criar?student_id=${id}${fromStudent ? '&from_student=1' : ''}`,
    forStudent: (id: number) => `${base}?student_id=${id}`,
    store: `${base}/salvar`,
    show: (id: number, fromStudent = false) =>
        `${base}/${id}/visualizar${fromStudent ? '?from_student=1' : ''}`,
    edit: (id: number, fromStudent = false) =>
        `${base}/${id}/editar${fromStudent ? '?from_student=1' : ''}`,
    update: (id: number, fromStudent = false) =>
        `${base}/${id}${fromStudent ? '?from_student=1' : ''}`,
    destroy: (id: number, fromStudent = false) =>
        `${base}/${id}${fromStudent ? '?from_student=1' : ''}`,
    pdf: (id: number) => `${base}/${id}/pdf`,
};
export function supportRequestBreadcrumb(
    record?: { id: number },
    current?: string,
    student?: { id: number; name: string },
) {
    if (student) {
        return resourceBreadcrumb({
            parents: [{ label: 'Alunos', href: studentUrls.index }],
            collection: {
                label: student.name,
                href: studentRecordUrl(student.id, 'support-requests'),
            },
            record: record
                ? {
                      label: `Solicitação #${record.id}`,
                      href: supportRequestUrls.show(record.id, true),
                  }
                : undefined,
            current,
        });
    }
    return resourceBreadcrumb({
        collection: { label: 'Solicitações de Atendimento', href: base },
        record: record
            ? { label: `Solicitação #${record.id}`, href: supportRequestUrls.show(record.id) }
            : undefined,
        current,
    });
}

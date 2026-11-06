import { studentRecordUrl, studentsBase } from '@/components/Students/Students.routes';
import type { PageBreadcrumbItem } from '@/components/Navigation/PageBreadcrumb/PageBreadcrumb';
import { resourceBreadcrumb } from '@/components/Navigation/PageBreadcrumb/resourceBreadcrumb';
import type { StudentDocumentStudent } from './StudentDocuments.types';

const documentsBase = `/documentos-do-aluno`;

/** Cadastro fica no aluno; visualização, download, edição e exclusão no documento. */
export function studentDocumentUrls(studentId: number) {
    const base = `${studentsBase}/${studentId}/documentos`;

    return {
        create: `${base}/criar`,
        store: base,
        /** Aba "Documentos" do prontuário, destino de cancelar. */
        record: studentRecordUrl(studentId, 'documents'),
    };
}

export const studentDocumentFileUrls = {
    show: (id: number) => `${documentsBase}/${id}/visualizar`,
    download: (id: number) => `${documentsBase}/${id}/baixar`,
    edit: (id: number) => `${documentsBase}/${id}/editar`,
    update: (id: number) => `${documentsBase}/${id}`,
    destroy: (id: number) => `${documentsBase}/${id}`,
};

/**
 * Home › Alunos › Aluno › [Documento] › Etapa. O documento não tem página de
 * visualização própria (o arquivo é aberto diretamente), por isso aparece sem link.
 */
export function studentDocumentBreadcrumb({
    student,
    documentTitle,
    current,
}: {
    student: StudentDocumentStudent;
    documentTitle?: string;
    current?: string;
}): PageBreadcrumbItem[] {
    const items = resourceBreadcrumb({
        parents: [{ label: 'Alunos', href: studentsBase }],
        collection: {
            label: student.person.name,
            href: studentDocumentUrls(student.id).record,
        },
        current: documentTitle ?? current,
    });

    return documentTitle && current ? [...items, { label: current }] : items;
}

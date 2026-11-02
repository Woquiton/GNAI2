import { inclusionBase } from '@/components/Inclusion/Inclusion.routes';
import {
    studentRecordBreadcrumbParents,
    studentRecordUrl,
    studentsBase,
} from '@/components/Inclusion/Students/Students.routes';
import type { PageBreadcrumbItem } from '@/components/Navigation/PageBreadcrumb/PageBreadcrumb';
import { resourceBreadcrumb } from '@/components/Navigation/PageBreadcrumb/resourceBreadcrumb';
import type { StudentDocumentStudent } from './StudentDocuments.types';

const documentsBase = `${inclusionBase}/documentos-do-aluno`;

/** Listagem e cadastro ficam no aluno; visualização, download, edição e exclusão no documento. */
export function studentDocumentUrls(studentId: number) {
    const base = `${studentsBase}/${studentId}/documentos`;

    return {
        index: base,
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
 * Home › Alunos › Aluno › Documentos › [Documento] › [Etapa]. O documento não tem página de
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
        parents: studentRecordBreadcrumbParents(student),
        collection: { label: 'Documentos', href: studentDocumentUrls(student.id).record },
        current: documentTitle ?? current,
    });

    return documentTitle && current ? [...items, { label: current }] : items;
}

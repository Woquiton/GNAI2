import {
    studentRecordBreadcrumbParents,
    studentRecordUrl,
    studentsBase,
} from '@/components/Students/Students.routes';
import { resourceBreadcrumb } from '@/components/Navigation/PageBreadcrumb/resourceBreadcrumb';
import type { GuardianStudent } from './Guardians.types';

/** Endereços das rotas de responsáveis, aninhadas no aluno (`/alunos/{aluno}/responsaveis`). */
export function guardianUrls(studentId: number) {
    const base = `${studentsBase}/${studentId}/responsaveis`;

    return {
        index: base,
        create: `${base}/criar`,
        store: `${base}/salvar`,
        edit: (id: number) => `${base}/${id}/editar`,
        update: (id: number) => `${base}/${id}`,
        destroy: (id: number) => `${base}/${id}`,
        /** Aba "Responsáveis" do prontuário, destino de voltar e cancelar. */
        record: studentRecordUrl(studentId, 'guardians'),
    };
}

/** Visualização do responsável (`/responsavel/{responsavel}/visualizar`). */
export const guardianShowUrl = (id: number): string =>
    `/responsavel/${id}/visualizar`;

/** Home › Alunos › Aluno › Responsáveis › [Responsável] › [Etapa]. */
export function guardianBreadcrumb({
    student,
    guardian,
    current,
}: {
    student: GuardianStudent;
    guardian?: { id: number; person: { name: string } };
    current?: string;
}) {
    return resourceBreadcrumb({
        parents: studentRecordBreadcrumbParents(student),
        collection: { label: 'Responsáveis', href: guardianUrls(student.id).record },
        record: guardian
            ? { label: guardian.person.name, href: guardianShowUrl(guardian.id) }
            : undefined,
        current,
    });
}

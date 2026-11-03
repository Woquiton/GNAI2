import { inclusionBase } from '@/components/Inclusion/Inclusion.routes';
import { resourceBreadcrumb } from '@/components/Navigation/PageBreadcrumb/resourceBreadcrumb';

const base = `${inclusionBase}/professores`;

/** Endereços das rotas `specialized-educational-support.teachers.*`. */
export const teacherUrls = {
    index: base,
    create: `${base}/criar`,
    store: `${base}/salvar`,
    show: (id: number) => `${base}/${id}/visualizar`,
    edit: (id: number) => `${base}/${id}/editar`,
    update: (id: number) => `${base}/${id}`,
    destroy: (id: number) => `${base}/${id}`,
    disciplines: (id: number) => `${base}/${id}/disciplinas`,
    disciplinesInSemester: (id: number, semesterId: number) =>
        `${base}/${id}/disciplinas?semestre=${semesterId}`,
    copyDisciplines: (id: number) => `${base}/${id}/disciplinas/copiar`,
    copyAllDisciplines: `${base}/vinculos/copiar`,
};

export function teacherBreadcrumb(
    options: { teacher?: { id: number; name: string }; current?: string } = {},
) {
    return resourceBreadcrumb({
        collection: { label: 'Professores', href: teacherUrls.index },
        record: options.teacher
            ? { label: options.teacher.name, href: teacherUrls.show(options.teacher.id) }
            : undefined,
        current: options.current,
    });
}

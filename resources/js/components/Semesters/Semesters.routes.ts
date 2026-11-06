import { resourceBreadcrumb } from '@/components/Navigation/PageBreadcrumb/resourceBreadcrumb';
import { semesterLabel } from './Semesters.constants';
import type { SemesterRecord } from './Semesters.types';

const base = '/semestres';

/** Endereços das rotas `specialized-educational-support.semesters.*` (prefixo `/semestres`). */
export const semesterUrls = {
    index: base,
    create: `${base}/criar`,
    store: `${base}/salvar`,
    show: (id: number) => `${base}/${id}/visualizar`,
    edit: (id: number) => `${base}/${id}/editar`,
    update: (id: number) => `${base}/${id}`,
    setCurrent: (id: number) => `${base}/${id}/definir-atual`,
    destroy: (id: number) => `${base}/${id}`,
};

export function semesterBreadcrumb(
    options: {
        semester?: Pick<SemesterRecord, 'id' | 'label' | 'year' | 'term'>;
        current?: string;
    } = {},
) {
    return resourceBreadcrumb({
        collection: { label: 'Semestres', href: semesterUrls.index },
        record: options.semester
            ? {
                  label: semesterLabel(options.semester),
                  href: semesterUrls.show(options.semester.id),
              }
            : undefined,
        current: options.current,
    });
}

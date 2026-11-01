import { resourceBreadcrumb } from '@/components/Navigation/PageBreadcrumb/resourceBreadcrumb';

const base = '/backups';

/** Endereços das rotas `backup.backups.*` (prefixo `/backups`). */
export const backupUrls = {
    index: base,
    store: `${base}/salvar`,
    upload: `${base}/enviar`,
    show: (id: number) => `${base}/${id}`,
    download: (id: number) => `${base}/${id}/baixar`,
    restore: (id: number) => `${base}/${id}/restaurar`,
    destroy: (id: number) => `${base}/${id}`,
};

export function backupBreadcrumb(options: { fileName?: string } = {}) {
    return resourceBreadcrumb({
        collection: { label: 'Backups', href: backupUrls.index },
        current: options.fileName,
    });
}

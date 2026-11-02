import type { PageBreadcrumbItem } from './PageBreadcrumb';

export const DASHBOARD_BREADCRUMB: PageBreadcrumbItem = {
    label: 'Home',
    href: '/autenticacao/painel',
};

export interface ResourceBreadcrumbOptions {
    /** Listagem do recurso, por exemplo `{ label: 'Itens', href: '/inclusao/itens' }`. */
    collection: { label: string; href: string };
    /** Registro atual; o link aparece quando há uma etapa depois dele (`current`). */
    record?: { label: string; href: string };
    /** Etapa atual, como "Cadastrar" ou "Editar". */
    current?: string;
    /** Níveis entre Home e a listagem, como o prontuário do aluno. */
    parents?: PageBreadcrumbItem[];
}

/**
 * Breadcrumb padrão das telas de recurso:
 * Home › Coleção › [Registro] › [Etapa]. O último nível nunca é link.
 */
export function resourceBreadcrumb({
    collection,
    record,
    current,
    parents = [],
}: ResourceBreadcrumbOptions): PageBreadcrumbItem[] {
    const items: PageBreadcrumbItem[] = [DASHBOARD_BREADCRUMB, ...parents];
    const hasNext = Boolean(record || current);

    items.push({ label: collection.label, href: hasNext ? collection.href : undefined });

    if (record) {
        items.push({ label: record.label, href: current ? record.href : undefined });
    }

    if (current) {
        items.push({ label: current });
    }

    return items;
}

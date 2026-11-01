import { inclusionBase } from '@/components/Inclusion/Inclusion.routes';
import { itemUrls } from '@/components/Inclusion/Items/Items.routes';
import { resourceBreadcrumb } from '@/components/Navigation/PageBreadcrumb/resourceBreadcrumb';

const base = `${inclusionBase}/emprestimos`;

/** Endereços das rotas `inclusive-radar.loans.*` (prefixo `/inclusao/emprestimos`). */
export const loanUrls = {
    index: base,
    create: `${base}/criar`,
    store: `${base}/salvar`,
    show: (id: number) => `${base}/${id}`,
    edit: (id: number) => `${base}/${id}/editar`,
    update: (id: number) => `${base}/${id}`,
    destroy: (id: number) => `${base}/${id}`,
    return: (id: number) => `${base}/${id}/devolver`,
    pdf: (id: number) => `${base}/${id}/pdf`,
    /** Cadastro do item emprestado, aberto em outra aba a partir da listagem. */
    item: (itemId: number) => itemUrls.show(itemId),
};

export function loanBreadcrumb(options: { loan?: { id: number }; current?: string } = {}) {
    return resourceBreadcrumb({
        collection: { label: 'Empréstimos', href: loanUrls.index },
        record: options.loan
            ? { label: `Empréstimo #${options.loan.id}`, href: loanUrls.show(options.loan.id) }
            : undefined,
        current: options.current,
    });
}

import { resourceBreadcrumb } from '@/components/Navigation/PageBreadcrumb/resourceBreadcrumb';

const base = '/autenticacao/perfil';

/** Endereços das rotas de perfil (prefixo `/autenticacao/perfil`). */
export const profileUrls = {
    edit: base,
    update: base,
    updateAccount: `${base}/conta`,
    /** Destino do botão "Cancelar". */
    dashboard: '/autenticacao/painel',
};

/** Home › Meu Perfil. */
export function profileBreadcrumb() {
    return resourceBreadcrumb({ collection: { label: 'Meu Perfil', href: profileUrls.edit } });
}

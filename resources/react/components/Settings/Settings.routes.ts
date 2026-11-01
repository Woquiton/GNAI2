import { resourceBreadcrumb } from '@/components/Navigation/PageBreadcrumb/resourceBreadcrumb';

const base = '/configuracoes';

/** Endereços das rotas `settings.*` (prefixo `/configuracoes`). */
export const settingsUrls = {
    index: base,
    mail: `${base}/email`,
    mailTest: `${base}/email/teste`,
    backup: `${base}/backups`,
};

/** Destino dos botões "Cancelar" das configurações. */
export const settingsCancelUrl = '/autenticacao/painel';

/** Home › Configurações › Categoria atual. */
export function settingsBreadcrumb(category: string) {
    return resourceBreadcrumb({
        collection: { label: 'Configurações', href: settingsUrls.index },
        current: category,
    });
}

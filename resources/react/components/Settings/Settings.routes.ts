import { resourceBreadcrumb } from '@/components/Navigation/PageBreadcrumb/resourceBreadcrumb';

const base = '/configuracoes';

/** Endereços das rotas `settings.*` (prefixo `/configuracoes`). */
export const settingsUrls = {
    index: base,
    sessionSecurity: `${base}/seguranca-e-sessoes`,
    mail: `${base}/email`,
    automaticEmails: `${base}/emails-automaticos`,
    pdf: `${base}/pdfs`,
    mailTest: `${base}/email/teste`,
    backup: `${base}/backups`,
    teacherAccess: `${base}/acesso-dos-professores`,
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

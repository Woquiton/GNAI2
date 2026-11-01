/** Quantidades oferecidas no rodapé; espelha `UserTablePreference::PAGE_SIZES`. */
export const TABLE_LIST_PAGE_SIZES = [10, 25, 50, 100] as const;

export const TABLE_LIST_DEFAULT_PAGE_SIZE = 10;

/** Endpoint que grava as colunas visíveis de uma tabela para o usuário. */
export const TABLE_LIST_COLUMNS_URL = '/autenticacao/preferencias/tabelas/colunas';

/** Preferências compartilhadas pelo `HandleInertiaRequests`. */
export interface TableListSharedPreferences {
    route: string | null;
    columns: Record<string, Record<string, boolean>>;
}

/** Hash curto e estável (djb2, base 36) para identificar a tabela pelas suas colunas. */
export function tableListSignature(value: string): string {
    let hash = 5381;

    for (let index = 0; index < value.length; index += 1) {
        hash = ((hash << 5) + hash + value.charCodeAt(index)) >>> 0;
    }

    return hash.toString(36);
}

/** Endereços do acesso do professor por link mágico (prefixo `/autenticacao`). */
export const teacherAccessUrls = {
    request: '/autenticacao/acesso',
    confirm: (token: string) => `/autenticacao/acesso/${encodeURIComponent(token)}`,
    login: '/autenticacao/entrar',
};

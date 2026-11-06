/** Props da confirmação do link mágico (`GET /autenticacao/acesso/{token}`). */
export interface TeacherAccessConfirmProps {
    token: string;
}

/** Domínios públicos aceitos para solicitar o link de acesso. */
export interface TeacherAccessRequestProps {
    allowedDomains: string[];
}

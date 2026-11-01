import type { ReactNode } from "react";
import { Link, router, usePage } from "@inertiajs/react";
import AppFooter from "@/components/Navigation/AppFooter/AppFooter";
import Button from "@/components/UI/Button/Button";
import FlashNotifications from "@/components/UI/FlashNotifications/FlashNotifications";
import PageErrorBoundary from "@/components/UI/PageErrorBoundary/PageErrorBoundary";
import "./TeacherPortalLayout.css";

interface TeacherPortalLayoutProps {
    auth: { user: { name: string } | null };
    impersonating: boolean;
    impersonationReadOnly: boolean;
    [key: string]: unknown;
}

/**
 * Moldura do Portal do Professor: barra superior própria, sem a sidebar
 * administrativa, com o nome do usuário, saída e retorno da personificação.
 * Monta o único consumidor de flash das telas do portal.
 */
export default function TeacherPortalLayout({ children }: { children: ReactNode }): React.JSX.Element {
    const { props, url } = usePage<TeacherPortalLayoutProps>();
    const { auth, impersonating, impersonationReadOnly } = props;

    return (
        <div className="teacherPortalLayout">
            <header className="teacherPortalLayout__topbar">
                <Link href="/professor" className="teacherPortalLayout__brand" aria-label="Início do Portal do Professor - Gnai">
                    <img src="/images/logo2.png" alt="" className="teacherPortalLayout__logo" />
                    <span>Portal do Professor</span>
                </Link>
                <div className="teacherPortalLayout__session">
                    {impersonating && auth.user ? (
                        <p className="teacherPortalLayout__impersonation">
                            <i className="fa fa-user-secret" aria-hidden="true" />
                            <span>
                                Navegando como <strong>{auth.user.name}</strong>
                                {" "}({impersonationReadOnly ? "somente leitura" : "acesso completo"})
                            </span>
                        </p>
                    ) : auth.user ? (
                        <span className="teacherPortalLayout__userName">{auth.user.name}</span>
                    ) : null}
                    {impersonating ? (
                        <Button
                            tone="white"
                            size="sm"
                            leftIconClass="ti-back-left"
                            label="Minha conta"
                            title="Voltar para a minha conta"
                            aria-label="Voltar para a minha conta"
                            onClick={() => router.post("/autenticacao/acessar-como/encerrar")}
                        />
                    ) : null}
                    <Button
                        tone="white"
                        size="sm"
                        leftIconClass="fa fa-sign-out"
                        label="Sair"
                        title="Sair do Gnai"
                        aria-label="Sair do Gnai"
                        onClick={() => router.post("/autenticacao/sair")}
                    />
                </div>
            </header>
            <div className="teacherPortalLayout__content">
                <PageErrorBoundary resetKey={url} homeHref="/professor">
                    {children}
                </PageErrorBoundary>
            </div>
            <AppFooter>
                Gnai &copy; {new Date().getFullYear()} | Gestão NAIs
            </AppFooter>
            <FlashNotifications />
        </div>
    );
}

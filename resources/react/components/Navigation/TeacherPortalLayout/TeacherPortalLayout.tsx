import type { ReactNode } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import RenderErrorScreen from '@/components/Errors/RenderErrorScreen';
import AppFooter from '@/components/Navigation/AppFooter/AppFooter';
import ImpersonationIndicator from '@/components/Navigation/ImpersonationIndicator/ImpersonationIndicator';
import SkipLinks, { type SkipLinkItem } from '@/components/Navigation/SkipLinks/SkipLinks';
import Button from '@/components/UI/Button/Button';
import FlashNotifications from '@/components/UI/FlashNotifications/FlashNotifications';
import GuidedTourProvider from '@/components/UI/GuidedTour/GuidedTourProvider';
import { useGuidedTourState } from '@/components/UI/GuidedTour/useGuidedTour';
import PageErrorBoundary from '@/components/UI/PageErrorBoundary/PageErrorBoundary';
import './TeacherPortalLayout.css';

const HOME_HREF = '/professor';

/** Mesma numeração da área administrativa; o portal não tem menu lateral. */
const SKIP_LINKS: SkipLinkItem[] = [
    { label: 'Conteúdo', accessKey: '1', targetId: 'conteudo' },
    { label: 'Página inicial', accessKey: '2', href: HOME_HREF },
    { label: 'Rodapé', accessKey: '4', targetId: 'rodape' },
];

/** Abre e fecha o tutorial da tela do portal; só aparece quando a tela tem um. */
function PortalTourButton(): React.JSX.Element | null {
    const { available, active, start, stop } = useGuidedTourState();

    if (!available) {
        return null;
    }

    return (
        <Button
            tone="white"
            size="sm"
            leftIconClass="icon-info"
            label="Tutorial"
            title={active ? 'Fechar o tutorial desta tela' : 'Abrir o tutorial desta tela'}
            aria-label="Tutorial desta tela"
            aria-expanded={active}
            onClick={active ? stop : start}
        />
    );
}

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
export default function TeacherPortalLayout({
    children,
}: {
    children: ReactNode;
}): React.JSX.Element {
    const { props, url } = usePage<TeacherPortalLayoutProps>();
    const { auth, impersonating, impersonationReadOnly } = props;

    let sessionIdentity: ReactNode = null;
    if (auth.user) {
        sessionIdentity = impersonating ? (
            <ul className="teacherPortalLayout__impersonationNav">
                <ImpersonationIndicator name={auth.user.name} readOnly={impersonationReadOnly} />
            </ul>
        ) : (
            <span className="teacherPortalLayout__userName">{auth.user.name}</span>
        );
    }

    // A falha de renderização troca o portal inteiro pela tela de erro avulsa.
    return (
        <PageErrorBoundary resetKey={url} fallback={<RenderErrorScreen homeHref={HOME_HREF} />}>
            <SkipLinks items={SKIP_LINKS} />
            <GuidedTourProvider>
                <div className="teacherPortalLayout">
                    <header className="teacherPortalLayout__topbar">
                        <Link
                            href={HOME_HREF}
                            className="teacherPortalLayout__brand"
                            aria-label="Início do Portal do Professor - Gnai"
                        >
                            <img
                                src="/images/logo2.png"
                                alt=""
                                className="teacherPortalLayout__logo"
                            />
                            <span>Portal do Professor</span>
                        </Link>
                        <div className="teacherPortalLayout__session">
                            {sessionIdentity}
                            <PortalTourButton />
                            <Button
                                tone="white"
                                size="sm"
                                leftIconClass="fa fa-sign-out"
                                label="Sair"
                                title="Sair do Gnai"
                                aria-label="Sair do Gnai"
                                onClick={() => router.post('/autenticacao/sair')}
                            />
                        </div>
                    </header>
                    <div id="conteudo" className="teacherPortalLayout__content" tabIndex={-1}>
                        {children}
                    </div>
                    <AppFooter id="rodape">
                        Gnai &copy; {new Date().getFullYear()} | Gestão NAIs
                    </AppFooter>
                    <FlashNotifications />
                </div>
            </GuidedTourProvider>
        </PageErrorBoundary>
    );
}

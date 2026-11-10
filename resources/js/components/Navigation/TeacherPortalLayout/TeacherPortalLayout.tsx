import { joinClassNames } from '@/utils/joinClassNames';
import SessionActivity from '@/components/Auth/Session/SessionActivity';
import type { SessionSecurityState } from '@/components/Auth/Session/Session.types';
import type { ReactNode } from 'react';
import { Link, usePage } from '@inertiajs/react';
import RenderErrorScreen from '@/components/Errors/RenderErrorScreen';
import AppFooter from '@/components/Navigation/AppFooter/AppFooter';
import ImpersonationIndicator from '@/components/Navigation/ImpersonationIndicator/ImpersonationIndicator';
import SkipLinks, { type SkipLinkItem } from '@/components/Navigation/SkipLinks/SkipLinks';
import FlashNotifications from '@/components/UI/FlashNotifications/FlashNotifications';
import GuidedTourProvider from '@/components/UI/GuidedTour/GuidedTourProvider';
import PageErrorBoundary from '@/components/UI/PageErrorBoundary/PageErrorBoundary';
import TeacherPortalActions from './TeacherPortalActions';
import '@styles/components/Navigation/TeacherPortalLayout/TeacherPortalLayout.css';

const HOME_HREF = '/professor';

/** Mesma numeração da área administrativa; o portal não tem menu lateral. */
const SKIP_LINKS: SkipLinkItem[] = [
    { label: 'Conteúdo', accessKey: '1', targetId: 'conteudo' },
    { label: 'Página inicial', accessKey: '2', href: HOME_HREF },
    { label: 'Rodapé', accessKey: '4', targetId: 'rodape' },
];

interface TeacherPortalLayoutProps {
    auth: { user: { name: string; photo_url: string } | null };
    sessionSecurity: SessionSecurityState | null;
    teacherPortalView: 'centered' | 'full';
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
            <SessionActivity />
            <SkipLinks items={SKIP_LINKS} />
            <GuidedTourProvider>
                <div
                    className={joinClassNames(
                        'teacherPortalLayout',
                        props.teacherPortalView === 'centered' && 'teacherPortalLayout--centered',
                    )}
                >
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
                            <TeacherPortalActions
                                user={auth.user}
                                canLock={props.sessionSecurity?.canLock === true}
                                impersonating={impersonating}
                                viewMode={props.teacherPortalView}
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

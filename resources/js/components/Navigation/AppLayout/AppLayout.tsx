import SessionActivity from '@/components/Auth/Session/SessionActivity';
import type { ReactNode } from 'react';
import { usePage } from '@inertiajs/react';
import RenderErrorScreen from '@/components/Errors/RenderErrorScreen';
import AppFooter from '@/components/Navigation/AppFooter/AppFooter';
import ImpersonationIndicator from '@/components/Navigation/ImpersonationIndicator/ImpersonationIndicator';
import InstitutionBrand from '@/components/Navigation/InstitutionBrand/InstitutionBrand';
import SidebarPrimary from '@/components/Navigation/SidebarPrimary/SidebarPrimary';
import SkipLinks, { type SkipLinkItem } from '@/components/Navigation/SkipLinks/SkipLinks';
import TopBarPrimary from '@/components/Navigation/TopBarPrimary/TopBarPrimary';
import TopBarTourAction from '@/components/Navigation/TopBarPrimary/TopBarTourAction';
import type { ProfileLink } from '@/components/Navigation/TopBarPrimary/TopBarPrimary.data';
import FlashNotifications from '@/components/UI/FlashNotifications/FlashNotifications';
import GuidedTourProvider from '@/components/UI/GuidedTour/GuidedTourProvider';
import PageErrorBoundary from '@/components/UI/PageErrorBoundary/PageErrorBoundary';
import PageScrollbar from '@/components/UI/PageScrollbar/PageScrollbar';
import '@styles/app-shell.css';
import type { AppLayoutProps } from './AppLayout.types';
import { useAppSidebar } from './useAppSidebar';
import '@styles/components/Navigation/AppLayout/AppLayout.css';

const HOME_HREF = '/autenticacao/painel';
const CONTENT_ID = 'conteudo';
const FOOTER_ID = 'rodape';

export default function AppLayout({ children }: { children: ReactNode }): React.JSX.Element {
    const { props, url } = usePage<AppLayoutProps>();
    const sidebar = useAppSidebar(url);
    const { auth, navigation, topbar, impersonating, impersonationReadOnly } = props;

    if (!auth.user) {
        return <>{children}</>;
    }

    const canLock = props.sessionSecurity?.canLock === true;
    const profileItems: ProfileLink[] = [
        ...(canLock
            ? [
                  {
                      label: 'Bloquear tela',
                      iconClass: 'ti-lock',
                      href: '/autenticacao/sessao/bloquear',
                      method: 'post' as const,
                  },
              ]
            : []),
        { label: 'Perfil', iconClass: 'ti-user', href: '/autenticacao/perfil' },
        ...(impersonating
            ? [
                  {
                      label: 'Voltar para a minha conta',
                      iconClass: 'ti-back-left',
                      href: '/autenticacao/acessar-como/encerrar',
                      method: 'post' as const,
                  },
              ]
            : []),
        {
            label: 'Sair',
            iconClass: 'ti-power-off',
            href: '/autenticacao/sair',
            method: 'post',
        },
    ];

    // Atalhos na ordem e numeração do eMAG/gov.br; o Gnai não tem busca global.
    const skipLinks: SkipLinkItem[] = [
        { label: 'Conteúdo', accessKey: '1', targetId: CONTENT_ID },
        { label: 'Página inicial', accessKey: '2', href: HOME_HREF },
        {
            label: 'Menu',
            accessKey: '3',
            targetId: 'sidebar-menu',
            onBeforeFocus: sidebar.openOnMobile,
        },
        { label: 'Rodapé', accessKey: '4', targetId: FOOTER_ID },
    ];

    // A falha de renderização troca o layout inteiro pela tela de erro avulsa.
    return (
        <PageErrorBoundary resetKey={url} fallback={<RenderErrorScreen homeHref={HOME_HREF} />}>
            <SessionActivity />
            <SkipLinks items={skipLinks} />
            {/* O tutorial envolve a barra do topo (botão) e o conteúdo (tutorial de cada tela). */}
            <GuidedTourProvider>
                <div
                    className={`app-page gnaiApp${sidebar.collapsed ? ' app-page--sidebarCollapsed' : ''}`}
                >
                    <TopBarPrimary
                        brand="Gnai"
                        compactLogoSrc="/images/logo2.png"
                        expandedLogoText="NAI"
                        homeHref={HOME_HREF}
                        sidebarCollapsed={sidebar.collapsed}
                        onToggleSidebar={sidebar.toggle}
                        user={auth.user}
                        profileItems={profileItems}
                        notificationItems={topbar?.notifications ?? []}
                        unreadCount={topbar?.unreadCount ?? 0}
                        notificationsHref="/notificacoes"
                        showSettings={false}
                        actionsContent={
                            <>
                                {impersonating ? (
                                    <ImpersonationIndicator
                                        name={auth.user.name}
                                        readOnly={impersonationReadOnly}
                                    />
                                ) : null}
                                <TopBarTourAction />
                            </>
                        }
                        leadingContent={
                            <InstitutionBrand
                                name={topbar?.institutionName ?? 'Gnai'}
                                href={
                                    navigation.entries.some((item) => item.key === 'institutions')
                                        ? '/instituicoes'
                                        : undefined
                                }
                            />
                        }
                    />
                    <SidebarPrimary
                        collapsed={sidebar.collapsed}
                        entries={navigation.entries}
                        currentItemKey={navigation.currentItemKey ?? undefined}
                    />
                    {!sidebar.collapsed ? (
                        <button
                            className="gnaiApp__overlay"
                            type="button"
                            onClick={sidebar.closeOnMobile}
                            aria-label="Fechar menu lateral"
                        />
                    ) : null}
                    <div className="app-content-placeholder">
                        <div
                            id={CONTENT_ID}
                            className="app-content-placeholder__inner"
                            tabIndex={-1}
                        >
                            {children}
                        </div>
                        <AppFooter id={FOOTER_ID}>
                            Gnai &copy; {new Date().getFullYear()} | Gestão NAIs
                        </AppFooter>
                    </div>
                    <FlashNotifications />
                    <PageScrollbar />
                </div>
            </GuidedTourProvider>
        </PageErrorBoundary>
    );
}

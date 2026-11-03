import type { ReactNode } from 'react';
import { usePage } from '@inertiajs/react';
import AppLayout from '@/components/Navigation/AppLayout/AppLayout';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';
import PageTabs from '@/components/Navigation/PageTabs/PageTabs';
import { settingsCategories } from './Settings.constants';
import { settingsBreadcrumb } from './Settings.routes';
import { SETTINGS_TOUR_TARGETS, settingsTours } from './settingsTours';

/**
 * Moldura das configurações: título, breadcrumb e abas das categorias. O layout é persistente e
 * as páginas não lhe passam props, então o tutorial é escolhido pela categoria aberta.
 */
function SettingsPage({ children }: { children: ReactNode }): React.JSX.Element {
    const { component } = usePage();
    const current =
        settingsCategories.find((item) => item.component === component) ?? settingsCategories[0];

    return (
        <BusinessPage
            title="Configurações"
            breadcrumbItems={settingsBreadcrumb(current.label)}
            className="settingsPage"
            tour={settingsTours[current.key]}
        >
            <PageTabs
                items={settingsCategories}
                activeKey={current.key}
                ariaLabel="Categorias de configuração"
                tourTarget={SETTINGS_TOUR_TARGETS.tabs}
            />
            {children}
        </BusinessPage>
    );
}

/**
 * Layout persistente das páginas `Settings/*`: mantém o cabeçalho e as abas montados ao trocar de
 * categoria. Atribua-o em `Pagina.layout`.
 */
export default function SettingsLayout({ children }: { children: ReactNode }): React.JSX.Element {
    return (
        <AppLayout>
            <SettingsPage>{children}</SettingsPage>
        </AppLayout>
    );
}

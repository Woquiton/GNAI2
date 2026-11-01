import type { ReactNode } from "react";
import { usePage } from "@inertiajs/react";
import BusinessPage from "@/components/Navigation/BusinessPage/BusinessPage";
import AppLayout from "@/components/Navigation/AppLayout/AppLayout";
import PageTabs from "@/components/Navigation/PageTabs/PageTabs";
import "./Settings.css";

export const settingsBase = "/configuracoes";

// Novas categorias de configuração entram nesta lista, cada uma com sua página.
const categories = [
    {
        key: "mail",
        component: "Settings/Mail",
        label: "E-mail",
        href: `${settingsBase}/email`,
        iconClass: "fa fa-envelope",
    },
    {
        key: "backup",
        component: "Settings/Backup",
        label: "Backups",
        href: `${settingsBase}/backups`,
        iconClass: "fa fa-database",
    },
] as const;

export default function SettingsPage({
    children,
}: {
    children: ReactNode;
}): React.JSX.Element {
    const { component } = usePage();
    const current = categories.find((item) => item.component === component) ?? categories[0];
    const category = current.key;

    return (
        <BusinessPage
            title="Configurações"
            breadcrumbItems={[
                { label: "Home", href: "/autenticacao/painel" },
                { label: "Configurações", href: settingsBase },
                { label: current?.label ?? "" },
            ]}
            className="settingsPage"
        >
            <PageTabs
                items={categories}
                activeKey={category}
                ariaLabel="Categorias de configuração"
            />
            {children}
        </BusinessPage>
    );
}

export function SettingsLayout({ children }: { children: ReactNode }): React.JSX.Element {
    return (
        <AppLayout>
            <SettingsPage>{children}</SettingsPage>
        </AppLayout>
    );
}

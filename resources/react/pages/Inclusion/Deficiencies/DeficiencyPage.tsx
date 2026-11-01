import type { ReactNode } from "react";
import BusinessPage from "@/components/Navigation/BusinessPage/BusinessPage";
import type { PageBreadcrumbItem } from "@/components/Navigation/PageBreadcrumb/PageBreadcrumb";

export const deficiencyBase = "/inclusao/deficiencias";

export default function DeficiencyPage({
    title,
    subtitle,
    current,
    deficiency,
    actions,
    children,
}: {
    title: string;
    subtitle?: string;
    current?: string;
    deficiency?: { id: number; name: string };
    actions?: ReactNode;
    children: ReactNode;
}): React.JSX.Element {
    const breadcrumbItems: PageBreadcrumbItem[] = [
        { label: "Home", href: "/autenticacao/painel" },
        { label: "Perfis de Atendimento", href: current || deficiency ? deficiencyBase : undefined },
    ];

    if (deficiency) {
        breadcrumbItems.push({
            label: deficiency.name,
            href: current ? `${deficiencyBase}/${deficiency.id}/visualizar` : undefined,
        });
    }

    if (current) breadcrumbItems.push({ label: current });

    return (
        <BusinessPage
            title={title}
            subtitle={subtitle}
            breadcrumbItems={breadcrumbItems}
            actions={actions}
            className="deficiencyPage"
        >
            {children}
        </BusinessPage>
    );
}

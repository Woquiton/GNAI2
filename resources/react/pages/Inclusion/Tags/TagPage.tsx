import type { ReactNode } from "react";
import BusinessPage from "@/components/Navigation/BusinessPage/BusinessPage";
import type { PageBreadcrumbItem } from "@/components/Navigation/PageBreadcrumb/PageBreadcrumb";

const base = "/inclusao/marcadores";

export default function TagPage({
    title,
    subtitle,
    current,
    tag,
    actions,
    children,
}: {
    title: string;
    subtitle?: string;
    current?: string;
    tag?: { id: number; name: string };
    actions?: ReactNode;
    children: ReactNode;
}): React.JSX.Element {
    const breadcrumbItems: PageBreadcrumbItem[] = [
        { label: "Home", href: "/autenticacao/painel" },
        { label: "Etiquetas", href: current ? base : undefined },
    ];

    if (tag) {
        breadcrumbItems.push({
            label: tag.name,
            href: current ? `${base}/${tag.id}` : undefined,
        });
    }

    if (current) breadcrumbItems.push({ label: current });

    return (
        <BusinessPage
            title={title}
            subtitle={subtitle}
            breadcrumbItems={breadcrumbItems}
            actions={actions}
            className="tagPage"
        >
            {children}
        </BusinessPage>
    );
}

import type { ReactNode } from "react";
import BusinessPage from "@/components/Navigation/BusinessPage/BusinessPage";
import type { PageBreadcrumbItem } from "@/components/Navigation/PageBreadcrumb/PageBreadcrumb";

export const courseBase = "/inclusao/cursos";

export default function CoursePage({
    title,
    subtitle,
    current,
    course,
    actions,
    children,
}: {
    title: string;
    subtitle?: string;
    current?: string;
    course?: { id: number; name: string };
    actions?: ReactNode;
    children: ReactNode;
}): React.JSX.Element {
    const breadcrumbItems: PageBreadcrumbItem[] = [
        { label: "Home", href: "/autenticacao/painel" },
        { label: "Cursos", href: current || course ? courseBase : undefined },
    ];

    if (course) {
        breadcrumbItems.push({
            label: course.name,
            href: current ? `${courseBase}/${course.id}/visualizar` : undefined,
        });
    }

    if (current) breadcrumbItems.push({ label: current });

    return (
        <BusinessPage
            title={title}
            subtitle={subtitle}
            breadcrumbItems={breadcrumbItems}
            actions={actions}
            className="coursePage"
        >
            {children}
        </BusinessPage>
    );
}

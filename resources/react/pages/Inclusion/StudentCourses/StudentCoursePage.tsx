import type { ReactNode } from "react";
import BusinessPage from "@/components/Navigation/BusinessPage/BusinessPage";
import type { PageBreadcrumbItem } from "@/components/Navigation/PageBreadcrumb/PageBreadcrumb";
import { aeeBase, studentsBase, studentUrl } from "@/components/Students/Students.utils";

export default function StudentCoursePage({
    title,
    subtitle,
    studentId,
    studentName,
    studentCourse,
    index = false,
    current = "Editar",
    actions,
    children,
}: {
    title: string;
    subtitle?: string;
    studentId: number;
    studentName: string;
    studentCourse?: { id: number; courseName: string };
    index?: boolean;
    current?: string | null;
    actions?: ReactNode;
    children: ReactNode;
}): React.JSX.Element {
    const breadcrumbItems: PageBreadcrumbItem[] = [
        { label: "Home", href: "/autenticacao/painel" },
        { label: "Alunos", href: studentsBase },
        { label: studentName, href: studentUrl(studentId) },
        {
            label: "Matrículas",
            href: index ? undefined : `${aeeBase}/alunos/${studentId}/historico`,
        },
    ];

    if (!index && studentCourse) {
        breadcrumbItems.push({
            label: studentCourse.courseName,
            href: current ? `${aeeBase}/cursos-do-aluno/${studentCourse.id}` : undefined,
        });

        if (current) {
            breadcrumbItems.push({ label: current });
        }
    } else if (!index) {
        breadcrumbItems.push({ label: "Cadastrar" });
    }

    return (
        <BusinessPage
            title={title}
            subtitle={subtitle}
            breadcrumbItems={breadcrumbItems}
            actions={actions}
            className="studentCoursePage"
        >
            {children}
        </BusinessPage>
    );
}

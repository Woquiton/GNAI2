import { Link, usePage } from '@inertiajs/react';
import '@styles/components/Navigation/PageBreadcrumb/PageBreadcrumb.css';

export interface PageBreadcrumbItem {
    label: string;
    href?: string;
}

interface PageBreadcrumbProps {
    items: PageBreadcrumbItem[];
}

export default function PageBreadcrumb({ items }: PageBreadcrumbProps): React.JSX.Element {
    const { usesTeacherPortal } = usePage<{ usesTeacherPortal: boolean }>().props;

    return (
        <ol className="pageBreadcrumb breadcrumb">
            {items.map((item: PageBreadcrumbItem, index: number) => {
                const isPortalHome = usesTeacherPortal && item.href === '/autenticacao/painel';
                const href = isPortalHome ? '/professor' : item.href;
                const label = isPortalHome ? 'Portal do Professor' : item.label;
                const isActive = index === items.length - 1;

                return (
                    <li key={`${item.label}-${index}`} className={isActive ? 'active' : undefined}>
                        {isActive || !href ? (
                            label
                        ) : (
                            <Link
                                href={href}
                                onClick={
                                    href === '#'
                                        ? (event) => event.preventDefault()
                                        : undefined
                                }
                            >
                                {label}
                            </Link>
                        )}
                    </li>
                );
            })}
        </ol>
    );
}

import { useEffect, type ReactNode } from 'react';
import { Head } from '@inertiajs/react';
import PageBreadcrumb, { type PageBreadcrumbItem } from '@/components/Navigation/PageBreadcrumb/PageBreadcrumb';
import PageTitle from '@/components/Navigation/PageTitle/PageTitle';
import { notifyOperationFailure } from '@/components/UI/NotificationToast/operationFeedback';
import { joinClassNames } from '@/utils/joinClassNames';
import './BusinessPage.css';

export interface BusinessPageProps {
    title: string;
    subtitle?: string;
    /** Título da aba do navegador, quando diferente do título visível (ex.: nome do registro). */
    documentTitle?: string;
    breadcrumbItems: PageBreadcrumbItem[];
    /** Ações à direita do título, como "Cadastrar" nas listagens. */
    actions?: ReactNode;
    pageTitleClassName?: string;
    className?: string;
    /** Falha geral enviada pelo controller; é apresentada no toast compartilhado. */
    error?: string | null;
    /** Marca a página como ocupada durante operações que afetam todo o conteúdo. */
    busy?: boolean;
    children: ReactNode;
}

/**
 * Moldura de toda tela de negócio: título da aba, breadcrumb, `PageTitle` e conteúdo.
 * Telas de listagem, cadastro, edição e visualização usam este componente diretamente ou por
 * meio do helper de breadcrumb do recurso.
 */
export default function BusinessPage({
    title,
    subtitle,
    documentTitle,
    breadcrumbItems,
    actions,
    pageTitleClassName,
    className,
    error,
    busy,
    children,
}: BusinessPageProps): React.JSX.Element {
    useEffect(() => {
        if (error) {
            notifyOperationFailure(error);
        }
    }, [error]);

    return (
        <main className={joinClassNames('businessPage', className)} aria-busy={busy || undefined}>
            <Head title={`${documentTitle ?? title} - Gnai`} />
            <nav aria-label="Localização">
                <PageBreadcrumb items={breadcrumbItems} />
            </nav>
            <PageTitle
                title={title}
                subtitle={subtitle}
                actions={actions}
                className={pageTitleClassName}
            />
            {children}
        </main>
    );
}

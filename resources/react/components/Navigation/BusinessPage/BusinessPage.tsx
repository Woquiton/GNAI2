import { useEffect, useMemo, type ReactNode } from 'react';
import { Head } from '@inertiajs/react';
import PageBreadcrumb, {
    type PageBreadcrumbItem,
} from '@/components/Navigation/PageBreadcrumb/PageBreadcrumb';
import { PAGE_BREADCRUMB_TOUR_TARGET } from '@/components/Navigation/PageBreadcrumb/pageBreadcrumbTour';
import PageTitle from '@/components/Navigation/PageTitle/PageTitle';
import type { GuidedTourPageConfig } from '@/components/UI/GuidedTour/GuidedTour.types';
import { useGuidedTourRegistration } from '@/components/UI/GuidedTour/useGuidedTour';
import { notifyOperationFailure } from '@/components/UI/NotificationToast/operationFeedback';
import { joinClassNames } from '@/utils/joinClassNames';
import { businessPageTour } from './businessPageTour';
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
    /**
     * Tutorial ao vivo da tela, aberto pelo botão de informação da barra do topo. Informe só os
     * passos da página; a trilha de navegação, o nome e as ações da tela entram sozinhos. Use uma
     * constante de módulo para o tutorial não ser registrado de novo a cada renderização.
     */
    tour?: GuidedTourPageConfig;
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
    tour,
    children,
}: BusinessPageProps): React.JSX.Element {
    const tourDefinition = useMemo(
        () => (tour ? businessPageTour(documentTitle ?? title, tour) : null),
        [tour, documentTitle, title],
    );

    useGuidedTourRegistration(tourDefinition);

    useEffect(() => {
        if (error) {
            notifyOperationFailure(error);
        }
    }, [error]);

    return (
        <main className={joinClassNames('businessPage', className)} aria-busy={busy || undefined}>
            <Head title={`${documentTitle ?? title} - Gnai`} />
            <nav aria-label="Localização" data-tour={PAGE_BREADCRUMB_TOUR_TARGET}>
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

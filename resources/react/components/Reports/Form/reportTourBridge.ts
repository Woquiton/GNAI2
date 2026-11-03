import { useEffect } from 'react';
import type { ReportPermissions } from '../Reports.types';
import type useReportBuilder from './useReportBuilder';

export interface ReportTourBridge {
    report: ReturnType<typeof useReportBuilder>;
    can: ReportPermissions;
}

/**
 * Ponte entre o gerador de relatórios montado e o tutorial ao vivo. As demonstrações usam as
 * mesmas ações do formulário (escolher o assunto, marcar informações, gerar a prévia), sem
 * simular cliques no seletor do assunto.
 */
export const reportTourBridge: { current: ReportTourBridge | null } = { current: null };

/** Mantém a ponte com o estado mais recente enquanto o formulário estiver na tela. */
export function useReportTourBridge(
    report: ReturnType<typeof useReportBuilder>,
    can: ReportPermissions,
): void {
    useEffect(() => {
        reportTourBridge.current = { report, can };
    });

    useEffect(
        () => () => {
            reportTourBridge.current = null;
        },
        [],
    );
}

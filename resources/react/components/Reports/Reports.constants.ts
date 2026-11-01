import type { Operator, ReportOperation } from './Reports.types';

export const operatorLabels: Record<Operator, string> = {
    eq: 'É igual a',
    neq: 'Diferente de',
    contains: 'Contém',
    gt: 'Maior que',
    gte: 'A partir de',
    lt: 'Menor que',
    lte: 'Até',
};

/** Texto do rodapé enquanto cada operação do construtor está em andamento. */
export const reportOperationStatus: Record<ReportOperation, string> = {
    run: 'Gerando prévia...',
    pdf: 'Gerando PDF...',
    copy: 'Copiando tabela...',
};

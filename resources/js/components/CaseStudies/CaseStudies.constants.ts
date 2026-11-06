import type { CaseStudyListFilters } from './CaseStudies.types';

export const emptyCaseStudyFilters: CaseStudyListFilters = {
    search: '',
    status: '',
    semester_id: '',
};

/** Mensagens do toast quando o servidor não conclui uma operação do Estudo de Caso. */
export const caseStudyFailureTexts = {
    list: 'Não foi possível atualizar os Estudos de Caso. Tente novamente.',
    save: 'Não foi possível salvar o Estudo de Caso. Tente novamente.',
    delete: 'Não foi possível excluir o Estudo de Caso. Tente novamente.',
    complete: 'Não foi possível concluir o Estudo de Caso. Tente novamente.',
    contribution: 'Não foi possível registrar a contribuição. Tente novamente.',
};

/** Pergunta da exclusão a partir das listagens, acompanhada do nome do registro. */
export const caseStudyDeleteMessage = 'Deseja remover este Estudo de Caso?';

/** Pergunta da exclusão a partir da visualização do próprio registro. */
export const caseStudyRecordDeleteMessage = 'Excluir permanentemente este Estudo de Caso?';

/** Nome do Estudo de Caso nos títulos, ações e confirmações ("Estudo de Caso v2 de Maria"). */
export function caseStudyName(caseStudy: {
    version: number;
    student?: { name: string } | null;
}): string {
    const owner = caseStudy.student?.name;

    return `Estudo de Caso v${caseStudy.version}${owner ? ` de ${owner}` : ''}`;
}

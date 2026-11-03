import { helpUrls } from '@/components/Help/Help.routes';
import type { TableListTourConfig } from '@/components/Tables/TableList/TableList';
import type { GuidedTourPageConfig } from '@/components/UI/GuidedTour/GuidedTour.types';

/** Valores de `data-tour` das partes do cadastro, da edição e da visualização da fila de espera. */
export const WAITLIST_TOUR_TARGETS = {
    identification: 'waitlist-identification',
    beneficiary: 'waitlist-beneficiary',
    observation: 'waitlist-observation',
    formActions: 'waitlist-form-actions',
    details: 'waitlist-details',
    detailsActions: 'waitlist-details-actions',
} as const;

const targets = WAITLIST_TOUR_TARGETS;
const HELP_SLUG = 'fila-de-espera';

export const waitlistListTour: TableListTourConfig = {
    helpHref: helpUrls.show(HELP_SLUG, 'acompanhar-a-fila'),
    filters: [
        'Digite o nome do item, do aluno ou do profissional para encontrar uma solicitação.',
        'A lista se atualiza sozinha enquanto você digita.',
    ],
    moreFilters:
        'Em Mais filtros, escolha o Status e o Semestre. Em Consultar no semestre, diferencie a origem, os iniciados, os que continuaram em andamento e os encerrados no período. Sem vínculo encontra registros cuja origem precisa de revisão do calendário.',
    table: [
        'Cada linha é uma solicitação, com o item, o beneficiário, a data, o status e quem registrou.',
        'Clique no nome do item para abrir o cadastro dele em outra aba. Use o botão de olho, no fim da linha, para abrir a solicitação.',
    ],
};

export const waitlistCreateTour: GuidedTourPageConfig = {
    helpHref: helpUrls.show(HELP_SLUG, 'cadastrar-uma-solicitacao-na-fila'),
    steps: [
        {
            id: 'waitlist-identification',
            target: targets.identification,
            group: 'Cadastro na fila',
            title: 'Identificação',
            content: [
                'Escolha primeiro o Tipo do Item. Depois, escolha o Item Específico. Só aparecem os itens que não podem ser emprestados agora.',
                'Os campos com asterisco (*) são obrigatórios. O Usuário Responsável pelo Registro é você e não pode ser alterado.',
            ],
        },
        {
            id: 'waitlist-beneficiary',
            target: targets.beneficiary,
            group: 'Cadastro na fila',
            title: 'Beneficiário',
            content: [
                'Nos campos logo acima, escolha quem vai receber o item em Aluno (Beneficiário) ou em Profissional (Beneficiário).',
                'Um dos dois é obrigatório, nunca ambos. Ao escolher um, o outro fica bloqueado.',
            ],
        },
        {
            id: 'waitlist-observation',
            target: targets.observation,
            group: 'Cadastro na fila',
            title: 'Observações',
            content:
                'Você pode registrar aqui qualquer informação útil sobre o pedido. Este campo não é obrigatório.',
        },
        {
            id: 'waitlist-form-actions',
            target: targets.formActions,
            group: 'Cadastro na fila',
            title: 'Cadastrar ou cancelar',
            content: [
                'Clique em Cadastrar para colocar o beneficiário na fila. A solicitação começa como Em Espera.',
                'Se faltar alguma informação, o aviso aparece embaixo do campo. Cancelar volta para a fila de espera sem salvar.',
            ],
        },
    ],
};

export const waitlistEditTour: GuidedTourPageConfig = {
    helpHref: helpUrls.show(HELP_SLUG, 'ver-editar-e-gerar-o-pdf-de-uma-solicitacao'),
    steps: [
        {
            id: 'waitlist-identification',
            target: targets.identification,
            group: 'Edição da solicitação',
            title: 'Identificação',
            content: [
                'Aqui aparecem o item, o beneficiário, o responsável e o status atual.',
                'Essas informações ficam só para consulta e não podem ser trocadas.',
            ],
        },
        {
            id: 'waitlist-observation',
            target: targets.observation,
            group: 'Edição da solicitação',
            title: 'Observações',
            content: 'Na edição, você pode mudar só as observações da solicitação.',
        },
        {
            id: 'waitlist-form-actions',
            target: targets.formActions,
            group: 'Edição da solicitação',
            title: 'Salvar ou cancelar',
            content: [
                'Clique em Salvar para gravar as observações.',
                'Cancelar volta para a solicitação sem salvar.',
            ],
        },
    ],
};

export const waitlistShowTour: GuidedTourPageConfig = {
    helpHref: helpUrls.show(HELP_SLUG, 'ver-editar-e-gerar-o-pdf-de-uma-solicitacao'),
    steps: [
        {
            id: 'waitlist-details',
            target: targets.details,
            title: 'Identificação',
            content: [
                'Mostra o item pedido, o beneficiário, quem registrou, a data, o status e as observações.',
                'Clique no nome do item para abrir o cadastro dele em outra aba.',
            ],
        },
        {
            id: 'waitlist-details-actions',
            target: targets.detailsActions,
            title: 'Ações da solicitação',
            content: [
                'PDF gera um arquivo com os dados da solicitação. Voltar leva para a fila de espera. Editar abre as observações para alterar.',
                'Cancelar solicitação aparece só enquanto ela está Em Espera. Excluir apaga a solicitação depois de pedir confirmação. Alguns botões só aparecem para quem tem permissão.',
            ],
        },
    ],
};

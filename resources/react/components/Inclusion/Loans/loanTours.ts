import { helpUrls } from '@/components/Help/Help.routes';
import type { TableListTourConfig } from '@/components/Tables/TableList/TableList';
import type { GuidedTourPageConfig } from '@/components/UI/GuidedTour/GuidedTour.types';

/** Valores de `data-tour` das partes do cadastro, da edição e da visualização do empréstimo. */
export const LOAN_TOUR_TARGETS = {
    identification: 'loan-identification',
    responsible: 'loan-responsible',
    departure: 'loan-departure',
    observation: 'loan-observation',
    formActions: 'loan-form-actions',
    editNotices: 'loan-edit-notices',
    editDetails: 'loan-edit-details',
    overdueNotice: 'loan-overdue-notice',
    details: 'loan-details',
    detailsActions: 'loan-details-actions',
} as const;

const targets = LOAN_TOUR_TARGETS;
const HELP_SLUG = 'emprestimos';
const CREATE_GROUP = 'Registro do empréstimo';
const EDIT_GROUP = 'Edição do empréstimo';

export const loanListTour: TableListTourConfig = {
    helpHref: helpUrls.show(HELP_SLUG, 'acompanhar-emprestimos-e-atrasos'),
    filters: [
        'Digite o nome do item, do estudante ou do profissional para encontrar um empréstimo.',
        'A lista se atualiza sozinha enquanto você digita.',
    ],
    moreFilters:
        'Em Mais filtros, escolha o Status e o Semestre. Em Consultar no semestre, diferencie a origem, os iniciados, os que continuaram em andamento e os encerrados no período. Sem vínculo encontra registros cuja origem precisa de revisão do calendário.',
    table: [
        'Cada linha é um empréstimo, com o item, o beneficiário, o prazo, o status e quem registrou. Quando a devolução está atrasada, o Prazo aparece destacado.',
        'Clique no nome do item para abrir o cadastro dele em outra aba. Use o botão de olho, no fim da linha, para abrir o empréstimo.',
    ],
};

export const loanCreateTour: GuidedTourPageConfig = {
    helpHref: helpUrls.show(HELP_SLUG, 'registrar-um-emprestimo'),
    steps: [
        {
            id: 'loan-identification',
            target: targets.identification,
            group: CREATE_GROUP,
            title: 'Identificação',
            content: [
                'Escolha primeiro o Tipo do Item. Depois, escolha o Item Específico. Só aparecem os itens que podem ser emprestados agora, com as unidades disponíveis.',
                'Em seguida, escolha quem vai receber o item: um Estudante ou um Profissional, só um dos dois. Os campos com asterisco (*) são obrigatórios.',
            ],
        },
        {
            id: 'loan-responsible',
            target: targets.responsible,
            group: CREATE_GROUP,
            title: 'Usuário Autenticado (Responsável)',
            content:
                'Aqui aparece o seu nome, como responsável pelo empréstimo. Este campo não pode ser alterado.',
        },
        {
            id: 'loan-departure',
            target: targets.departure,
            group: CREATE_GROUP,
            title: 'Data de Saída e Horário',
            content: [
                'A data e o horário da retirada já vêm preenchidos com o momento atual. Você pode ajustar se precisar.',
                'Logo depois, em Previsão de Devolução, informe o prazo para a entrega do item. Ele não pode ser antes da data de saída.',
            ],
        },
        {
            id: 'loan-observation',
            target: targets.observation,
            group: CREATE_GROUP,
            title: 'Observações / Estado do Item',
            content:
                'Você pode registrar aqui como o item saiu ou qualquer informação útil. Este campo não é obrigatório.',
        },
        {
            id: 'loan-form-actions',
            target: targets.formActions,
            group: CREATE_GROUP,
            title: 'Cadastrar ou cancelar',
            content: [
                'Clique em Cadastrar para registrar o empréstimo. Se faltar alguma informação, o aviso aparece embaixo do campo.',
                'Cancelar volta para a lista de empréstimos sem salvar.',
            ],
        },
    ],
};

export const loanEditTour: GuidedTourPageConfig = {
    helpHref: helpUrls.show(HELP_SLUG, 'editar-um-emprestimo'),
    steps: [
        {
            id: 'loan-edit-notices',
            target: targets.editNotices,
            group: EDIT_GROUP,
            title: 'Avisos',
            content:
                'Estes avisos mostram se o empréstimo já foi finalizado ou se a devolução está atrasada.',
        },
        {
            id: 'loan-edit-details',
            target: targets.editDetails,
            group: EDIT_GROUP,
            title: 'Identificação',
            content: [
                'Aqui aparecem o item, o beneficiário, o responsável, as datas e o status do empréstimo.',
                'Essas informações ficam só para consulta e não podem ser trocadas depois do registro.',
            ],
        },
        {
            id: 'loan-observation',
            target: targets.observation,
            group: EDIT_GROUP,
            title: 'Observações / Estado do Item',
            content: 'Na edição, você pode mudar só as observações do empréstimo.',
        },
        {
            id: 'loan-form-actions',
            target: targets.formActions,
            group: EDIT_GROUP,
            title: 'Salvar ou cancelar',
            content: [
                'Clique em Salvar observações para gravar o que você escreveu.',
                'Cancelar volta para o empréstimo sem salvar.',
            ],
        },
    ],
};

export const loanShowTour: GuidedTourPageConfig = {
    helpHref: helpUrls.show(HELP_SLUG),
    steps: [
        {
            id: 'loan-overdue-notice',
            target: targets.overdueNotice,
            title: 'Devolução atrasada',
            content:
                'Este aviso aparece quando o prazo de devolução já passou e o item ainda está com o beneficiário.',
        },
        {
            id: 'loan-details',
            target: targets.details,
            title: 'Identificação',
            content: [
                'Mostra o item, o beneficiário, o responsável, a data de saída, a previsão de devolução, o status e as observações.',
                'Clique no nome do item ou do estudante para abrir o cadastro, quando o nome aparecer como link.',
            ],
        },
        {
            id: 'loan-details-actions',
            target: targets.detailsActions,
            title: 'Ações do empréstimo',
            content: [
                'PDF gera o comprovante do empréstimo. Voltar leva para a lista. Editar abre as observações para alterar.',
                'Devolver aparece enquanto o item está com o beneficiário e pede confirmação, com a opção de marcar avarias. Excluir apaga o registro depois de pedir confirmação. Alguns botões só aparecem para quem tem permissão.',
            ],
        },
    ],
};

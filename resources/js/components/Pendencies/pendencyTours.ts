import { helpUrls } from '@/components/Help/Help.routes';
import type { TableListTourConfig } from '@/components/Tables/TableList/TableList';
import type { GuidedTourPageConfig } from '@/components/UI/GuidedTour/GuidedTour.types';

/** Valores de `data-tour` do formulário e da visualização da pendência. */
export const PENDENCY_TOUR_TARGETS = {
    formData: 'pendency-form-data',
    formActions: 'pendency-form-actions',
    details: 'pendency-details',
    detailsSystem: 'pendency-details-system',
    detailsActions: 'pendency-details-actions',
} as const;

const targets = PENDENCY_TOUR_TARGETS;
const HELP_SLUG = 'pendencias';

export const pendencyIndexTour: TableListTourConfig = {
    helpHref: helpUrls.show(HELP_SLUG, 'consultar-as-pendencias'),
    actions: [
        'Cadastrar pendência abre uma nova tarefa para um profissional da equipe. Minhas Pendências mostra só as pendências em que você é o responsável.',
        'Minhas Pendências aparece quando o seu usuário está ligado a um cadastro de profissional. Alguns botões só aparecem para quem tem permissão.',
    ],
    filters: [
        'Digite parte do título para encontrar uma pendência. Você também pode filtrar pelo profissional, pela prioridade ou pelo status: pendentes ou concluídas.',
        'A lista se atualiza sozinha enquanto você digita ou escolhe uma opção.',
    ],
    table: [
        'Cada linha é uma pendência, com o título, o profissional responsável, a prioridade, o vencimento e se já foi concluída.',
        'Use o botão de olho, no fim da linha, para abrir a pendência. As colunas Criado por, Descrição, Criado em e Atualizado em começam escondidas.',
    ],
};

export const pendencyMyTour: TableListTourConfig = {
    helpHref: helpUrls.show(HELP_SLUG, 'ver-as-pendencias-atribuidas-a-mim'),
    actions: 'Voltar leva para a lista com as pendências de toda a equipe.',
    filters: [
        'Aqui aparecem só as pendências em que você é o profissional responsável.',
        'Filtre pelo título, pela prioridade ou pelo status. A lista se atualiza sozinha.',
    ],
    table: [
        'Cada linha é uma pendência sua, com o título, a prioridade, o vencimento e o status: concluída ou pendente.',
        'Use o botão de olho, no fim da linha, para abrir a pendência e marcar como concluída quando terminar.',
    ],
};

export const pendencyCreateTour: GuidedTourPageConfig = {
    helpHref: helpUrls.show(HELP_SLUG, 'criar-uma-pendencia'),
    steps: [
        {
            id: 'pendency-form-data',
            target: targets.formData,
            title: 'Dados da Pendência',
            content: [
                'Escreva o título e, se quiser, uma descrição com mais detalhes. Depois, escolha o profissional responsável e a prioridade.',
                'A data de vencimento não é obrigatória. Quando informada, precisa ser hoje ou uma data futura. Os campos com asterisco (*) são obrigatórios.',
            ],
        },
        {
            id: 'pendency-form-actions',
            target: targets.formActions,
            title: 'Salvar ou cancelar',
            content: [
                'Clique em Salvar para criar a pendência. O profissional responsável recebe um aviso no sino da barra do topo.',
                'Cancelar volta para a lista de pendências sem salvar.',
            ],
        },
    ],
};

export const pendencyEditTour: GuidedTourPageConfig = {
    helpHref: helpUrls.show(HELP_SLUG, 'editar-uma-pendencia'),
    steps: [
        {
            id: 'pendency-form-data',
            target: targets.formData,
            title: 'Dados da Pendência',
            content: [
                'Altere o título, a descrição, o profissional responsável, a prioridade ou o vencimento.',
                'Os campos com asterisco (*) são obrigatórios. O vencimento, quando informado, precisa ser hoje ou uma data futura.',
            ],
        },
        {
            id: 'pendency-form-actions',
            target: targets.formActions,
            title: 'Salvar ou cancelar',
            content: [
                'Clique em Salvar para gravar as mudanças.',
                'Cancelar volta para a lista de pendências sem salvar.',
            ],
        },
    ],
};

export const pendencyShowTour: GuidedTourPageConfig = {
    helpHref: helpUrls.show(HELP_SLUG, 'concluir-uma-pendencia'),
    steps: [
        {
            id: 'pendency-details',
            target: targets.details,
            title: 'Identificação',
            content: [
                'Mostra o título, o profissional responsável, a prioridade, o vencimento e a descrição.',
                'Concluída mostra Sim quando a tarefa já foi terminada.',
            ],
        },
        {
            id: 'pendency-details-system',
            target: targets.detailsSystem,
            title: 'Informações do Sistema',
            content: 'Mostra quem criou a pendência, quando ela foi criada e a última atualização.',
        },
        {
            id: 'pendency-details-actions',
            target: targets.detailsActions,
            title: 'Ações da pendência',
            content: [
                'Voltar leva para a lista. Editar aparece para quem criou a pendência, enquanto ela não foi concluída.',
                'Marcar como Concluída aparece para o profissional responsável e pede confirmação. Quem criou a pendência recebe um aviso. Excluir apaga a pendência, depois de pedir confirmação.',
            ],
        },
    ],
};

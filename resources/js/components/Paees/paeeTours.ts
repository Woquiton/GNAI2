import { helpUrls } from '@/components/Help/Help.routes';
import type { TableListTourConfig } from '@/components/Tables/TableList/TableList';
import type {
    GuidedTourPageConfig,
    GuidedTourStep,
} from '@/components/UI/GuidedTour/GuidedTour.types';

/** Valores de `data-tour` das seções do formulário e da visualização do PAEE. */
export const PAEE_TOUR_TARGETS = {
    attendance: 'paee-attendance',
    assistiveTechnology: 'paee-assistive-technology',
    supports: 'paee-supports',
    objectives: 'paee-objectives',
    resources: 'paee-resources',
    articulations: 'paee-articulations',
    formActions: 'paee-form-actions',
    details: 'paee-details',
    detailsAssistiveTechnology: 'paee-details-assistive-technology',
    detailsSupports: 'paee-details-supports',
    detailsObjectives: 'paee-details-objectives',
    detailsResources: 'paee-details-resources',
    detailsArticulations: 'paee-details-articulations',
    reviews: 'paee-reviews',
    reviewForm: 'paee-review-form',
    detailsActions: 'paee-details-actions',
} as const;

const targets = PAEE_TOUR_TARGETS;
const HELP_SLUG = 'paee';

export const paeeListTour: TableListTourConfig = {
    helpHref: helpUrls.show(HELP_SLUG, 'onde-encontro-os-paees'),
    filters: [
        'Em Aluno, digite o nome do aluno. Você também pode filtrar pelo semestre e pelo status do PAEE.',
        'A lista se atualiza sozinha. O PAEE é criado pelo Estudo de Caso concluído do aluno, por isso esta tela não tem botão de cadastro.',
    ],
    table: [
        'Cada linha é um PAEE, com o aluno, o semestre, a versão, o status e a data da próxima revisão.',
        'No fim da linha, use os botões para visualizar, editar ou excluir o PAEE. Alguns botões só aparecem para quem tem permissão.',
    ],
};

type PaeeFormMode = 'create' | 'edit';

function paeeFormSteps(mode: PaeeFormMode): GuidedTourStep[] {
    const group = mode === 'create' ? 'Cadastro do PAEE' : 'Edição do PAEE';

    return [
        {
            id: 'paee-attendance',
            target: targets.attendance,
            group,
            title: 'Caracterização do Atendimento',
            content: [
                'Informe quantas vezes por semana o aluno será atendido, de 1 a 7, e a duração em minutos. Escolha também o formato e o local do atendimento.',
                'Os campos com asterisco (*) são obrigatórios.',
            ],
        },
        {
            id: 'paee-assistive-technology',
            target: targets.assistiveTechnology,
            group,
            title: 'Tecnologia Assistiva e CAA',
            content: [
                'Marque se o aluno precisa de tecnologia assistiva ou de Comunicação Aumentativa e Alternativa. Ao marcar, as observações daquela opção passam a ser obrigatórias.',
                'Se a tecnologia indicada for um dispositivo digital portátil, como tablet ou notebook, marque a opção e escreva o parecer pedagógico ao lado.',
            ],
        },
        {
            id: 'paee-supports',
            target: targets.supports,
            group,
            title: 'Apoios de Profissionais',
            content: [
                'Marque se o aluno precisa de profissional de apoio, de intérprete de Libras ou de guia-intérprete.',
                'Cada apoio marcado pede uma justificativa. A necessidade é avaliada pelo Estudo de Caso, sem precisar de laudo médico.',
            ],
        },
        {
            id: 'paee-objectives',
            target: targets.objectives,
            group,
            title: 'Objetivos',
            content: [
                'Clique em Objetivo para incluir um objetivo. Cada um pede a descrição e o prazo: Curto, Médio ou Longo.',
                'Em Barreira Vinculada, você pode escolher uma barreira do Estudo de Caso de origem. Use o botão ao lado do prazo para remover o objetivo.',
            ],
        },
        {
            id: 'paee-resources',
            target: targets.resources,
            group,
            title: 'Recursos',
            content: [
                'Clique em Recurso para incluir um recurso ou material. Cada um pede a descrição e o tipo de aquisição: A produzir, A acessibilizar ou A adquirir.',
                'Em Tecnologia Assistiva, você pode escolher um item cadastrado. Se não houver recurso, deixe a lista vazia.',
            ],
        },
        {
            id: 'paee-articulations',
            target: targets.articulations,
            group,
            title: 'Articulações e Orientações',
            content: [
                'Registre as orientações à escola e como serão envolvidos os professores, a família e outros setores. Informe também as demandas de formação.',
                'Esses campos não são obrigatórios.',
            ],
        },
        {
            id: 'paee-form-actions',
            target: targets.formActions,
            group,
            title: 'Salvar ou cancelar',
            content:
                mode === 'create'
                    ? [
                          'Clique em Salvar para criar o PAEE. Ele começa como Ativo, no semestre atual, com a próxima revisão marcada para seis meses depois.',
                          'Se faltar alguma informação, o aviso aparece embaixo do campo. Cancelar volta para o Estudo de Caso sem salvar.',
                      ]
                    : [
                          'Clique em Salvar para gravar as mudanças. Se você mudar o atendimento, a tecnologia assistiva, os apoios ou as articulações, uma revisão é registrada sozinha com os campos alterados.',
                          'Se faltar alguma informação, o aviso aparece embaixo do campo. Cancelar volta para o PAEE sem salvar.',
                      ],
        },
    ];
}

export const paeeCreateTour: GuidedTourPageConfig = {
    helpHref: helpUrls.show(HELP_SLUG, 'criar-um-paee'),
    steps: paeeFormSteps('create'),
};

export const paeeEditTour: GuidedTourPageConfig = {
    helpHref: helpUrls.show(HELP_SLUG, 'editar-um-paee'),
    steps: paeeFormSteps('edit'),
};

const DETAILS_GROUP = 'Dados do plano';
const REVIEWS_GROUP = 'Revisões';

export const paeeShowTour: GuidedTourPageConfig = {
    helpHref: helpUrls.show(HELP_SLUG),
    steps: [
        {
            id: 'paee-details',
            target: targets.details,
            group: DETAILS_GROUP,
            title: 'Dados do PAEE',
            content: [
                'Mostra o status, o semestre, quem elaborou e o Estudo de Caso de origem. Clique no nome do Estudo de Caso para abrir, quando ele aparece como link.',
                'Também mostra a frequência, a duração, o formato, o local e a data da próxima revisão.',
            ],
        },
        {
            id: 'paee-details-assistive-technology',
            target: targets.detailsAssistiveTechnology,
            group: DETAILS_GROUP,
            title: 'Tecnologia Assistiva e CAA',
            content: [
                'Mostra se o aluno precisa de tecnologia assistiva e de CAA, com as observações de cada uma.',
                'Textos longos aparecem resumidos. Clique em Ver mais, embaixo do texto, para ler tudo.',
            ],
        },
        {
            id: 'paee-details-supports',
            target: targets.detailsSupports,
            group: DETAILS_GROUP,
            title: 'Apoios de Profissionais',
            content:
                'Mostra se o aluno precisa de profissional de apoio, de intérprete de Libras ou de guia-intérprete. A justificativa aparece para cada apoio marcado.',
        },
        {
            id: 'paee-details-objectives',
            target: targets.detailsObjectives,
            group: DETAILS_GROUP,
            title: 'Objetivos',
            content:
                'Cada bloco é um objetivo, com a descrição, o prazo e a barreira vinculada, quando houver.',
        },
        {
            id: 'paee-details-resources',
            target: targets.detailsResources,
            group: DETAILS_GROUP,
            title: 'Recursos',
            content:
                'Cada bloco é um recurso, com a descrição, o tipo de aquisição e a tecnologia assistiva, quando houver.',
        },
        {
            id: 'paee-details-articulations',
            target: targets.detailsArticulations,
            group: DETAILS_GROUP,
            title: 'Articulações e Orientações',
            content:
                'Mostra as orientações à escola, as articulações com professores, família e outros setores e as demandas de formação.',
        },
        {
            id: 'paee-reviews',
            target: targets.reviews,
            group: REVIEWS_GROUP,
            title: 'Revisões',
            content: [
                'Aqui fica o histórico de revisões do PAEE, com a data, quem revisou, o que mudou e por quê.',
                'As mudanças feitas pela edição também aparecem aqui, com os campos alterados.',
            ],
        },
        {
            id: 'paee-review-form',
            target: targets.reviewForm,
            group: REVIEWS_GROUP,
            title: 'Registrar uma revisão',
            content: [
                'Preencha O que mudou e Por quê. Os dois têm asterisco (*) e são obrigatórios. Depois clique em Registrar.',
                'O PAEE passa a Em revisão e a próxima revisão fica para seis meses a partir de hoje.',
            ],
        },
        {
            id: 'paee-details-actions',
            target: targets.detailsActions,
            title: 'Ações do PAEE',
            content: [
                'PDF abre o documento do PAEE em outra aba. Voltar leva para o prontuário do aluno, na aba do PAEE. Editar abre o PAEE para alterar.',
                'Excluir apaga o PAEE, os objetivos, os recursos e as revisões, depois de pedir confirmação. Alguns botões só aparecem para quem tem permissão.',
            ],
        },
    ],
};

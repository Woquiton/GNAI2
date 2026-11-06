import { helpUrls } from '@/components/Help/Help.routes';
import type { TableListTourConfig } from '@/components/Tables/TableList/TableList';
import type {
    GuidedTourPageConfig,
    GuidedTourStep,
} from '@/components/UI/GuidedTour/GuidedTour.types';

/** Valores de `data-tour` das seções do formulário e da visualização do Estudo de Caso. */
export const CASE_STUDY_TOUR_TARGETS = {
    demand: 'case-study-demand',
    listening: 'case-study-listening',
    potentials: 'case-study-potentials',
    barriers: 'case-study-barriers',
    strategies: 'case-study-strategies',
    acceptance: 'case-study-acceptance',
    formActions: 'case-study-form-actions',
    detailsBanner: 'case-study-details-banner',
    detailsSummary: 'case-study-details-summary',
    detailsListening: 'case-study-details-listening',
    detailsPotentials: 'case-study-details-potentials',
    detailsBarriers: 'case-study-details-barriers',
    detailsContributions: 'case-study-details-contributions',
    detailsActions: 'case-study-details-actions',
} as const;

const targets = CASE_STUDY_TOUR_TARGETS;
const HELP_SLUG = 'estudos-de-caso';

export const caseStudyListTour: TableListTourConfig = {
    helpHref: helpUrls.show(HELP_SLUG, 'onde-encontro-os-estudos-de-caso'),
    filters: [
        'Em Aluno, digite o nome do aluno. Você também pode filtrar pelo Semestre e pelo Status. A lista se atualiza sozinha.',
        'Esta tela não tem botão de cadastro. O Estudo de Caso é criado pela aba Estudos de Caso, no prontuário do aluno.',
    ],
    table: [
        'Cada linha é um Estudo de Caso, com o aluno, o semestre, a versão, o status e a data de criação.',
        'No fim da linha, o botão de olho abre o Estudo de Caso. Editar some depois da conclusão, e excluir some quando já existe um PAEE ligado a ele.',
    ],
};

type CaseStudyFormMode = 'create' | 'edit';

function caseStudyFormSteps(mode: CaseStudyFormMode): GuidedTourStep[] {
    const group = mode === 'create' ? 'Cadastro do Estudo de Caso' : 'Edição do Estudo de Caso';

    return [
        {
            id: 'case-study-demand',
            target: targets.demand,
            group,
            title: 'Identificação da Demanda',
            content: [
                mode === 'create'
                    ? 'Escolha a origem da demanda, que diz quem trouxe o caso. Informe também a data em que o estudo foi feito e um resumo dos participantes.'
                    : 'Aqui ficam a origem da demanda, a data do Estudo de Caso e o resumo dos participantes. Você pode corrigir qualquer um deles.',
                'Os campos com asterisco (*) são obrigatórios. A data e os participantes podem ficar em branco.',
            ],
        },
        {
            id: 'case-study-listening',
            target: targets.listening,
            group,
            title: 'Escuta e Observação',
            content: [
                'Registre a observação do estudante e o que foi ouvido do estudante, da família e dos professores. Esses três campos são obrigatórios.',
                'Outras informações e Observações da rede de cuidado não são obrigatórias.',
            ],
        },
        {
            id: 'case-study-potentials',
            target: targets.potentials,
            group,
            title: 'Potencialidades e Apoios',
            content: [
                'Descreva os aspectos favoráveis e os potenciais e interesses do aluno.',
                'Em Apoios necessários, marque ao menos uma opção. Se o aluno não precisa de apoio, marque Nenhum. A justificativa não é obrigatória.',
            ],
        },
        {
            id: 'case-study-barriers',
            target: targets.barriers,
            group,
            title: 'Barreiras Identificadas',
            content: [
                'Clique em Barreira para adicionar uma. Escolha a categoria e descreva a situação observada e a implicação na participação.',
                'Você pode adicionar quantas precisar. Para concluir o Estudo de Caso depois, é preciso ter ao menos uma barreira.',
            ],
        },
        {
            id: 'case-study-strategies',
            target: targets.strategies,
            group,
            title: 'Estratégias Propostas',
            content: [
                'Clique em Estratégia para adicionar uma e descreva o que a equipe propõe. O botão ao lado da descrição remove a estratégia.',
                'Para concluir o Estudo de Caso depois, é preciso ter ao menos uma estratégia.',
            ],
        },
        {
            id: 'case-study-acceptance',
            target: targets.acceptance,
            group,
            title: 'Aceite da Família/Estudante',
            content: [
                'Escolha o status de aceite: Aceito, Recusado ou Não aplicável. Ele é obrigatório.',
                'A data do aceite pode ficar em branco.',
            ],
        },
        {
            id: 'case-study-form-actions',
            target: targets.formActions,
            group,
            title: 'Salvar ou cancelar',
            content:
                mode === 'create'
                    ? [
                          'Clique em Salvar para gravar o Estudo de Caso. Ele começa Em andamento, no semestre atual, e a visualização abre em seguida.',
                          'Se faltar alguma informação, o aviso aparece embaixo do campo. Cancelar volta para o prontuário do aluno sem salvar.',
                      ]
                    : [
                          'Clique em Salvar para gravar as mudanças. Se faltar alguma informação, o aviso aparece embaixo do campo.',
                          'Cancelar volta para o Estudo de Caso sem salvar.',
                      ],
        },
    ];
}

export const caseStudyCreateTour: GuidedTourPageConfig = {
    helpHref: helpUrls.show(HELP_SLUG, 'criar-um-estudo-de-caso'),
    steps: caseStudyFormSteps('create'),
};

export const caseStudyEditTour: GuidedTourPageConfig = {
    helpHref: helpUrls.show(HELP_SLUG, 'editar-um-estudo-de-caso'),
    steps: caseStudyFormSteps('edit'),
};

export const caseStudyShowTour: GuidedTourPageConfig = {
    helpHref: helpUrls.show(HELP_SLUG),
    steps: [
        {
            id: 'case-study-details-banner',
            target: targets.detailsBanner,
            title: 'Aluno e situação',
            content: [
                'Mostra o aluno, a matrícula, o status do Estudo de Caso, a versão e o semestre.',
                'Em andamento ainda pode ser editado. Concluído fica só para consulta e libera o PAEE.',
            ],
        },
        {
            id: 'case-study-details-summary',
            target: targets.detailsSummary,
            title: 'Demanda, aceite e apoios',
            content:
                'Mostra a origem da demanda, a data, quem criou, os participantes, o aceite da família ou do estudante e os apoios necessários. Depois da conclusão, aparece também a data em Concluído em.',
        },
        {
            id: 'case-study-details-listening',
            target: targets.detailsListening,
            title: 'Escuta e Observação',
            content: [
                'Mostra a observação do estudante e as escutas do estudante, da família e dos professores.',
                'Textos longos aparecem recolhidos. Clique em Ver mais para ler tudo.',
            ],
        },
        {
            id: 'case-study-details-potentials',
            target: targets.detailsPotentials,
            title: 'Potencialidades',
            content: 'Mostra os aspectos favoráveis e os potenciais e interesses do aluno.',
        },
        {
            id: 'case-study-details-barriers',
            target: targets.detailsBarriers,
            title: 'Barreiras e Estratégias',
            content: [
                'Cada barreira mostra a categoria, a situação observada e a implicação na participação. Ao lado ficam as estratégias propostas.',
                'Para concluir, é preciso ter ao menos uma barreira e uma estratégia.',
            ],
        },
        {
            id: 'case-study-details-contributions',
            target: targets.detailsContributions,
            title: 'Contribuições',
            content: [
                'Funciona como uma conversa. Cada mensagem mostra quem escreveu, o papel, a data e o horário. As suas aparecem destacadas.',
                'Para contribuir, preencha Papel e Contribuição e clique em Adicionar. Você pode contribuir mesmo depois da conclusão.',
            ],
        },
        {
            id: 'case-study-details-actions',
            target: targets.detailsActions,
            title: 'Ações do Estudo de Caso',
            content: [
                'PDF gera um arquivo com o Estudo de Caso. Voltar leva para o prontuário do aluno. Editar aparece enquanto ele está Em andamento.',
                'Concluir pede confirmação e impede novas edições. Depois disso aparece Criar PAEE. Excluir pede confirmação e some quando já existe PAEE. Alguns botões só aparecem para quem tem permissão.',
            ],
        },
    ],
};

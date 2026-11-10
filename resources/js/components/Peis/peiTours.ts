import { helpUrls } from '@/components/Help/Help.routes';
import type { TableListTourConfig } from '@/components/Tables/TableList/TableList';
import type {
    GuidedTourDemo,
    GuidedTourPageConfig,
    GuidedTourStep,
} from '@/components/UI/GuidedTour/GuidedTour.types';

/** Valores de `data-tour` das telas do PEI e das adaptações curriculares. */
export const PEI_TOUR_TARGETS = {
    createInformation: 'pei-create-information',
    createActions: 'pei-create-actions',
    identification: 'pei-identification',
    recordTabs: 'pei-record-tabs',
    paeeTabLabel: 'pei-paee-tab-label',
    disciplinesTabLabel: 'pei-disciplines-tab-label',
    details: 'pei-details',
    paee: 'pei-paee',
    disciplines: 'pei-disciplines',
    attendance: 'pei-attendance',
    otherInfo: 'pei-other-info',
    detailsActions: 'pei-details-actions',
    disciplineSuggested: 'pei-discipline-suggested',
    disciplineOthers: 'pei-discipline-others',
    disciplineBulkActions: 'pei-discipline-bulk-actions',
    disciplineIdentification: 'pei-discipline-identification',
    disciplinePlanning: 'pei-discipline-planning',
    disciplineFormActions: 'pei-discipline-form-actions',
    disciplineDetails: 'pei-discipline-details',
    disciplineRevisions: 'pei-discipline-revisions',
    disciplineReminders: 'pei-discipline-reminders',
    disciplineDetailsActions: 'pei-discipline-details-actions',
} as const;

const targets = PEI_TOUR_TARGETS;
const HELP_SLUG = 'pei';

const LIST_TABLE_ACTIONS_TEXT =
    'Use o botão de olho, no fim da linha, para abrir o PEI. O botão de excluir aparece só para o responsável pelo PEI.';

export const peiAllTour: TableListTourConfig = {
    helpHref: helpUrls.show(HELP_SLUG, 'onde-encontro-os-peis'),
    filters: [
        'Filtre pelo estudante, pelo semestre, pela versão ou pelo status do PEI. A lista se atualiza sozinha.',
        'Esta tela não tem botão de cadastro. O PEI é gerado na aba PEIs do prontuário do aluno.',
    ],
    table: [
        'Cada linha é um PEI, com o estudante e a matrícula, o semestre, o curso, o status e a versão.',
        LIST_TABLE_ACTIONS_TEXT,
    ],
};

export const peiStudentIndexTour: TableListTourConfig = {
    helpHref: helpUrls.show(HELP_SLUG, 'onde-encontro-os-peis'),
    actions: [
        'Voltar leva para o prontuário do aluno, na aba PEIs. Cadastrar abre a tela Gerar Novo PEI.',
        'O botão Cadastrar só aparece para quem tem permissão.',
    ],
    filters: [
        'Filtre as versões do PEI deste aluno pelo semestre, pela versão ou pelo status.',
        'A lista se atualiza sozinha.',
    ],
    table: [
        'Cada linha é uma versão do PEI, com o semestre, a data de criação, o curso, o status e a versão. Na coluna Atual, Sim mostra a versão em uso.',
        LIST_TABLE_ACTIONS_TEXT,
    ],
};

export const peiCreateTour: GuidedTourPageConfig = {
    helpHref: helpUrls.show(HELP_SLUG, 'criar-um-pei'),
    steps: [
        {
            id: 'pei-create-information',
            target: targets.createInformation,
            title: 'Informações do PEI',
            content: [
                'Confira o estudante, o curso vinculado e o semestre vigente. Não há campos para preencher.',
                'O PEI é criado com esses dados e ligado ao PAEE vigente do aluno.',
            ],
        },
        {
            id: 'pei-create-actions',
            target: targets.createActions,
            title: 'Gerar ou cancelar',
            content: [
                'Clique em Gerar PEI para criar o plano. Ele começa sem adaptações, e você passa a ser o responsável por ele.',
                'Cancelar volta para os PEIs do aluno sem gerar nada.',
            ],
        },
    ],
};

/**
 * Abre uma aba do PEI para mostrar a seção que só aparece com ela aberta e devolve como voltar
 * para a aba anterior. A leitura espera a volta do passo anterior terminar.
 */
function tabDemo(tabKey: string, label: string) {
    return (): GuidedTourDemo => {
        const strip = document.querySelector<HTMLElement>(`[data-tour="${targets.recordTabs}"]`);

        if (!strip) {
            return {};
        }

        let previous: HTMLElement | null = null;
        const timer = window.setTimeout(() => {
            const tab = strip.querySelector<HTMLElement>(`[role="tab"][data-tab-key="${tabKey}"]`);
            const selected = strip.querySelector<HTMLElement>('[role="tab"][aria-selected="true"]');

            if (!tab || !selected || tab === selected) {
                return;
            }

            previous = selected;
            tab.click();
        }, 0);

        return {
            note: `Mostramos a aba ${label}. Ao sair do passo, a aba anterior volta.`,
            undo: () => {
                window.clearTimeout(timer);
                previous?.click();
            },
        };
    };
}

const TABS_GROUP = 'Abas do PEI';

export const peiShowTour: GuidedTourPageConfig = {
    helpHref: helpUrls.show(HELP_SLUG, 'visualizar-um-pei'),
    steps: [
        {
            id: 'pei-identification',
            target: targets.identification,
            title: 'Identificação do PEI',
            content:
                'Mostra a foto e o nome do aluno, a matrícula, a situação do aluno, a versão e o status do PEI.',
        },
        {
            id: 'pei-record-tabs',
            target: targets.recordTabs,
            group: TABS_GROUP,
            title: 'Abas do PEI',
            content: [
                'Cada aba mostra uma parte do plano: dados do PEI, PAEE vinculado, adaptações curriculares, acompanhamento e outras informações.',
                'Clique no nome de uma aba para abrir. Você vê só as abas que tem permissão para abrir.',
            ],
        },
        {
            id: 'pei-details',
            target: targets.details,
            availableWith: targets.recordTabs,
            onEnter: tabDemo('details', 'Dados do PEI'),
            group: TABS_GROUP,
            title: 'Dados do PEI',
            content:
                'Mostra o responsável, o curso, o semestre, a versão, a data de criação, o status e os perfis de atendimento do aluno.',
        },
        {
            id: 'pei-paee',
            target: targets.paee,
            availableWith: targets.paeeTabLabel,
            onEnter: tabDemo('paee', 'PAEE vinculado'),
            group: TABS_GROUP,
            title: 'PAEE Vinculado',
            content: [
                'Mostra o resumo do PAEE que fundamenta este PEI, como frequência, duração, formato e local do atendimento.',
                'Clique em Ver PAEE completo para abrir o PAEE.',
            ],
        },
        {
            id: 'pei-disciplines',
            target: targets.disciplines,
            availableWith: targets.disciplinesTabLabel,
            onEnter: tabDemo('disciplines', 'Adaptações curriculares'),
            group: TABS_GROUP,
            title: 'Adaptações curriculares',
            content: [
                'Cada linha é uma disciplina com adaptação, com o professor responsável. Enquanto o PEI não é finalizado, clique em Cadastrar para escolher as disciplinas e os professores.',
                'Nos botões da linha, você abre a adaptação ou gera o PDF. Editar e excluir aparecem para quem cadastrou a adaptação, e excluir só enquanto o PEI não for finalizado.',
            ],
        },
        {
            id: 'pei-discipline-filling',
            target: targets.disciplines,
            availableWith: targets.disciplinesTabLabel,
            onEnter: tabDemo('disciplines', 'Adaptações curriculares'),
            group: TABS_GROUP,
            title: 'Acompanhar o preenchimento',
            content: [
                'Preenchimento mostra A preencher enquanto houver apenas campos vazios ou textos provisórios. Iniciada indica que já existe conteúdo salvo, inclusive pela equipe.',
                'Professor iniciou mostra Sim quando há conteúdo e alterações salvas pelo responsável no histórico. Sem registro significa que não há essa confirmação; preencher pelo coordenador não marca o professor como participante.',
            ],
        },
        {
            id: 'pei-attendance',
            target: targets.attendance,
            availableWith: targets.recordTabs,
            onEnter: tabDemo('attendance', 'Acompanhamento'),
            group: TABS_GROUP,
            title: 'Acompanhamento',
            content: [
                'Reúne sozinho os atendimentos AEE e pedagógicos do aluno dentro do semestre do PEI. Você não precisa preencher nada aqui.',
                'Aparecem as atividades na SRM e em outros espaços, o acompanhamento e as devolutivas às famílias.',
            ],
        },
        {
            id: 'pei-other-info',
            target: targets.otherInfo,
            availableWith: targets.recordTabs,
            onEnter: tabDemo('other-info', 'Outras informações'),
            group: TABS_GROUP,
            title: 'Outras Informações Relevantes',
            content: [
                'Registre aqui o que for importante e não couber nas outras partes do PEI. Clique em Salvar para gravar.',
                'Quem não pode editar PEIs vê só o texto já registrado. Este campo continua editável depois de finalizar o PEI.',
            ],
        },
        {
            id: 'pei-details-actions',
            target: targets.detailsActions,
            title: 'Ações do PEI',
            content: [
                'PDF gera o PEI completo. PDF para a Família gera um resumo para a família. Voltar leva para o prontuário do aluno.',
                'Finalizar e Excluir aparecem só para o responsável pelo PEI e pedem confirmação. Para finalizar, todas as adaptações precisam estar preenchidas. Depois disso, você pode gerar uma nova versão.',
            ],
        },
    ],
};

export const peiDisciplineCreateTour: GuidedTourPageConfig = {
    helpHref: helpUrls.show(HELP_SLUG, 'cadastrar-as-adaptacoes-por-disciplina'),
    steps: [
        {
            id: 'pei-discipline-suggested',
            target: targets.disciplineSuggested,
            title: 'Disciplinas',
            content: [
                'O aviso no topo diz qual período do aluno foi usado para sugerir as disciplinas. As disciplinas desse período e as dependências pendentes aparecem aqui primeiro.',
                'Para cada disciplina que terá adaptação, escolha o professor responsável. Só aparecem os professores ligados à disciplina no semestre do PEI.',
            ],
        },
        {
            id: 'pei-discipline-others',
            target: targets.disciplineOthers,
            title: 'Outras Disciplinas do Curso',
            content: [
                'Aqui ficam as demais disciplinas do curso que ainda não têm adaptação neste PEI. Quando nenhum professor está ligado à disciplina no semestre do PEI, aparece um aviso no lugar da escolha.',
                'Deixe em branco as disciplinas que não terão adaptação agora.',
            ],
        },
        {
            id: 'pei-discipline-bulk-actions',
            target: targets.disciplineBulkActions,
            title: 'Salvar ou cancelar',
            content: [
                'Clique em Salvar para criar todas as adaptações de uma vez. Escolha o professor de pelo menos uma disciplina.',
                'Depois, preencha o planejamento de cada adaptação pela edição. Cancelar volta para o PEI sem salvar.',
            ],
        },
    ],
};

export const peiDisciplineEditTour: GuidedTourPageConfig = {
    helpHref: helpUrls.show(HELP_SLUG, 'preencher-o-planejamento-adaptado'),
    steps: [
        {
            id: 'pei-discipline-identification',
            target: targets.disciplineIdentification,
            title: 'Identificação',
            content:
                'Mostra o professor responsável e a disciplina. Eles aparecem só para consulta e não podem ser trocados aqui.',
        },
        {
            id: 'pei-discipline-planning',
            target: targets.disciplinePlanning,
            title: 'Planejamento Adaptado',
            content: [
                'Troque o texto "A preencher." pelo planejamento real. Os campos com asterisco (*) são obrigatórios.',
                'O Parecer não é obrigatório para salvar, mas precisa estar preenchido para finalizar o PEI.',
            ],
        },
        {
            id: 'pei-discipline-form-actions',
            target: targets.disciplineFormActions,
            title: 'Salvar ou cancelar',
            content: [
                'Clique em Salvar para gravar. Cada mudança fica registrada nas revisões da adaptação. Se faltar alguma informação, o aviso aparece embaixo do campo.',
                'Cancelar volta para o PEI sem salvar.',
            ],
        },
    ],
};

export const peiDisciplineShowTour: GuidedTourPageConfig = {
    helpHref: helpUrls.show(HELP_SLUG, 'registrar-uma-revisao-da-adaptacao'),
    steps: [
        {
            id: 'pei-discipline-details',
            target: targets.disciplineDetails,
            title: 'Adaptações Razoáveis e/ou Acessibilidades Curriculares',
            content:
                'Mostra o planejamento da disciplina: objetivos, prazo, conteúdo, referência curricular, metodologias, recursos, avaliação, registros complementares e parecer.',
        },
        {
            id: 'pei-discipline-reminders',
            target: targets.disciplineReminders,
            title: 'Lembretes de preenchimento',
            content: [
                'Quem criou a adaptação recebe um aviso quando o professor registra o primeiro preenchimento ou altera o conteúdo.',
                'Se o planejamento continuar vazio, o sistema lembra a cada cinco dias. O criador ou um administrador pode encerrar os lembretes quando não forem mais necessários e retomá-los depois.',
            ],
        },
        {
            id: 'pei-discipline-revisions',
            target: targets.disciplineRevisions,
            title: 'Revisões desta Adaptação',
            content: [
                'Mostra o histórico de revisões, com a data, quem revisou, o que mudou e por quê.',
                'Para registrar uma revisão, preencha O que mudou e Por quê e clique em Registrar. O formulário aparece para quem pode editar adaptações.',
            ],
        },
        {
            id: 'pei-discipline-details-actions',
            target: targets.disciplineDetailsActions,
            title: 'Ações da adaptação',
            content: [
                'PDF gera o planejamento desta disciplina. Voltar leva para o PEI, na aba de adaptações.',
                'Editar e Excluir aparecem para quem cadastrou a adaptação. Excluir pede confirmação e só aparece enquanto o PEI não for finalizado.',
            ],
        },
    ],
};

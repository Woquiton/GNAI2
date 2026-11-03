import { helpUrls } from '@/components/Help/Help.routes';
import type { TableListTourConfig } from '@/components/Tables/TableList/TableList';
import type {
    GuidedTourDemo,
    GuidedTourPageConfig,
    GuidedTourStep,
} from '@/components/UI/GuidedTour/GuidedTour.types';

/** Valores de `data-tour` do formulário e da visualização do atendimento pedagógico. */
export const PEDAGOGICAL_RECORD_TOUR_TARGETS = {
    formTabs: 'pedagogical-record-form-tabs',
    details: 'pedagogical-record-details',
    identification: 'pedagogical-record-identification',
    followUp: 'pedagogical-record-follow-up',
    formActions: 'pedagogical-record-form-actions',
    detailsIdentification: 'pedagogical-record-details-identification',
    detailsFollowUp: 'pedagogical-record-details-follow-up',
    detailsActions: 'pedagogical-record-details-actions',
} as const;

const targets = PEDAGOGICAL_RECORD_TOUR_TARGETS;
const HELP_SLUG = 'atendimentos-pedagogicos';
const LIST_HELP_ANCHOR = 'consultar-os-atendimentos-pedagogicos';
const GENERAL_TAB_ID = 'general';

const DATA_TAB_ID = 'details';

/**
 * Abre uma aba do formulário para mostrar a seção que só aparece com ela aberta e devolve como
 * voltar para a aba anterior. A leitura espera a volta do passo anterior terminar.
 */
function tabDemo(tabKey: string, label: string) {
    return (): GuidedTourDemo => {
        const card = document.querySelector<HTMLElement>(`[data-tour="${targets.formTabs}"]`);

        if (!card) {
            return {};
        }

        let previous: HTMLElement | null = null;
        const timer = window.setTimeout(() => {
            const tab = card.querySelector<HTMLElement>(`[role="tab"][data-tab-key="${tabKey}"]`);
            const selected = card.querySelector<HTMLElement>('[role="tab"][aria-selected="true"]');

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

const dataTabDemo = tabDemo(DATA_TAB_ID, 'Dados do Atendimento');
const generalTabDemo = tabDemo(GENERAL_TAB_ID, 'Informações Gerais da Execução');

const TABS_STEP: GuidedTourStep = {
    id: 'pedagogical-record-form-tabs',
    target: targets.formTabs,
    title: 'Abas do formulário',
    content: [
        'O formulário tem duas abas: Dados do Atendimento e Informações Gerais da Execução. Clique no nome da aba para trocar.',
        'A bolinha vermelha ao lado do nome mostra quantos campos obrigatórios da aba ainda estão sem resposta. Se algo precisar de correção ao salvar, a aba mostra um ícone de alerta.',
    ],
};

const AVAILABILITY_TEXT =
    'Em Disponibilidade do Dia, você vê os horários ocupados por você ou pelo aluno. Clique em um horário livre para usá-lo como início.';

const FOLLOW_UP_PRESENCE_TEXT =
    'Indique a Presença do Estudante no Atendimento. Sem presença, informe o Motivo da Ausência. Com presença ou com responsável, preencha o Registro do Acompanhamento Pedagógico Sistemático e, se quiser, os campos que aparecem abaixo dele.';

const FORM_ACTIONS_STEP = {
    id: 'pedagogical-record-form-actions',
    target: targets.formActions,
    title: 'Salvar ou cancelar',
} as const;

const TAB_BUTTONS_TEXT =
    'O botão com o nome da outra aba, à esquerda, passa de uma aba para a outra.';

export const pedagogicalRecordIndexTour: TableListTourConfig = {
    helpHref: helpUrls.show(HELP_SLUG, LIST_HELP_ANCHOR),
    actions: [
        'Cadastrar registra um atendimento que já aconteceu, sem agendamento. Meus Atendimentos mostra só os atendimentos em que você é o profissional responsável.',
        'Alguns botões só aparecem para quem tem permissão.',
    ],
    filters: [
        'Filtre pelo estudante, pelo profissional ou pelo curso.',
        'A lista se atualiza sozinha quando você escolhe uma opção.',
    ],
    moreFilters: [
        'Aqui você filtra também pela presença do estudante e pelos atendimentos com responsáveis.',
        'O número ao lado do nome mostra quantos desses filtros estão em uso.',
    ],
    table: [
        'Cada linha é um atendimento, com a data, o curso, o estudante com a presença, o profissional responsável e se houve responsáveis.',
        'Use o botão de olho, no fim da linha, para abrir o atendimento. O botão de PDF gera o arquivo do atendimento.',
    ],
};

export const pedagogicalRecordMyRecordsTour: TableListTourConfig = {
    helpHref: helpUrls.show(HELP_SLUG, LIST_HELP_ANCHOR),
    actions: [
        'Cadastrar registra um atendimento que já aconteceu, sem agendamento. Todos os Atendimentos mostra os atendimentos de todos os profissionais.',
        'Alguns botões só aparecem para quem tem permissão.',
    ],
    filters: [
        'Aqui aparecem só os atendimentos em que você é o profissional responsável.',
        'Filtre pelo estudante, pelo curso, pela presença ou pelos atendimentos com responsáveis. A lista se atualiza sozinha.',
    ],
    table: pedagogicalRecordIndexTour.table,
};

export const studentPedagogicalRecordTour: TableListTourConfig = {
    helpHref: helpUrls.show(HELP_SLUG, LIST_HELP_ANCHOR),
    actions: 'Voltar leva para o prontuário do aluno, na aba de atendimentos pedagógicos.',
    filters: [
        'Filtre os atendimentos deste aluno pela presença ou pelos atendimentos com responsáveis. Quem pode ver todos os atendimentos também filtra pelo profissional.',
        'A lista se atualiza sozinha quando você escolhe uma opção.',
    ],
    table: [
        'Cada linha é um atendimento do aluno, com a data, o horário, o profissional, a duração, a presença e se houve responsáveis.',
        'Use os botões no fim da linha para abrir o atendimento ou gerar o PDF. Editar e Excluir aparecem nos atendimentos em que você é o profissional responsável.',
    ],
};

export const pedagogicalRecordCreateTour: GuidedTourPageConfig = {
    helpHref: helpUrls.show(HELP_SLUG, 'registrar-um-atendimento-pedagogico'),
    steps: [
        {
            id: 'pedagogical-record-identification',
            target: targets.identification,
            title: 'Identificação do Estudante',
            content: [
                'O aluno, o profissional, a data, o horário e o tipo vêm do agendamento e aparecem só para consulta.',
                'Se algum responsável participou, marque Atendimento realizado com responsável pelo aluno e escolha ao menos um nome em Responsáveis participantes.',
            ],
        },
        {
            id: 'pedagogical-record-follow-up',
            target: targets.followUp,
            title: 'Acompanhamento Pedagógico',
            content: [
                'Preencha o Motivo do Acompanhamento e o Período/Duração do Acompanhamento, como "50 minutos" ou "01:00". Os campos com asterisco (*) são obrigatórios.',
                FOLLOW_UP_PRESENCE_TEXT,
            ],
        },
        {
            ...FORM_ACTIONS_STEP,
            content: [
                'Clique em Salvar para gravar. O agendamento passa para o status Realizada.',
                'Cancelar volta para o agendamento sem salvar.',
            ],
        },
    ],
};

export const pedagogicalRecordCreateDirectTour: GuidedTourPageConfig = {
    helpHref: helpUrls.show(HELP_SLUG, 'registrar-um-atendimento-sem-agendamento'),
    steps: [
        TABS_STEP,
        {
            id: 'pedagogical-record-details',
            target: targets.details,
            availableWith: targets.formTabs,
            onEnter: dataTabDemo,
            title: 'Dados do Atendimento',
            content: [
                'Escolha o aluno e informe a Data do Atendimento, o Início, o Fim e o Local. Os campos com asterisco (*) são obrigatórios, e a data não pode ser futura.',
                AVAILABILITY_TEXT,
            ],
        },
        {
            id: 'pedagogical-record-identification',
            target: targets.identification,
            title: 'Responsáveis Participantes',
            availableWith: targets.formTabs,
            onEnter: dataTabDemo,
            content: [
                'Se algum responsável participou, marque Atendimento realizado com responsável pelo aluno e escolha ao menos um nome.',
                'Os responsáveis aparecem depois que você escolhe o aluno. Trocar o aluno desmarca os responsáveis escolhidos.',
            ],
        },
        {
            id: 'pedagogical-record-general-tab',
            target: targets.formTabs,
            title: 'Informações Gerais da Execução',
            content: [
                'Nesta aba fica o Acompanhamento Pedagógico. Preencha o Motivo do Acompanhamento e o Período/Duração do Acompanhamento. O motivo também fica como objetivo do agendamento.',
                FOLLOW_UP_PRESENCE_TEXT,
            ],
            onEnter: generalTabDemo,
        },
        {
            ...FORM_ACTIONS_STEP,
            content: [
                TAB_BUTTONS_TEXT,
                'Clique em Salvar para gravar. O sistema cria junto o agendamento do atendimento, já com status Realizada. Cancelar volta sem salvar.',
            ],
        },
    ],
};

export const pedagogicalRecordEditTour: GuidedTourPageConfig = {
    helpHref: helpUrls.show(HELP_SLUG, 'editar-ou-excluir-um-atendimento-pedagogico'),
    steps: [
        TABS_STEP,
        {
            id: 'pedagogical-record-details',
            target: targets.details,
            availableWith: targets.formTabs,
            onEnter: dataTabDemo,
            title: 'Dados do Atendimento',
            content: [
                'O aluno e o profissional ficam como estão. Você pode corrigir a Data do Atendimento, o Início, o Fim e o Local. A data não pode ser futura.',
                AVAILABILITY_TEXT,
            ],
        },
        {
            id: 'pedagogical-record-identification',
            target: targets.identification,
            title: 'Responsáveis Participantes',
            availableWith: targets.formTabs,
            onEnter: dataTabDemo,
            content:
                'Marque ou desmarque Atendimento realizado com responsável pelo aluno e ajuste os nomes escolhidos.',
        },
        {
            id: 'pedagogical-record-general-tab',
            target: targets.formTabs,
            title: 'Informações Gerais da Execução',
            content: [
                'Nesta aba você altera o Motivo do Acompanhamento, o Período/Duração do Acompanhamento e os demais campos do acompanhamento.',
                FOLLOW_UP_PRESENCE_TEXT,
            ],
            onEnter: generalTabDemo,
        },
        {
            ...FORM_ACTIONS_STEP,
            content: [
                TAB_BUTTONS_TEXT,
                'Clique em Salvar para gravar as alterações. Cancelar volta para o atendimento sem salvar.',
            ],
        },
    ],
};

export const pedagogicalRecordShowTour: GuidedTourPageConfig = {
    helpHref: helpUrls.show(HELP_SLUG, 'editar-ou-excluir-um-atendimento-pedagogico'),
    steps: [
        {
            id: 'pedagogical-record-details-identification',
            target: targets.detailsIdentification,
            title: 'Identificação do Estudante',
            content:
                'Mostra o aluno, o profissional e o horário do atendimento. Quando houve participação, mostra também os responsáveis participantes.',
        },
        {
            id: 'pedagogical-record-details-follow-up',
            target: targets.detailsFollowUp,
            title: 'Acompanhamento Pedagógico',
            content: [
                'Mostra o motivo, a duração e a presença do estudante. Quando ele não esteve presente, mostra o motivo da ausência.',
                'Com presença ou com responsável, mostra também o registro do acompanhamento, as estratégias e recursos, os encaminhamentos e as observações.',
            ],
        },
        {
            id: 'pedagogical-record-details-actions',
            target: targets.detailsActions,
            title: 'Ações do atendimento',
            content: [
                'PDF gera o arquivo do atendimento. Voltar leva para o agendamento ou, se você veio de lá, para o prontuário do aluno.',
                'Editar e Excluir aparecem para o profissional responsável pelo agendamento. Excluir pede confirmação antes de apagar.',
            ],
        },
    ],
};

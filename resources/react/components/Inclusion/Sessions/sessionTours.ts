import { helpUrls } from '@/components/Help/Help.routes';
import {
    TABLE_LIST_TOUR_GROUPS,
    tableListTourSteps,
} from '@/components/Tables/TableList/tableListTour';
import type {
    GuidedTourPageConfig,
    GuidedTourStep,
} from '@/components/UI/GuidedTour/GuidedTour.types';

/** Valores de `data-tour` da agenda, do formulário e da visualização do agendamento. */
export const SESSION_TOUR_TARGETS = {
    views: 'session-views',
    calendarNavigation: 'session-calendar-navigation',
    calendarViews: 'session-calendar-views',
    calendarGrid: 'session-calendar-grid',
    participants: 'session-participants',
    schedule: 'session-schedule',
    availability: 'session-availability',
    details: 'session-details',
    formActions: 'session-form-actions',
    detailsIdentification: 'session-details-identification',
    detailsSchedule: 'session-details-schedule',
    detailsContent: 'session-details-content',
    detailsActions: 'session-details-actions',
} as const;

const targets = SESSION_TOUR_TARGETS;
const HELP_SLUG = 'agendamentos';
const CALENDAR_GROUP = 'Calendário';

const TABLE_TEXT = [
    'Cada linha é um agendamento, com o aluno, o profissional, a data, o tipo e o status.',
    'Use o botão de olho, no fim da linha, para abrir o agendamento.',
];

const calendarSteps: GuidedTourStep[] = [
    {
        id: 'session-calendar-navigation',
        target: targets.calendarNavigation,
        group: CALENDAR_GROUP,
        title: 'Mudar de período',
        content:
            'Use as setas para ir para o período anterior ou o próximo. O botão Hoje volta para a data de hoje.',
    },
    {
        id: 'session-calendar-views',
        target: targets.calendarViews,
        group: CALENDAR_GROUP,
        title: 'Mês, semana ou dia',
        content: 'Escolha se quer ver o mês inteiro, uma semana ou um dia só.',
    },
    {
        id: 'session-calendar-grid',
        target: targets.calendarGrid,
        group: CALENDAR_GROUP,
        title: 'Agenda',
        content: [
            'Cada bloco colorido é um agendamento. A cor mostra o status: agendado, realizado ou cancelado.',
            'Clique em um agendamento para abrir. Clique em um dia para ver todos os agendamentos daquela data.',
        ],
    },
];

/**
 * Agenda em calendário ou listagem: abas, filtros comuns às duas formas e, depois, os passos da
 * forma aberta. Os passos da outra forma saem sozinhos, porque o alvo não está na tela.
 */
function workspaceSteps(filters: string[]): GuidedTourStep[] {
    const listSteps = tableListTourSteps({ filters, table: TABLE_TEXT });

    return [
        {
            id: 'session-views',
            target: targets.views,
            title: 'Calendário ou listagem',
            content: [
                'Escolha como ver os agendamentos: no calendário ou em uma lista.',
                'Os filtros valem para as duas formas.',
            ],
        },
        ...listSteps.filter((step) => step.group === TABLE_LIST_TOUR_GROUPS.filters),
        ...calendarSteps,
        ...listSteps.filter((step) => step.group !== TABLE_LIST_TOUR_GROUPS.filters),
    ];
}

export const sessionIndexTour: GuidedTourPageConfig = {
    helpHref: helpUrls.show(HELP_SLUG, 'consultar-a-agenda-em-calendario-ou-listagem'),
    actions: [
        'Cadastrar abre um novo agendamento. Meus agendamentos mostra só os agendamentos em que você é o profissional responsável.',
        'Alguns botões só aparecem para quem tem permissão.',
    ],
    steps: workspaceSteps([
        'Filtre pelo dia de referência, pelo aluno, pelo professor, pelo tipo ou pelo status.',
        'O dia de referência escolhe a semana mostrada no calendário. A tela se atualiza sozinha.',
    ]),
};

export const sessionMySessionsTour: GuidedTourPageConfig = {
    helpHref: helpUrls.show(HELP_SLUG, 'meus-agendamentos-e-central-de-agendamentos'),
    actions: [
        'Cadastrar abre um novo agendamento. Todos Agendamentos volta para a agenda de toda a equipe.',
        'Alguns botões só aparecem para quem tem permissão.',
    ],
    steps: workspaceSteps([
        'Aqui aparecem só os agendamentos em que você é o profissional responsável.',
        'Filtre pelo dia de referência, pelo aluno, pelo tipo ou pelo status. O dia de referência escolhe a semana mostrada no calendário.',
    ]),
};

export const sessionStudentTour: GuidedTourPageConfig = {
    helpHref: helpUrls.show(HELP_SLUG),
    actions: 'Voltar leva para o prontuário do aluno.',
    steps: tableListTourSteps({
        filters: [
            'Filtre os agendamentos deste aluno pelo profissional, pelo tipo ou pelo status.',
            'A lista se atualiza sozinha.',
        ],
        table: TABLE_TEXT,
    }),
};

const FORM_ACTIONS_STEP = {
    id: 'session-form-actions',
    target: targets.formActions,
    title: 'Salvar ou cancelar',
} as const;

const AVAILABILITY_STEP: GuidedTourStep = {
    id: 'session-availability',
    target: targets.availability,
    title: 'Disponibilidade do dia',
    content: [
        'Mostra os horários do dia como livres ou ocupados, e quem está ocupado.',
        'Clique em um horário livre para usá-lo como início. A grade aparece depois de escolher os alunos, o profissional e a data.',
    ],
};

export const sessionCreateTour: GuidedTourPageConfig = {
    helpHref: helpUrls.show(HELP_SLUG, 'cadastrar-um-agendamento'),
    steps: [
        {
            id: 'session-participants',
            target: targets.participants,
            title: 'Participantes e horário',
            content: [
                'Escolha o tipo de atendimento, o formato, o profissional e o aluno. No formato Grupo, use Adicionar outro Aluno para incluir mais alunos.',
                'Depois, informe a data e o horário de início. O fim não é obrigatório: sem ele, o atendimento dura uma hora.',
            ],
        },
        AVAILABILITY_STEP,
        {
            id: 'session-details',
            target: targets.details,
            title: 'Detalhes do atendimento',
            content: 'Informe o local e o objetivo do agendamento. Os dois são obrigatórios.',
        },
        {
            ...FORM_ACTIONS_STEP,
            content: [
                'Clique em Salvar para gravar. Para datas de hoje em diante, o sistema pergunta se você quer avisar os participantes por e-mail.',
                'Cancelar volta para a agenda sem salvar.',
            ],
        },
    ],
};

export const sessionEditTour: GuidedTourPageConfig = {
    helpHref: helpUrls.show(HELP_SLUG, 'editar-ou-remarcar-um-agendamento'),
    steps: [
        {
            id: 'session-participants',
            target: targets.participants,
            title: 'Participantes',
            content:
                'Os alunos e o profissional não podem ser trocados aqui. Para trocar, cancele o agendamento e crie outro.',
        },
        {
            id: 'session-schedule',
            target: targets.schedule,
            title: 'Data e horário',
            content: [
                'Mude a data ou o horário para remarcar o atendimento.',
                'O tipo de atendimento e o formato aparecem só para consulta.',
            ],
        },
        AVAILABILITY_STEP,
        {
            id: 'session-details',
            target: targets.details,
            title: 'Detalhes adicionais',
            content: 'Altere o local ou o objetivo do agendamento.',
        },
        {
            ...FORM_ACTIONS_STEP,
            content: [
                'Clique em Salvar para gravar. O sistema pergunta se você quer avisar os participantes por e-mail sobre a mudança.',
                'Cancelar volta para o agendamento sem salvar.',
            ],
        },
    ],
};

export const sessionShowTour: GuidedTourPageConfig = {
    helpHref: helpUrls.show(HELP_SLUG, 'registrar-o-atendimento-a-partir-do-agendamento'),
    steps: [
        {
            id: 'session-details-identification',
            target: targets.detailsIdentification,
            title: 'Identificação',
            content: 'Mostra os alunos, o profissional e o status do agendamento.',
        },
        {
            id: 'session-details-schedule',
            target: targets.detailsSchedule,
            title: 'Agendamento e local',
            content:
                'Mostra a data, o horário, o local, o tipo de atendimento, o formato e de onde veio o agendamento.',
        },
        {
            id: 'session-details-content',
            target: targets.detailsContent,
            title: 'Conteúdo do agendamento',
            content:
                'Mostra o objetivo do atendimento. Quando o agendamento é cancelado, mostra também o motivo.',
        },
        {
            id: 'session-details-actions',
            target: targets.detailsActions,
            title: 'Ações do agendamento',
            content: [
                'Voltar leva para a agenda. Editar e Cancelar Agendamento aparecem para quem criou o agendamento, enquanto ele está agendado.',
                'No dia do atendimento, o profissional responsável usa o botão Criar Atendimento AEE ou Criar Registro Pedagógico para registrar o que foi feito. Excluir apaga o agendamento, depois de pedir confirmação.',
            ],
        },
    ],
};

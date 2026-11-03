import { helpUrls } from '@/components/Help/Help.routes';
import type { AttendanceRecordTabId } from '@/components/Inclusion/AttendanceRecordTabs/useAttendanceRecordTabs';
import type { TableListTourConfig } from '@/components/Tables/TableList/TableList';
import type {
    GuidedTourDemo,
    GuidedTourPageConfig,
    GuidedTourStep,
} from '@/components/UI/GuidedTour/GuidedTour.types';

/** Valores de `data-tour` do formulário, da visualização e da avaliação do aluno no AEE. */
export const AEE_RECORD_TOUR_TARGETS = {
    recordTabs: 'aee-record-tabs',
    formActions: 'aee-record-form-actions',
    execution: 'aee-record-execution',
    evaluations: 'aee-record-evaluations',
    detailsActions: 'aee-record-details-actions',
    studentSession: 'aee-student-session',
    studentEvaluation: 'aee-student-evaluation',
    studentFormActions: 'aee-student-form-actions',
    studentDetailsEvaluation: 'aee-student-details-evaluation',
    studentDetailsActions: 'aee-student-details-actions',
} as const;

const targets = AEE_RECORD_TOUR_TARGETS;
const HELP_SLUG = 'atendimentos-especializados';

const LIST_TABLE_TEXT = [
    'Cada linha é um atendimento, com a data, o curso, os estudantes com a presença de cada um e o profissional responsável.',
    'No fim da linha, o botão de olho abre o registro e o botão PDF gera o arquivo do atendimento.',
];

export const aeeRecordIndexTour: TableListTourConfig = {
    helpHref: helpUrls.show(HELP_SLUG, 'consultar-os-atendimentos-aee'),
    actions: [
        'Cadastrar registra um atendimento que já aconteceu, sem agendamento. Meus Atendimentos mostra só os atendimentos em que você é o profissional responsável.',
        'Alguns botões só aparecem para quem tem permissão.',
    ],
    filters: [
        'Aqui aparecem os atendimentos de todos os profissionais.',
        'Filtre pelo estudante, pelo profissional, pelo curso ou pela presença. A lista se atualiza sozinha.',
    ],
    table: LIST_TABLE_TEXT,
};

export const aeeRecordMyRecordsTour: TableListTourConfig = {
    helpHref: helpUrls.show(HELP_SLUG, 'consultar-os-atendimentos-aee'),
    actions: [
        'Cadastrar registra um atendimento que já aconteceu, sem agendamento. Todos os Atendimentos mostra os atendimentos de toda a equipe.',
        'Alguns botões só aparecem para quem tem permissão.',
    ],
    filters: [
        'Aqui aparecem só os atendimentos em que você é o profissional responsável.',
        'Filtre pelo estudante, pelo curso ou pela presença. A lista se atualiza sozinha.',
    ],
    table: LIST_TABLE_TEXT,
};

export const studentAeeRecordIndexTour: TableListTourConfig = {
    helpHref: helpUrls.show(
        HELP_SLUG,
        'consultar-e-ajustar-a-avaliacao-de-um-aluno-pelo-prontuario',
    ),
    actions: 'Voltar leva para o prontuário do aluno, na aba Atendimentos AEE.',
    filters: [
        'Filtre os atendimentos deste aluno pela presença. Quem vê os atendimentos de toda a equipe também pode filtrar pelo profissional.',
        'A lista se atualiza sozinha.',
    ],
    table: [
        'Cada linha é um atendimento AEE do aluno, com a data, o profissional, a duração e a presença.',
        'No fim da linha, o botão de olho abre a avaliação do aluno. Editar e excluir aparecem só para o profissional responsável pelo atendimento.',
    ],
};

/** Formulário do registro: a partir do agendamento, direto (sem agendamento) ou edição. */
type AeeRecordFormMode = 'session' | 'direct' | 'edit';

const TAB_NOTE = 'Ao sair deste passo, a tela volta para a aba em que você estava.';

/**
 * Abre uma aba do formulário dentro do card e devolve como voltar à aba anterior. A leitura da aba
 * aberta espera a tela se atualizar, porque o passo anterior pode ter acabado de trocar a aba.
 */
function recordTabDemo(tab: AttendanceRecordTabId, label: string) {
    return (card: HTMLElement | null): GuidedTourDemo => {
        if (!card) {
            return {};
        }

        let previous: HTMLElement | null = null;
        const timer = window.setTimeout(() => {
            const tablist = card.querySelector('[role="tablist"]');
            const button = tablist?.querySelector<HTMLElement>(`[data-tab-key="${tab}"]`);
            const selected = tablist?.querySelector<HTMLElement>('[aria-selected="true"]');

            if (!button || !selected || button === selected) {
                return;
            }

            previous = selected;
            button.click();
        }, 0);

        return {
            note: `Mostramos a aba ${label}. ${TAB_NOTE}`,
            undo: () => {
                window.clearTimeout(timer);
                previous?.click();
            },
        };
    };
}

const TABS_GROUP = 'Abas do formulário';

function recordTabsStep(mode: AeeRecordFormMode): GuidedTourStep {
    const tabs =
        mode === 'session'
            ? 'O registro tem duas abas: Informações Gerais da Execução e Avaliação Individual por Aluno.'
            : 'O registro tem três abas: Dados do Atendimento, Informações Gerais da Execução e Avaliação Individual por Aluno.';

    return {
        id: 'aee-record-tabs',
        target: targets.recordTabs,
        group: TABS_GROUP,
        title: 'Abas do registro',
        content: [
            `${tabs} Clique no nome de uma aba para abrir.`,
            'A bolinha vermelha mostra quantos campos obrigatórios da aba estão sem resposta. Os campos com asterisco (*) são obrigatórios.',
        ],
    };
}

function detailsTabStep(mode: 'direct' | 'edit'): GuidedTourStep {
    const label = 'Dados do Atendimento';

    return {
        id: 'aee-record-details-tab',
        target: targets.recordTabs,
        group: TABS_GROUP,
        title: label,
        content:
            mode === 'direct'
                ? [
                      'Escolha o formato e os alunos participantes. No formato Grupo, use Adicionar outro Aluno para incluir mais alunos.',
                      'Informe a data, o início, o fim e o local. A data não pode ser futura. Em Disponibilidade do Dia, confira os horários livres e clique em um para usá-lo como início.',
                  ]
                : [
                      'Corrija a data, o início, o fim ou o local do atendimento. A data não pode ser futura.',
                      'O profissional e os alunos aparecem só para consulta. Em Disponibilidade do Dia, confira os horários livres.',
                  ],
        onEnter: recordTabDemo('details', label),
    };
}

function generalTabStep(mode: AeeRecordFormMode): GuidedTourStep {
    const label = 'Informações Gerais da Execução';

    return {
        id: 'aee-record-general-tab',
        target: targets.recordTabs,
        group: TABS_GROUP,
        title: label,
        content: [
            'Informe a duração, como "50 minutos" ou "01:00", e as atividades planejadas ou realizadas. Os dois são obrigatórios.',
            mode === 'direct'
                ? 'Estratégias, recursos e observações gerais não são obrigatórios. As atividades também ficam como objetivo do agendamento.'
                : 'Estratégias, recursos e observações gerais não são obrigatórios.',
        ],
        onEnter: recordTabDemo('general', label),
    };
}

function evaluationsTabStep(mode: AeeRecordFormMode): GuidedTourStep {
    const label = 'Avaliação Individual por Aluno';
    const studentTabs =
        mode === 'direct'
            ? 'Cada aluno escolhido em Dados do Atendimento ganha uma aba aqui.'
            : 'Há uma aba para cada aluno do atendimento.';

    return {
        id: 'aee-record-evaluations-tab',
        target: targets.recordTabs,
        group: TABS_GROUP,
        title: label,
        content: [
            `${studentTabs} Use Aluno Presente para dizer se ele veio. Presente pede Participação e Avaliação do Desenvolvimento; ausente pede o Motivo da Ausência.`,
            'Se um responsável participou, marque a opção de participação de responsável e escolha quem participou. Isso aparece no PEI como devolutiva à família.',
        ],
        onEnter: recordTabDemo('evaluations', label),
    };
}

function recordFormActionsStep(mode: AeeRecordFormMode): GuidedTourStep {
    const cancelText = {
        session: 'Cancelar volta para o agendamento sem salvar.',
        direct: 'Cancelar volta para a tela anterior sem salvar.',
        edit: 'Cancelar volta para o registro sem salvar.',
    }[mode];
    const saveText =
        mode === 'edit'
            ? 'Clique em Salvar para gravar as mudanças.'
            : 'Clique em Salvar para gravar o registro. O agendamento fica com o status Realizada.';

    return {
        id: 'aee-record-form-actions',
        target: targets.formActions,
        title: 'Salvar ou cancelar',
        content: [
            `Os botões à esquerda levam para a aba anterior ou para a próxima. ${saveText}`,
            `Se faltar alguma informação, a aba com o problema abre sozinha. ${cancelText}`,
        ],
    };
}

function recordFormSteps(mode: AeeRecordFormMode): GuidedTourStep[] {
    return [
        recordTabsStep(mode),
        ...(mode === 'session' ? [] : [detailsTabStep(mode)]),
        generalTabStep(mode),
        evaluationsTabStep(mode),
        recordFormActionsStep(mode),
    ];
}

export const aeeRecordCreateTour: GuidedTourPageConfig = {
    helpHref: helpUrls.show(HELP_SLUG, 'registrar-um-atendimento-aee'),
    steps: recordFormSteps('session'),
};

export const aeeRecordCreateDirectTour: GuidedTourPageConfig = {
    helpHref: helpUrls.show(HELP_SLUG, 'registrar-um-atendimento-sem-agendamento'),
    steps: recordFormSteps('direct'),
};

export const aeeRecordEditTour: GuidedTourPageConfig = {
    helpHref: helpUrls.show(HELP_SLUG, 'editar-ou-excluir-um-registro-aee'),
    steps: recordFormSteps('edit'),
};

const EXECUTION_STEP: GuidedTourStep = {
    id: 'aee-record-execution',
    target: targets.execution,
    title: 'Execução do Atendimento AEE',
    content:
        'Mostra a duração, as atividades realizadas, as estratégias, os recursos e as observações gerais do atendimento.',
};

export const aeeRecordShowTour: GuidedTourPageConfig = {
    helpHref: helpUrls.show(HELP_SLUG, 'consultar-os-atendimentos-aee'),
    steps: [
        EXECUTION_STEP,
        {
            id: 'aee-record-evaluations',
            target: targets.evaluations,
            title: 'Desempenho Individual',
            content: [
                'Há uma aba para cada aluno. Clique no nome do aluno para ver a avaliação dele.',
                'O selo Falta, ao lado do nome, mostra quem não veio. Para esses alunos aparece o motivo da ausência.',
            ],
        },
        {
            id: 'aee-record-details-actions',
            target: targets.detailsActions,
            title: 'Ações do registro',
            content: [
                'PDF gera um arquivo com o registro. Voltar leva para o agendamento.',
                'Editar e Excluir aparecem para o profissional responsável. Excluir apaga o registro e as avaliações dos alunos, depois de pedir confirmação.',
            ],
        },
    ],
};

export const studentAeeRecordEditTour: GuidedTourPageConfig = {
    helpHref: helpUrls.show(
        HELP_SLUG,
        'consultar-e-ajustar-a-avaliacao-de-um-aluno-pelo-prontuario',
    ),
    steps: [
        {
            id: 'aee-student-session',
            target: targets.studentSession,
            title: 'Informações do atendimento AEE',
            content: [
                'Mostra a data, a duração, o profissional, o objetivo e o que foi feito no atendimento.',
                'Essas informações aparecem só para consulta. Para mudar, edite o registro completo.',
            ],
        },
        {
            id: 'aee-student-evaluation',
            target: targets.studentEvaluation,
            title: 'Editar Avaliação Individual',
            content: [
                'Aqui você altera só a avaliação deste aluno. Use Aluno Presente para dizer se ele veio. Presente pede Participação e Avaliação do Desenvolvimento; ausente pede o Motivo da Ausência.',
                'Os campos com asterisco (*) são obrigatórios. Se um responsável participou, marque a opção e escolha quem participou.',
            ],
        },
        {
            id: 'aee-student-form-actions',
            target: targets.studentFormActions,
            title: 'Salvar ou cancelar',
            content: [
                'Clique em Salvar para gravar a avaliação. Se faltar alguma informação, o aviso aparece embaixo do campo.',
                'Cancelar volta para o prontuário do aluno sem salvar. Ver registro completo abre o atendimento com todos os alunos.',
            ],
        },
    ],
};

export const studentAeeRecordShowTour: GuidedTourPageConfig = {
    helpHref: helpUrls.show(
        HELP_SLUG,
        'consultar-e-ajustar-a-avaliacao-de-um-aluno-pelo-prontuario',
    ),
    steps: [
        EXECUTION_STEP,
        {
            id: 'aee-student-details-evaluation',
            target: targets.studentDetailsEvaluation,
            title: 'Avaliação Individual do Aluno',
            content: [
                'Mostra a presença do aluno e a avaliação dele neste atendimento.',
                'Quando o aluno não veio, aparece o motivo da ausência.',
            ],
        },
        {
            id: 'aee-student-details-actions',
            target: targets.studentDetailsActions,
            title: 'Ações da avaliação',
            content: [
                'PDF gera um arquivo com a avaliação deste aluno. Ver registro completo abre o atendimento com todos os alunos. Voltar leva para o prontuário.',
                'Editar e Excluir aparecem para o profissional responsável. Excluir apaga só o registro deste aluno no atendimento, depois de pedir confirmação.',
            ],
        },
    ],
};

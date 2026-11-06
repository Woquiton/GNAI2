import { helpUrls } from '@/components/Help/Help.routes';
import {
    TABLE_LIST_TOUR_GROUPS,
    tableListTourSteps,
} from '@/components/Tables/TableList/tableListTour';
import type {
    GuidedTourDemo,
    GuidedTourPageConfig,
} from '@/components/UI/GuidedTour/GuidedTour.types';

/** Valores de `data-tour` das telas do Portal do Professor. */
export const TEACHER_PORTAL_TOUR_TARGETS = {
    notice: 'teacher-portal-notice',
    summary: 'teacher-portal-summary',
    tabs: 'teacher-portal-tabs',
    peiTab: 'teacher-portal-pei-tab',
    studentActions: 'teacher-portal-student-actions',
    planning: 'teacher-portal-planning',
    formActions: 'teacher-portal-form-actions',
} as const;

const targets = TEACHER_PORTAL_TOUR_TARGETS;
const HELP_SLUG = 'portal-do-professor';

/** Abre a aba PEI para mostrar o botão da adaptação e volta para a aba anterior ao sair. */
function peiTabDemo(): GuidedTourDemo {
    let previous: HTMLElement | null = null;
    const timer = window.setTimeout(() => {
        const strip = document.querySelector(`[data-tour="${targets.tabs}"]`);
        const tab = strip?.querySelector<HTMLElement>('[role="tab"][data-tab-key="pei"]');
        const selected = strip?.querySelector<HTMLElement>('[role="tab"][aria-selected="true"]');

        if (!tab || !selected || tab === selected) {
            return;
        }

        previous = selected;
        tab.click();
    }, 0);

    return {
        note: 'Abrimos a aba PEI para você ver. A aba anterior volta no próximo passo.',
        undo: () => {
            window.clearTimeout(timer);
            previous?.click();
        },
    };
}

/** Lista sem filtros nem páginas: só os passos da tabela entram. */
const assignmentTableSteps = tableListTourSteps({
    table: [
        'Cada linha é uma disciplina sua no PEI de um aluno, com o aluno, a disciplina e o curso.',
        'O botão de olho abre a situação do aluno, só para leitura. O lápis abre a sua adaptação daquela disciplina.',
    ],
}).filter((step) => step.group === TABLE_LIST_TOUR_GROUPS.table);

export const teacherPortalIndexTour: GuidedTourPageConfig = {
    helpHref: helpUrls.show(HELP_SLUG, 'ver-meus-alunos-e-adaptacoes'),
    steps: assignmentTableSteps,
};

export const teacherPortalStudentTour: GuidedTourPageConfig = {
    helpHref: helpUrls.show(HELP_SLUG, 'consultar-a-situacao-do-aluno-modo-leitura'),
    actions: 'O selo Modo leitura avisa que nada pode ser alterado nesta tela.',
    steps: [
        {
            id: 'teacher-portal-notice',
            target: targets.notice,
            title: 'Situação atual',
            content: [
                'Esta tela mostra a situação atual do aluno, só para consulta.',
                'Se o Estudo de Caso, o PAEE ou o PEI mudarem, use o link do aviso para gerar um novo link de acesso e ver as atualizações.',
            ],
        },
        {
            id: 'teacher-portal-summary',
            target: targets.summary,
            title: 'Situação do aluno',
            content: [
                'Mostra se o aluno já tem Laudo, Estudo de Caso, PAEE e PEI.',
                'Cada item aparece como Sim ou Não.',
            ],
        },
        {
            id: 'teacher-portal-tabs',
            target: targets.tabs,
            title: 'Abas do aluno',
            content: [
                'Laudo e Documentos, Estudo de Caso, PAEE e PEI mostram a versão atual de cada parte do acompanhamento.',
                'Clique no nome de uma aba para abrir. Em Laudo e Documentos, o botão de olho abre o arquivo.',
            ],
        },
        {
            id: 'teacher-portal-pei',
            target: targets.tabs,
            availableWith: targets.peiTab,
            title: 'PEI e a sua adaptação',
            content: [
                'A aba PEI mostra as adaptações de todas as disciplinas do aluno e quem é o professor de cada uma.',
                'Nas suas disciplinas aparece o botão Editar minha adaptação, que abre o planejamento para você preencher.',
            ],
            onEnter: peiTabDemo,
        },
        {
            id: 'teacher-portal-student-actions',
            target: targets.studentActions,
            title: 'Voltar',
            content: 'Clique em Voltar para retornar à lista dos seus alunos.',
        },
    ],
};

export const teacherPortalDisciplineTour: GuidedTourPageConfig = {
    helpHref: helpUrls.show(HELP_SLUG, 'editar-a-adaptacao-da-minha-disciplina-no-pei'),
    steps: [
        {
            id: 'teacher-portal-planning',
            target: targets.planning,
            title: 'Planejamento Adaptado',
            content: [
                'Preencha como a disciplina será adaptada para o aluno: objetivos, conteúdo, metodologias, recursos e avaliação.',
                'Os campos com asterisco (*) são obrigatórios. Os outros você preenche quando fizer sentido para a disciplina.',
            ],
        },
        {
            id: 'teacher-portal-form-actions',
            target: targets.formActions,
            title: 'Salvar ou cancelar',
            content: [
                'Clique em Salvar para gravar. Cada vez que você muda algo e salva, o sistema guarda uma revisão da adaptação.',
                'Cancelar volta para a lista dos seus alunos sem salvar.',
            ],
        },
    ],
};

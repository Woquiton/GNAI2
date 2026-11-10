import { PROFILE_TOUR_TARGETS } from '@/components/Profile/profileTours';
import { helpUrls } from '@/components/Help/Help.routes';
import type { TableListTourConfig } from '@/components/Tables/TableList/TableListLayout';
import type {
    GuidedTourDemo,
    GuidedTourPageConfig,
} from '@/components/UI/GuidedTour/GuidedTour.types';

/** Valores de `data-tour` das telas do Portal do Professor. */
export const TEACHER_PORTAL_TOUR_TARGETS = {
    view: 'teacher-portal-view',
    summary: 'teacher-portal-summary',
    tabs: 'teacher-portal-tabs',
    peiTab: 'teacher-portal-pei-tab',
    studentActions: 'teacher-portal-student-actions',
    planning: 'teacher-portal-planning',
    formActions: 'teacher-portal-form-actions',
} as const;

const targets = TEACHER_PORTAL_TOUR_TARGETS;
const HELP_SLUG = 'portal-do-professor';

const portalViewStep = {
    id: 'teacher-portal-view',
    target: targets.view,
    title: 'Modo de visualização',
    content: [
        'Use este botão da barra do topo para alternar entre Conteúdo centralizado e Largura total. O modo centralizado aproxima as informações em telas grandes.',
        'A escolha fica salva na sua conta. Durante a personificação, ela pertence a quem está personificando.',
    ],
};

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

export const teacherPortalIndexTour: TableListTourConfig = {
    helpHref: helpUrls.show(HELP_SLUG, 'ver-meus-alunos-e-adaptacoes'),
    filters: [
        'Pesquise pelo nome do aluno, pela disciplina ou pelo curso. Você pode combinar os campos e digitar apenas parte do nome.',
        'A lista se atualiza enquanto você digita. Use a borracha para limpar os filtros.',
    ],
    table: [
        'Cada linha é uma disciplina sua no PEI atual de um aluno, com o aluno, a disciplina e o curso.',
        'O botão de olho abre a situação do aluno, só para leitura. O lápis abre a sua adaptação daquela disciplina.',
    ],
    steps: [portalViewStep],
};

export const teacherPortalStudentTour: GuidedTourPageConfig = {
    helpHref: helpUrls.show(HELP_SLUG, 'consultar-a-situacao-do-aluno-modo-leitura'),
    actions: 'O selo Modo leitura avisa que nada pode ser alterado nesta tela.',
    steps: [
        portalViewStep,
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
                'O portal abre no PEI. Depois vêm Estudo de Caso, PAEE e Laudo e Documentos, com a versão atual de cada parte do acompanhamento.',
                'Clique no nome de uma aba para abrir. Laudo e Documentos mostra os laudos e os anexos liberados pelo núcleo. O botão de olho abre o arquivo.',
            ],
        },
        {
            id: 'teacher-portal-pei',
            target: targets.tabs,
            availableWith: targets.peiTab,
            title: 'PEI e a sua adaptação',
            content: [
                'A aba PEI mostra as adaptações de todas as disciplinas do aluno e quem é o professor de cada uma.',
                'Nas suas disciplinas, Iniciar minha adaptação aparece em verde enquanto houver apenas textos provisórios ou campos vazios. Quando já existe conteúdo preenchido, aparece Editar minha adaptação.',
            ],
            onEnter: peiTabDemo,
        },
        {
            id: 'teacher-portal-student-actions',
            target: targets.studentActions,
            title: 'Voltar e acessar adaptações',
            content: [
                'Clique em Voltar para retornar à lista dos seus alunos.',
                'Na aba PEI, Adaptações para iniciar reúne as suas disciplinas ainda sem preenchimento. Adaptações para editar reúne as suas já iniciadas. Cada botão abre uma janela com os nomes das disciplinas para você escolher e ir direto ao planejamento.',
            ],
        },
    ],
};

export const teacherPortalDisciplineTour: GuidedTourPageConfig = {
    helpHref: helpUrls.show(HELP_SLUG, 'editar-a-adaptacao-da-minha-disciplina-no-pei'),
    steps: [
        portalViewStep,
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
                'Cancelar volta para o mesmo aluno, na aba PEI, sem salvar.',
            ],
        },
    ],
};

/** Perfil limitado aos dados que o professor pode atualizar no portal. */
export const teacherProfileTour: GuidedTourPageConfig = {
    helpHref: helpUrls.show(HELP_SLUG, 'atualizar-meu-nome-e-minha-foto'),
    steps: [
        portalViewStep,
        {
            id: 'teacher-profile-identity',
            target: PROFILE_TOUR_TARGETS.identity,
            title: 'Foto e identificação',
            content: [
                'Clique em Alterar Foto para escolher uma imagem, arraste uma imagem até o círculo ou use o botão da câmera. Use JPG ou PNG de até 2 MB.',
                'Você também pode remover a foto. A alteração só é gravada ao clicar em Salvar.',
            ],
        },
        {
            id: 'teacher-profile-personal',
            target: PROFILE_TOUR_TARGETS.personal,
            title: 'Dados Pessoais',
            content: [
                'Atualize seu Nome Completo. Ele é obrigatório e deve ter de 3 a 255 caracteres.',
                'O E-mail de acesso aparece apenas para consulta. Para alterá-lo, procure a equipe do núcleo. Você continua entrando pelo link enviado ao e-mail, sem senha.',
            ],
        },
        {
            id: 'teacher-profile-actions',
            target: PROFILE_TOUR_TARGETS.formActions,
            title: 'Salvar ou cancelar',
            content: [
                'Clique em Salvar para gravar seu nome e sua foto. Se algo precisar de ajuste, uma mensagem aparece junto ao campo.',
                'Cancelar volta à lista de alunos e adaptações sem salvar.',
            ],
        },
    ],
};

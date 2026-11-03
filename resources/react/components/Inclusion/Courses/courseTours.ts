import { helpUrls } from '@/components/Help/Help.routes';
import type { TableListTourConfig } from '@/components/Tables/TableList/TableList';
import type {
    GuidedTourPageConfig,
    GuidedTourStep,
} from '@/components/UI/GuidedTour/GuidedTour.types';

/** Valores de `data-tour` das partes da listagem, do cadastro, da visualização e da virada. */
export const COURSE_TOUR_TARGETS = {
    information: 'course-information',
    status: 'course-status',
    curriculum: 'course-curriculum',
    curriculumPeriods: 'course-curriculum-periods',
    formActions: 'course-form-actions',
    detailsGeneral: 'course-details-general',
    detailsCurriculum: 'course-details-curriculum',
    detailsActions: 'course-details-actions',
    rolloverSemester: 'course-rollover-semester',
    rolloverStudents: 'course-rollover-students',
    rolloverBulk: 'course-rollover-bulk',
    rolloverStudent: 'course-rollover-student',
    rolloverActions: 'course-rollover-actions',
} as const;

const targets = COURSE_TOUR_TARGETS;
const HELP_HREF = helpUrls.show('cadastros-do-atendimento', 'cursos');
const ROLLOVER_GROUP = 'Alunos do Curso';

export const courseListTour: TableListTourConfig = {
    helpHref: HELP_HREF,
    filters: [
        'Digite o nome do curso para encontrá-lo. Você também pode filtrar pelo Status: ativo ou inativo.',
        'A lista se atualiza sozinha enquanto você digita ou escolhe uma opção.',
    ],
    table: [
        'Cada linha é um curso, com o nome, a quantidade de disciplinas e o status.',
        'Use o botão de olho, no fim da linha, para abrir o curso e ver a matriz curricular.',
    ],
};

function courseFormSteps(mode: 'create' | 'edit'): GuidedTourStep[] {
    const group = mode === 'create' ? 'Cadastro do curso' : 'Edição do curso';
    const steps: GuidedTourStep[] = [
        {
            id: 'course-information',
            target: targets.information,
            group,
            title: 'Identificação',
            content: [
                'Preencha o Nome do Curso. Ele é obrigatório, marcado com asterisco (*), e não pode repetir o nome de outro curso.',
                mode === 'create'
                    ? 'A Descrição não é obrigatória. O curso é criado ativo.'
                    : 'A Descrição não é obrigatória.',
            ],
        },
    ];

    if (mode === 'edit') {
        steps.push({
            id: 'course-status',
            target: targets.status,
            group,
            title: 'Curso Ativo',
            content: [
                'Desligue esta opção para inativar o curso. Cursos inativos não podem ser escolhidos em novos vínculos.',
                'Um curso com alunos vinculados não pode ser inativado.',
            ],
        });
    }

    steps.push(
        {
            id: 'course-curriculum',
            target: targets.curriculum,
            group,
            title:
                mode === 'create'
                    ? 'Matriz Curricular Inicial'
                    : 'Matriz Curricular (Selecione as Disciplinas)',
            content: [
                'Em Disciplinas do curso, marque as disciplinas que fazem parte do curso. Use Buscar disciplina para encontrar uma disciplina pelo nome. Só aparecem disciplinas ativas.',
                mode === 'create'
                    ? 'A busca só filtra a lista. As disciplinas que você já marcou continuam marcadas.'
                    : 'Para retirar uma disciplina, desmarque e salve. Ela não pode sair se tiver adaptações de PEI ou registros de reprovação e risco dos alunos do curso.',
            ],
        },
        {
            id: 'course-curriculum-periods',
            target: targets.curriculumPeriods,
            group,
            title: 'Períodos das Disciplinas',
            content: [
                'Para cada disciplina marcada, escolha em qual período do curso ela é cursada. Este campo não é obrigatório.',
                'O PEI usa essa informação para mostrar primeiro as disciplinas do período do aluno.',
            ],
        },
        {
            id: 'course-form-actions',
            target: targets.formActions,
            group,
            title: 'Salvar ou cancelar',
            content: [
                'Clique em Salvar para gravar o curso e a matriz. Se faltar alguma informação, o aviso aparece embaixo do campo.',
                mode === 'create'
                    ? 'Cancelar volta para a lista de cursos sem salvar.'
                    : 'Cancelar volta para o curso sem salvar.',
            ],
        },
    );

    return steps;
}

export const courseCreateTour: GuidedTourPageConfig = {
    helpHref: HELP_HREF,
    steps: courseFormSteps('create'),
};

export const courseEditTour: GuidedTourPageConfig = {
    helpHref: HELP_HREF,
    steps: courseFormSteps('edit'),
};

export const courseShowTour: GuidedTourPageConfig = {
    helpHref: HELP_HREF,
    steps: [
        {
            id: 'course-details-general',
            target: targets.detailsGeneral,
            title: 'Identificação',
            content: 'Mostra o nome do curso, o status, ativo ou inativo, e a descrição.',
        },
        {
            id: 'course-details-curriculum',
            target: targets.detailsCurriculum,
            title: 'Matriz Curricular (Disciplinas)',
            content: [
                'Lista as disciplinas do curso, com o período em que cada uma é cursada.',
                'As disciplinas aparecem em ordem de período. As que não têm período ficam no fim.',
            ],
        },
        {
            id: 'course-details-actions',
            target: targets.detailsActions,
            title: 'Ações do curso',
            content: [
                'Voltar leva para a lista de cursos. Virada de semestre registra de uma vez o período de todos os alunos do curso no novo semestre. Editar abre o cadastro para alterar o curso e a matriz.',
                'Excluir apaga o curso depois de pedir confirmação. Um curso com alunos ou PEIs vinculados não pode ser excluído. Alguns botões só aparecem para quem tem permissão.',
            ],
        },
    ],
};

export const courseRolloverTour: GuidedTourPageConfig = {
    helpHref: HELP_HREF,
    steps: [
        {
            id: 'course-rollover-semester',
            target: targets.rolloverSemester,
            title: 'Semestre de Destino',
            content: [
                'Em Registrar os alunos em, confira o semestre de destino. A tela abre no semestre atual. Se você trocar de semestre, as escolhas não salvas são descartadas.',
                'Por padrão, todos os alunos avançam um período. Você só precisa marcar as exceções.',
            ],
        },
        {
            id: 'course-rollover-students',
            target: targets.rolloverStudents,
            group: ROLLOVER_GROUP,
            title: 'Alunos do Curso',
            content:
                'Aqui aparecem os alunos ativos com matrícula vigente no curso, com o período de cada um no semestre anterior.',
        },
        {
            id: 'course-rollover-bulk',
            target: targets.rolloverBulk,
            group: ROLLOVER_GROUP,
            title: 'Todos avançam ou Nenhum registrado',
            content: [
                'Use estes botões para mudar a lista inteira de uma vez.',
                'Ao lado, você vê quantos alunos serão registrados no semestre.',
            ],
        },
        {
            id: 'course-rollover-student',
            target: targets.rolloverStudent,
            group: ROLLOVER_GROUP,
            title: 'Situação do aluno',
            content: [
                'Escolha Avança, Permanece, para quem fica no mesmo período, ou Não registrar, para quem não deve entrar no semestre, como quem trancou.',
                'Para um aluno sem período registrado antes, escolha também o Período no novo semestre. Quem já tem período no semestre aparece como Não registrar, com o aviso Já registrado.',
            ],
        },
        {
            id: 'course-rollover-actions',
            target: targets.rolloverActions,
            title: 'Salvar ou cancelar',
            content: [
                'Clique em Salvar para registrar os alunos no semestre escolhido. O botão aparece quando há alunos na lista.',
                'Cancelar volta para o curso sem salvar.',
            ],
        },
    ],
};

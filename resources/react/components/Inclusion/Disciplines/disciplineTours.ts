import { helpUrls } from '@/components/Help/Help.routes';
import type { TableListTourConfig } from '@/components/Tables/TableList/TableList';
import type {
    GuidedTourPageConfig,
    GuidedTourStep,
} from '@/components/UI/GuidedTour/GuidedTour.types';

/** Valores de `data-tour` das partes do formulário e da visualização da disciplina. */
export const DISCIPLINE_TOUR_TARGETS = {
    name: 'discipline-name',
    description: 'discipline-description',
    status: 'discipline-status',
    formActions: 'discipline-form-actions',
    details: 'discipline-details',
    courses: 'discipline-courses',
    detailsActions: 'discipline-details-actions',
} as const;

const targets = DISCIPLINE_TOUR_TARGETS;
const HELP_HREF = helpUrls.show('cadastros-do-atendimento', 'disciplinas');

export const disciplineListTour: TableListTourConfig = {
    helpHref: HELP_HREF,
    filters: [
        'Em Nome da Disciplina, digite parte do nome para encontrar uma disciplina.',
        'Em Status, você pode ver só as ativas ou só as inativas. A lista se atualiza sozinha.',
    ],
    table: [
        'Cada linha é uma disciplina, com o nome e o status. A coluna Descrição começa escondida e pode ser mostrada em Colunas.',
        'Use o botão de olho, no fim da linha, para abrir a disciplina. A lixeira exclui depois de pedir confirmação.',
    ],
};

function disciplineFormSteps(mode: 'create' | 'edit'): GuidedTourStep[] {
    const group = mode === 'create' ? 'Cadastro da disciplina' : 'Edição da disciplina';

    return [
        {
            id: 'discipline-name',
            target: targets.name,
            group,
            title: 'Nome da Disciplina',
            content: [
                'Digite o nome da matéria. Ele não pode repetir o nome de outra disciplina.',
                'Os campos com asterisco (*) são obrigatórios.',
            ],
        },
        {
            id: 'discipline-description',
            target: targets.description,
            group,
            title: 'Descrição',
            content:
                'Você pode descrever a disciplina e seus objetivos. Este campo não é obrigatório.',
        },
        {
            id: 'discipline-status',
            target: targets.status,
            group,
            title: 'Disciplina Ativa',
            content:
                mode === 'create'
                    ? [
                          'Este botão já vem ligado. Só disciplinas ativas podem entrar na matriz dos cursos e ser atribuídas a professores.',
                          'Depois de salvar, inclua a disciplina na matriz de um curso para que ela possa ser usada.',
                      ]
                    : [
                          'Desligue este botão para inativar a disciplina. Disciplinas inativas não são oferecidas para cursos e professores.',
                          'Uma disciplina que ainda está na matriz de um curso ou atribuída a professores não pode ser inativada.',
                      ],
        },
        {
            id: 'discipline-form-actions',
            target: targets.formActions,
            group,
            title: 'Salvar ou cancelar',
            content: [
                mode === 'create'
                    ? 'Clique em Salvar para cadastrar a disciplina. Se faltar alguma informação, o aviso aparece embaixo do campo.'
                    : 'Clique em Salvar para gravar as alterações. Se faltar alguma informação, o aviso aparece embaixo do campo.',
                mode === 'create'
                    ? 'Cancelar volta para a lista de disciplinas sem salvar.'
                    : 'Cancelar volta para a disciplina sem salvar.',
            ],
        },
    ];
}

export const disciplineCreateTour: GuidedTourPageConfig = {
    helpHref: HELP_HREF,
    steps: disciplineFormSteps('create'),
};

export const disciplineEditTour: GuidedTourPageConfig = {
    helpHref: HELP_HREF,
    steps: disciplineFormSteps('edit'),
};

export const disciplineShowTour: GuidedTourPageConfig = {
    helpHref: HELP_HREF,
    steps: [
        {
            id: 'discipline-details',
            target: targets.details,
            title: 'Identificação',
            content: 'Aqui aparecem o nome da disciplina, o status e a descrição com os objetivos.',
        },
        {
            id: 'discipline-courses',
            target: targets.courses,
            title: 'Cursos vinculados',
            content: [
                'Mostra os cursos que têm esta disciplina na matriz.',
                'Para incluir ou retirar a disciplina de um curso, edite o curso.',
            ],
        },
        {
            id: 'discipline-details-actions',
            target: targets.detailsActions,
            title: 'Ações da disciplina',
            content: [
                'Voltar leva para a lista. Editar abre o formulário para mudar o nome, a descrição ou o status.',
                'Excluir apaga a disciplina depois de pedir confirmação. A exclusão não é possível quando ela está em cursos, com professores, em PEIs ou no histórico de alunos. Alguns botões só aparecem para quem tem permissão.',
            ],
        },
    ],
};

import { helpUrls } from '@/components/Help/Help.routes';
import type { TableListTourConfig } from '@/components/Tables/TableList/TableList';
import type {
    GuidedTourPageConfig,
    GuidedTourStep,
} from '@/components/UI/GuidedTour/GuidedTour.types';

/** Valores de `data-tour` das partes do cadastro, da visualização e da matriz do professor. */
export const TEACHER_TOUR_TARGETS = {
    photo: 'teacher-photo',
    personal: 'teacher-personal',
    teaching: 'teacher-teaching',
    access: 'teacher-access',
    formActions: 'teacher-form-actions',
    detailsIdentification: 'teacher-details-identification',
    detailsAssignment: 'teacher-details-assignment',
    detailsActions: 'teacher-details-actions',
    disciplinesSemester: 'teacher-disciplines-semester',
    disciplinesIntro: 'teacher-disciplines-intro',
    disciplinesCourse: 'teacher-disciplines-course',
    disciplinesFormActions: 'teacher-disciplines-form-actions',
} as const;

const targets = TEACHER_TOUR_TARGETS;
const HELP_SLUG = 'professores';

export const teacherListTour: TableListTourConfig = {
    helpHref: helpUrls.show(HELP_SLUG),
    actions: [
        'Cadastrar professor abre o formulário de um novo professor.',
        'Na virada de semestre, Copiar vínculos de traz para o semestre atual as disciplinas que cada professor tinha no semestre anterior. Ele só aparece quando há vínculos para copiar e para quem tem permissão.',
    ],
    filters: [
        'Pesquise o professor pelo nome, pelo e-mail ou pela matrícula.',
        'A lista se atualiza sozinha enquanto você digita.',
    ],
    table: [
        'Cada linha é um professor, com a foto, o nome, o e-mail e a matrícula.',
        'Use o botão de olho, no fim da linha, para abrir o perfil do professor.',
    ],
};

function teacherFormSteps(mode: 'create' | 'edit'): GuidedTourStep[] {
    const group = mode === 'create' ? 'Cadastro do professor' : 'Edição do professor';
    const steps: GuidedTourStep[] = [
        {
            id: 'teacher-photo',
            target: targets.photo,
            group,
            title: 'Foto do Professor',
            content: [
                'Clique no círculo para escolher uma imagem, arraste uma imagem até ele ou use o botão da câmera para tirar a foto na hora.',
                mode === 'create'
                    ? 'A foto não é obrigatória. Use uma imagem JPG ou PNG de até 2 MB.'
                    : 'Para trocar a foto, envie outra imagem. Para tirar a foto atual, use o botão de remover sobre ela.',
            ],
        },
        {
            id: 'teacher-personal',
            target: targets.personal,
            group,
            title: 'Dados Pessoais',
            content:
                mode === 'create'
                    ? [
                          'Preencha o nome, o e-mail, o CPF, a data de nascimento, o gênero, o telefone e o endereço. Os campos com asterisco (*) são obrigatórios.',
                          'O E-mail de Acesso é o login do professor e recebe os links de acesso. Use o e-mail institucional.',
                      ]
                    : [
                          'Altere o nome, o e-mail, o CPF, a data de nascimento, o gênero, o telefone e o endereço. Os campos com asterisco (*) são obrigatórios.',
                          'O e-mail também é o login do professor. Se você mudar o e-mail, o login muda junto.',
                      ],
        },
        {
            id: 'teacher-teaching',
            target: targets.teaching,
            group,
            title: 'Dados Docentes',
            content: [
                'Informe a matrícula do professor. Ela não pode ser igual à de outro professor.',
                mode === 'create'
                    ? 'As disciplinas são atribuídas depois de salvar, pelo botão Gerenciar Disciplinas, no perfil do professor.'
                    : 'Para mudar as disciplinas, use o botão Gerenciar Disciplinas, no perfil do professor.',
            ],
        },
    ];

    if (mode === 'create') {
        steps.push({
            id: 'teacher-access',
            target: targets.access,
            group,
            title: 'Acesso ao Sistema',
            content: [
                'Se quiser, defina uma senha com pelo menos 8 caracteres, com letras e números, e repita em Confirmar senha.',
                'Se deixar em branco, o professor recebe por e-mail um link para criar a própria senha.',
            ],
        });
    }

    steps.push({
        id: 'teacher-form-actions',
        target: targets.formActions,
        group,
        title: 'Salvar ou cancelar',
        content: [
            'Clique em Salvar para gravar os dados. Se faltar alguma informação, o aviso aparece embaixo do campo.',
            mode === 'create'
                ? 'Cancelar volta para a lista de professores sem salvar.'
                : 'Cancelar volta para o perfil do professor sem salvar.',
        ],
    });

    return steps;
}

export const teacherCreateTour: GuidedTourPageConfig = {
    helpHref: helpUrls.show(HELP_SLUG, 'cadastrar-um-professor'),
    steps: teacherFormSteps('create'),
};

export const teacherEditTour: GuidedTourPageConfig = {
    helpHref: helpUrls.show(HELP_SLUG, 'editar-ou-excluir-um-professor'),
    steps: teacherFormSteps('edit'),
};

export const teacherShowTour: GuidedTourPageConfig = {
    helpHref: helpUrls.show(HELP_SLUG, 'como-o-professor-acessa-o-gnai'),
    steps: [
        {
            id: 'teacher-details-identification',
            target: targets.detailsIdentification,
            title: 'Identificação Pessoal',
            content:
                'Mostra a foto, o nome, o CPF, a data de nascimento, o e-mail, o telefone e o endereço do professor.',
        },
        {
            id: 'teacher-details-assignment',
            target: targets.detailsAssignment,
            title: 'Vínculo Docente',
            content: [
                'Mostra a matrícula, a data de cadastro e as disciplinas atribuídas, separadas por semestre e curso, do semestre mais recente para o mais antigo.',
                'O professor só pode ser escolhido nas adaptações do PEI das disciplinas que tem atribuídas no curso e no semestre do PEI.',
            ],
        },
        {
            id: 'teacher-details-actions',
            target: targets.detailsActions,
            title: 'Ações do professor',
            content: [
                'Voltar leva para a lista de professores. Gerenciar Disciplinas abre a matriz curricular. Editar abre o cadastro para alterar os dados.',
                'Excluir apaga o professor e o acesso dele, depois de pedir confirmação. Alguns botões só aparecem para quem tem permissão.',
            ],
        },
    ],
};

export const teacherDisciplinesTour: GuidedTourPageConfig = {
    helpHref: helpUrls.show(HELP_SLUG, 'atribuir-disciplinas-ao-professor'),
    steps: [
        {
            id: 'teacher-disciplines-semester',
            target: targets.disciplinesSemester,
            title: 'Semestre letivo',
            content: [
                'Escolha o semestre dos vínculos. A tela abre no semestre atual. Se você trocar de semestre, o que não foi salvo é descartado.',
                'Copiar vínculos de traz as disciplinas que o professor tinha no semestre anterior. O botão só aparece quando há vínculos para copiar.',
            ],
        },
        {
            id: 'teacher-disciplines-intro',
            target: targets.disciplinesIntro,
            title: 'Atribuição de disciplinas por curso',
            content: [
                'Abaixo, cada curso aparece em um bloco com as suas disciplinas.',
                'Só aparecem cursos e disciplinas ativos. Vínculos com cursos ou disciplinas inativos ficam guardados ao salvar.',
            ],
        },
        {
            id: 'teacher-disciplines-course',
            target: targets.disciplinesCourse,
            title: 'Disciplinas do curso',
            content: [
                'Marque as disciplinas que o professor leciona neste curso no semestre escolhido.',
                'Selecionar todas marca ou desmarca todas as disciplinas do curso de uma vez.',
            ],
        },
        {
            id: 'teacher-disciplines-form-actions',
            target: targets.disciplinesFormActions,
            title: 'Salvar ou cancelar',
            content: [
                'Clique em Salvar para gravar as disciplinas do semestre escolhido.',
                'Cancelar volta para o perfil do professor sem salvar.',
            ],
        },
    ],
};

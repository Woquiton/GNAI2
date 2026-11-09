import { helpUrls } from '@/components/Help/Help.routes';
import type { TableListTourConfig } from '@/components/Tables/TableList/TableList';
import type {
    GuidedTourPageConfig,
    GuidedTourStep,
} from '@/components/UI/GuidedTour/GuidedTour.types';

/** Valores de `data-tour` das partes do cadastro e do prontuário do aluno. */
export const STUDENT_TOUR_TARGETS = {
    photo: 'student-photo',
    personal: 'student-personal',
    academic: 'student-academic',
    formActions: 'student-form-actions',
    summary: 'student-summary',
    tabs: 'student-tabs',
    statusPanel: 'student-status-panel',
    recordActions: 'student-record-actions',
} as const;

const targets = STUDENT_TOUR_TARGETS;

export const studentListTour: TableListTourConfig = {
    helpHref: helpUrls.show('alunos', 'encontrar-um-aluno-na-listagem'),
    filters: [
        'Pesquise o aluno pelo nome ou filtre pela situação e pelo curso.',
        'A lista se atualiza sozinha enquanto você digita ou escolhe uma opção.',
    ],
    moreFilters: [
        'Aqui você filtra também pelo tipo de acompanhamento, pelo telefone, pelo e-mail e pelo perfil de atendimento.',
        'O número ao lado do nome mostra quantos desses filtros estão em uso.',
    ],
    table: [
        'Cada linha é um aluno, com a foto, o nome e os dados principais.',
        'Use o botão de olho, no fim da linha, para abrir o prontuário do aluno.',
    ],
};

function studentFormSteps(mode: 'create' | 'edit'): GuidedTourStep[] {
    const group = mode === 'create' ? 'Cadastro do aluno' : 'Edição do aluno';

    return [
        {
            id: 'student-photo',
            target: targets.photo,
            group,
            title: 'Foto do aluno',
            content: [
                'Clique no círculo para escolher uma imagem, arraste uma imagem até ele ou use o botão da câmera para tirar a foto na hora.',
                mode === 'create'
                    ? 'A foto não é obrigatória. Use uma imagem JPG ou PNG de até 2 MB.'
                    : 'Para trocar a foto, envie outra imagem. Para tirar a foto atual, use o botão de remover sobre ela.',
            ],
        },
        {
            id: 'student-personal',
            target: targets.personal,
            group,
            title: 'Dados pessoais',
            content: [
                'Preencha o nome, o e-mail, o CPF, a data de nascimento, o gênero, o telefone e o endereço do aluno.',
                'Os campos com asterisco (*) são obrigatórios.',
            ],
        },
        {
            id: 'student-academic',
            target: targets.academic,
            group,
            title: 'Dados acadêmicos',
            content: [
                'Informe a matrícula, a data de ingresso, a situação e o tipo de acompanhamento do aluno.',
                'Quando a situação é Ativo, o tipo de acompanhamento também precisa ser escolhido.',
            ],
        },
        {
            id: 'student-form-actions',
            target: targets.formActions,
            group,
            title: 'Salvar ou cancelar',
            content: [
                'Clique em Salvar para gravar os dados. Se faltar alguma informação, o aviso aparece embaixo do campo.',
                mode === 'create'
                    ? 'Cancelar volta para a lista de alunos sem salvar.'
                    : 'Cancelar volta para o prontuário sem salvar.',
            ],
        },
    ];
}

export const studentCreateTour: GuidedTourPageConfig = {
    helpHref: helpUrls.show('alunos', 'cadastrar-um-aluno'),
    steps: studentFormSteps('create'),
};

export const studentEditTour: GuidedTourPageConfig = {
    helpHref: helpUrls.show('alunos', 'editar-os-dados-ou-a-situacao-de-um-aluno'),
    steps: studentFormSteps('edit'),
};

export const studentRecordTour: GuidedTourPageConfig = {
    helpHref: helpUrls.show('alunos', 'consultar-o-prontuario-do-aluno'),
    steps: [
        {
            id: 'student-summary',
            target: targets.summary,
            title: 'Resumo do aluno',
            content:
                'Aqui ficam a foto, o nome e os dados principais do aluno, como matrícula, situação e tipo de acompanhamento.',
        },
        {
            id: 'student-status-panel',
            target: targets.statusPanel,
            title: 'Status do atendimento',
            content: [
                'Estes quatro cards mostram a situação do Laudo, do Estudo de Caso, do PAEE e do PEI.',
                'Use Ver, Continuar ou Iniciar conforme a etapa. Os botões aparecem quando os pré-requisitos e suas permissões permitem. Os avisos do PAEE ficam abaixo dos cards.',
            ],
        },
        {
            id: 'student-tabs',
            target: targets.tabs,
            title: 'Abas do prontuário',
            content: [
                'Cada aba mostra uma parte do acompanhamento do aluno, como dados pessoais, cursos, responsáveis, planos, documentos e atendimentos.',
                'Clique em uma aba para abrir. Quando não couberem na largura da tela, as abas continuam na linha de baixo. Você vê só as abas que tem permissão para abrir.',
            ],
        },
        {
            id: 'student-record-actions',
            target: targets.recordActions,
            title: 'Ações do prontuário',
            content: [
                'PDF gera a ficha do aluno. Voltar leva para a lista de alunos. Editar abre o cadastro para alterar os dados.',
                'Excluir apaga o aluno, depois de pedir confirmação. Alguns botões só aparecem para quem tem permissão.',
            ],
        },
    ],
};

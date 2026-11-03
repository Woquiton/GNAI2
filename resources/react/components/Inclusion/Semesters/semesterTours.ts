import { helpUrls } from '@/components/Help/Help.routes';
import type { TableListTourConfig } from '@/components/Tables/TableList/TableList';
import type {
    GuidedTourPageConfig,
    GuidedTourStep,
} from '@/components/UI/GuidedTour/GuidedTour.types';

/** Valores de `data-tour` das partes da listagem, do cadastro e da visualização do semestre. */
export const SEMESTER_TOUR_TARGETS = {
    currentNotice: 'semester-current-notice',
    identification: 'semester-identification',
    current: 'semester-current',
    formActions: 'semester-form-actions',
    details: 'semester-details',
    detailsActions: 'semester-details-actions',
} as const;

const targets = SEMESTER_TOUR_TARGETS;
const HELP_HREF = helpUrls.show('cadastros-do-atendimento', 'semestres');

export const semesterListTour: TableListTourConfig = {
    helpHref: HELP_HREF,
    filters: [
        'Digite o ano para encontrar um semestre. Você também pode filtrar pelo Período, pelo Rótulo e pelo Status: semestre atual ou histórico.',
        'A lista se atualiza sozinha enquanto você digita ou escolhe uma opção.',
    ],
    table: [
        'Cada linha é um semestre, com o ano, o período, o rótulo e o status. A linha do semestre atual aparece destacada.',
        'Use o botão de olho para abrir o semestre. O botão Definir como atual torna aquele semestre o atual do sistema. O semestre atual não pode ser excluído.',
    ],
    steps: [
        {
            id: 'semester-current-notice',
            target: targets.currentNotice,
            title: 'Semestre Atual',
            content: [
                'O semestre atual é sugerido nos registros acadêmicos. Empréstimos, filas e outras operações têm sua origem identificada pela data efetiva no calendário.',
                'Só existe um semestre atual por vez. Os outros aparecem como Histórico.',
            ],
        },
    ],
};

function semesterFormSteps(mode: 'create' | 'edit'): GuidedTourStep[] {
    const group = mode === 'create' ? 'Cadastro do semestre' : 'Edição do semestre';

    return [
        {
            id: 'semester-identification',
            target: targets.identification,
            group,
            title: 'Identificação',
            content: [
                mode === 'create'
                    ? 'Informe o Ano Letivo e o Período, 1 ou 2. Os campos com asterisco (*) são obrigatórios. Não pode haver dois semestres com o mesmo ano e período.'
                    : 'Você pode alterar o Ano Letivo e o Período, 1 ou 2. Os campos com asterisco (*) são obrigatórios. Não pode haver dois semestres com o mesmo ano e período.',
                'As datas de início e término são obrigatórias. O término não pode ser antes do início, e o intervalo não pode se sobrepor ao de outro semestre. O calendário identifica o semestre de origem das operações pelas datas efetivas.',
            ],
        },
        {
            id: 'semester-current',
            target: targets.current,
            group,
            title:
                mode === 'create'
                    ? 'Definir este como o semestre atual do sistema'
                    : 'Este é o semestre atual',
            content: [
                mode === 'create'
                    ? 'Ligue esta opção para que o novo semestre seja o atual do sistema.'
                    : 'Esta opção mostra se o semestre é o atual do sistema. Ligue para torná-lo o atual.',
                'O semestre que era o atual passa a ser histórico.',
            ],
        },
        {
            id: 'semester-form-actions',
            target: targets.formActions,
            group,
            title: 'Salvar ou cancelar',
            content: [
                'Clique em Salvar para gravar o semestre. Se faltar alguma informação, o aviso aparece embaixo do campo.',
                mode === 'create'
                    ? 'Cancelar volta para a lista de semestres sem salvar.'
                    : 'Cancelar volta para o semestre sem salvar.',
            ],
        },
    ];
}

export const semesterCreateTour: GuidedTourPageConfig = {
    helpHref: HELP_HREF,
    steps: semesterFormSteps('create'),
};

export const semesterEditTour: GuidedTourPageConfig = {
    helpHref: HELP_HREF,
    steps: semesterFormSteps('edit'),
};

export const semesterShowTour: GuidedTourPageConfig = {
    helpHref: HELP_HREF,
    steps: [
        {
            id: 'semester-details',
            target: targets.details,
            title: 'Identificação',
            content: [
                'Mostra o rótulo, o ano letivo, o período, as datas de início e de término e a duração do semestre.',
                'Em Vigência Atual, você vê se este é o semestre ativo no sistema ou um período encerrado.',
            ],
        },
        {
            id: 'semester-details-actions',
            target: targets.detailsActions,
            title: 'Ações do semestre',
            content: [
                'Voltar leva para a lista de semestres. Editar abre o cadastro para alterar os dados.',
                'Excluir apaga o semestre depois de pedir confirmação. O botão não aparece para o semestre atual, e um semestre com registros ligados a ele não pode ser excluído. Alguns botões só aparecem para quem tem permissão.',
            ],
        },
    ],
};

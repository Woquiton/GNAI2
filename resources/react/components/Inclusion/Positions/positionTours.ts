import { helpUrls } from '@/components/Help/Help.routes';
import type { TableListTourConfig } from '@/components/Tables/TableList/TableList';
import type {
    GuidedTourPageConfig,
    GuidedTourStep,
} from '@/components/UI/GuidedTour/GuidedTour.types';

/** Valores de `data-tour` das partes do cadastro, da edição e da visualização do cargo. */
export const POSITION_TOUR_TARGETS = {
    identification: 'position-identification',
    permissions: 'position-permissions',
    permissionsAll: 'position-permissions-all',
    permissionsGroup: 'position-permissions-group',
    formActions: 'position-form-actions',
    detailsIdentification: 'position-details-identification',
    detailsPermissions: 'position-details-permissions',
    detailsActions: 'position-details-actions',
} as const;

const targets = POSITION_TOUR_TARGETS;
const HELP_SLUG = 'cadastros-do-atendimento';
const HELP_ANCHOR = 'cargos';

export const positionListTour: TableListTourConfig = {
    helpHref: helpUrls.show(HELP_SLUG, HELP_ANCHOR),
    filters: [
        'Pesquise o cargo pelo Nome ou por uma palavra da Descrição. Em Status, você pode ver só os cargos ativos ou só os inativos.',
        'A lista se atualiza sozinha enquanto você digita ou escolhe uma opção.',
    ],
    table: [
        'Cada linha é um cargo, com o nome e o status. O cargo define o que os profissionais da equipe podem fazer no sistema.',
        'Use o botão de olho, no fim da linha, para abrir o cargo e ver as permissões. Cargos ligados a algum profissional não podem ser excluídos.',
    ],
};

function positionFormSteps(mode: 'create' | 'edit'): GuidedTourStep[] {
    const group = mode === 'create' ? 'Cadastro do cargo' : 'Edição do cargo';

    return [
        {
            id: 'position-identification',
            target: targets.identification,
            group,
            title: 'Identificação',
            content:
                mode === 'create'
                    ? [
                          'Preencha o Nome do Cargo, por exemplo "Professor AEE" ou "Psicólogo". Os campos com asterisco (*) são obrigatórios. A Descrição não é obrigatória.',
                          'Cargo Ativo já vem ligado. Só cargos ativos aparecem no campo Cargo do cadastro da equipe.',
                      ]
                    : [
                          'Altere o Nome do Cargo ou a Descrição. Os campos com asterisco (*) são obrigatórios.',
                          'Desligue Cargo Ativo para que ele não apareça mais no cadastro da equipe. Um cargo ligado a algum profissional não pode ser desativado.',
                      ],
        },
        {
            id: 'position-permissions',
            target: targets.permissions,
            group,
            title: 'Permissões do Cargo',
            content: [
                'Aqui você escolhe o que os profissionais com este cargo podem fazer no sistema. Quem tem o cargo pode fazer exatamente o que estiver marcado.',
                mode === 'create'
                    ? 'Os nomes juntam a ação e a área, como Visualizar Alunos ou Editar Alunos. Nenhuma permissão é obrigatória.'
                    : 'Ao salvar, a mudança vale na hora para todos os profissionais que têm este cargo.',
            ],
        },
        {
            id: 'position-permissions-all',
            target: targets.permissionsAll,
            group,
            title: 'Selecionar todas as permissões',
            content:
                'Marque esta opção para escolher todas as permissões de uma vez. Desmarque para tirar todas. Depois, você pode ajustar cada uma.',
        },
        {
            id: 'position-permissions-group',
            target: targets.permissionsGroup,
            group,
            title: 'Grupos de permissões',
            content: [
                'As permissões ficam agrupadas por área, como Alunos, PEI, Itens e Relatórios.',
                'Selecionar Todas, no topo de cada grupo, marca ou desmarca todas as permissões daquela área. Você também pode marcar uma por uma.',
            ],
        },
        {
            id: 'position-form-actions',
            target: targets.formActions,
            group,
            title: 'Salvar ou cancelar',
            content: [
                'Clique em Salvar para gravar o cargo e as permissões. Se faltar alguma informação, o aviso aparece embaixo do campo.',
                mode === 'create'
                    ? 'Cancelar volta para a lista de cargos sem salvar.'
                    : 'Cancelar volta para a visualização do cargo sem salvar.',
            ],
        },
    ];
}

export const positionCreateTour: GuidedTourPageConfig = {
    helpHref: helpUrls.show(HELP_SLUG, HELP_ANCHOR),
    steps: positionFormSteps('create'),
};

export const positionEditTour: GuidedTourPageConfig = {
    helpHref: helpUrls.show(HELP_SLUG, HELP_ANCHOR),
    steps: positionFormSteps('edit'),
};

export const positionShowTour: GuidedTourPageConfig = {
    helpHref: helpUrls.show(HELP_SLUG, HELP_ANCHOR),
    steps: [
        {
            id: 'position-details-identification',
            target: targets.detailsIdentification,
            title: 'Identificação',
            content: [
                'Mostra o Nome do Cargo / Função, o Status de Disponibilidade e a Descrição da Função.',
                'Só cargos ativos podem ser escolhidos no cadastro da equipe.',
            ],
        },
        {
            id: 'position-details-permissions',
            target: targets.detailsPermissions,
            title: 'Permissões Vinculadas ao Cargo',
            content:
                'Mostra tudo o que os profissionais com este cargo podem fazer no sistema. Para mudar, clique em Editar.',
        },
        {
            id: 'position-details-actions',
            target: targets.detailsActions,
            title: 'Ações do cargo',
            content: [
                'Voltar leva para a lista de cargos. Editar abre o cadastro para alterar os dados, as permissões ou ativar e desativar o cargo.',
                'Excluir apaga o cargo depois de pedir confirmação. Cargos ligados a algum profissional não podem ser excluídos. Alguns botões só aparecem para quem tem permissão.',
            ],
        },
    ],
};

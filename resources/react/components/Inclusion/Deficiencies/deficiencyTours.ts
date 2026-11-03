import { helpUrls } from '@/components/Help/Help.routes';
import type { TableListTourConfig } from '@/components/Tables/TableList/TableList';
import type {
    GuidedTourPageConfig,
    GuidedTourStep,
} from '@/components/UI/GuidedTour/GuidedTour.types';

/** Valores de `data-tour` das partes do cadastro, da edição e da visualização do perfil. */
export const DEFICIENCY_TOUR_TARGETS = {
    identification: 'deficiency-identification',
    formActions: 'deficiency-form-actions',
    details: 'deficiency-details',
    detailsActions: 'deficiency-details-actions',
} as const;

const targets = DEFICIENCY_TOUR_TARGETS;
const HELP_SLUG = 'cadastros-do-atendimento';
const HELP_ANCHOR = 'perfis-de-atendimento';

export const deficiencyListTour: TableListTourConfig = {
    helpHref: helpUrls.show(HELP_SLUG, HELP_ANCHOR),
    filters: [
        'Pesquise o perfil pelo Nome ou pelo Código CID. Em Status, você pode ver só os perfis ativos ou só os inativos.',
        'A lista se atualiza sozinha enquanto você digita ou escolhe uma opção.',
    ],
    table: [
        'Cada linha é um perfil de atendimento, com o nome, o Código CID ao lado e o status. Quando o perfil não tem CID, aparece "S/ CID".',
        'Use o botão de olho, no fim da linha, para abrir o perfil. Perfis em uso por alunos ou solicitações de atendimento não podem ser excluídos.',
    ],
};

function deficiencyFormSteps(mode: 'create' | 'edit'): GuidedTourStep[] {
    const group = mode === 'create' ? 'Cadastro do perfil' : 'Edição do perfil';

    return [
        {
            id: 'deficiency-identification',
            target: targets.identification,
            group,
            title: 'Identificação',
            content:
                mode === 'create'
                    ? [
                          'Preencha o Nome do Perfil, por exemplo "Deficiência Visual". Os campos com asterisco (*) são obrigatórios.',
                          'O Código CID e a Descrição / Detalhes não são obrigatórios. O CID não pode repetir o de outro perfil. Perfil Ativo já vem ligado; desligue se o perfil ainda não deve ser usado.',
                      ]
                    : [
                          'Altere o Nome do Perfil, o Código CID ou a Descrição / Detalhes. Os campos com asterisco (*) são obrigatórios.',
                          'Desligue Perfil Ativo para que ele não possa mais ser vinculado a alunos. Um perfil que já está ligado a algum aluno não pode ser desativado.',
                      ],
        },
        {
            id: 'deficiency-form-actions',
            target: targets.formActions,
            group,
            title: 'Salvar ou cancelar',
            content: [
                'Clique em Salvar para gravar o perfil. Se faltar alguma informação, o aviso aparece embaixo do campo.',
                mode === 'create'
                    ? 'Cancelar volta para a lista de perfis sem salvar.'
                    : 'Cancelar volta para a visualização do perfil sem salvar.',
            ],
        },
    ];
}

export const deficiencyCreateTour: GuidedTourPageConfig = {
    helpHref: helpUrls.show(HELP_SLUG, HELP_ANCHOR),
    steps: deficiencyFormSteps('create'),
};

export const deficiencyEditTour: GuidedTourPageConfig = {
    helpHref: helpUrls.show(HELP_SLUG, HELP_ANCHOR),
    steps: deficiencyFormSteps('edit'),
};

export const deficiencyShowTour: GuidedTourPageConfig = {
    helpHref: helpUrls.show(HELP_SLUG, HELP_ANCHOR),
    steps: [
        {
            id: 'deficiency-details',
            target: targets.details,
            title: 'Identificação',
            content: [
                'Mostra o Nome do Perfil, o Código CID, o Status no Sistema e a Descrição / Detalhes.',
                'Este perfil pode ser escolhido nos perfis de atendimento dos alunos, no público-alvo dos itens e nas barreiras. Perfis inativos não podem ser vinculados a alunos.',
            ],
        },
        {
            id: 'deficiency-details-actions',
            target: targets.detailsActions,
            title: 'Ações do perfil',
            content: [
                'Voltar leva para a lista de perfis. Editar abre o cadastro para alterar os dados ou ativar e desativar o perfil.',
                'Excluir apaga o perfil depois de pedir confirmação. Perfis em uso por alunos ou solicitações de atendimento não podem ser excluídos. Alguns botões só aparecem para quem tem permissão.',
            ],
        },
    ],
};

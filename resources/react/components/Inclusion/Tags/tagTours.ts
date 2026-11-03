import { helpUrls } from '@/components/Help/Help.routes';
import type { TableListTourConfig } from '@/components/Tables/TableList/TableList';
import type {
    GuidedTourPageConfig,
    GuidedTourStep,
} from '@/components/UI/GuidedTour/GuidedTour.types';

/** Valores de `data-tour` das partes do cadastro, da edição e da visualização da etiqueta. */
export const TAG_TOUR_TARGETS = {
    name: 'tag-name',
    active: 'tag-active',
    formActions: 'tag-form-actions',
    details: 'tag-details',
    detailsActions: 'tag-details-actions',
} as const;

const targets = TAG_TOUR_TARGETS;
const HELP_HREF = helpUrls.show('cadastros-do-radar', 'etiquetas');

export const tagListTour: TableListTourConfig = {
    helpHref: HELP_HREF,
    filters: [
        'Digite o nome da etiqueta para encontrá-la. A lista se atualiza sozinha enquanto você digita.',
        'Em Status, você pode ver só as etiquetas ativas ou só as inativas.',
    ],
    table: [
        'Cada linha é uma etiqueta, com o nome e o status. As etiquetas ativas podem ser escolhidas no cadastro de publicações.',
        'Use o botão de olho, no fim da linha, para abrir a etiqueta.',
    ],
};

function tagFormSteps(mode: 'create' | 'edit'): GuidedTourStep[] {
    const group = mode === 'create' ? 'Cadastro da etiqueta' : 'Edição da etiqueta';

    return [
        {
            id: 'tag-name',
            target: targets.name,
            group,
            title: 'Nome da Etiqueta',
            content: [
                mode === 'create'
                    ? 'Digite o nome da etiqueta, como Acessibilidade, Eventos ou Editais. Ele pode ter até 100 caracteres.'
                    : 'Você pode corrigir o nome da etiqueta. Ele pode ter até 100 caracteres.',
                'O asterisco (*) mostra que o campo é obrigatório. O nome não pode repetir o de outra etiqueta.',
            ],
        },
        {
            id: 'tag-active',
            target: targets.active,
            group,
            title: 'Etiqueta Ativa',
            content: [
                'Com esta opção ligada, a etiqueta aparece para escolha no cadastro de publicações.',
                mode === 'create'
                    ? 'Ela já vem ligada. Desligue se ainda não quiser usar a etiqueta.'
                    : 'Para deixar de usar a etiqueta sem apagá-la, desligue esta opção.',
            ],
        },
        {
            id: 'tag-form-actions',
            target: targets.formActions,
            group,
            title: mode === 'create' ? 'Cadastrar ou cancelar' : 'Salvar ou cancelar',
            content:
                mode === 'create'
                    ? [
                          'Clique em Cadastrar para criar a etiqueta. Se faltar alguma informação, o aviso aparece embaixo do campo.',
                          'Cancelar volta para a lista de etiquetas sem salvar.',
                      ]
                    : [
                          'Clique em Salvar para gravar as mudanças. Se faltar alguma informação, o aviso aparece embaixo do campo.',
                          'Cancelar volta para os detalhes da etiqueta sem salvar.',
                      ],
        },
    ];
}

export const tagCreateTour: GuidedTourPageConfig = {
    helpHref: HELP_HREF,
    steps: tagFormSteps('create'),
};

export const tagEditTour: GuidedTourPageConfig = {
    helpHref: HELP_HREF,
    steps: tagFormSteps('edit'),
};

export const tagShowTour: GuidedTourPageConfig = {
    helpHref: HELP_HREF,
    steps: [
        {
            id: 'tag-details',
            target: targets.details,
            title: 'Identificação',
            content: [
                'Mostra o nome da etiqueta e se ela está ativa.',
                'Em Publicações Vinculadas, você vê quantas publicações usam esta etiqueta.',
            ],
        },
        {
            id: 'tag-details-actions',
            target: targets.detailsActions,
            title: 'Ações da etiqueta',
            content: [
                'Voltar leva para a lista de etiquetas. Editar abre o formulário para mudar o nome ou o status.',
                'Excluir apaga a etiqueta depois de pedir confirmação. Se quiser só parar de usar, prefira desligar Etiqueta Ativa na edição. Alguns botões só aparecem para quem tem permissão.',
            ],
        },
    ],
};

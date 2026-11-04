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
    module: 'tag-module',
    color: 'tag-color',
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
        'Em Módulo, escolha Publicações ou Inbox. Em Status, consulte etiquetas ativas ou inativas.',
    ],
    table: [
        'Cada linha mostra nome, módulo, cor e situação. Etiquetas ativas de Publicações classificam publicações; etiquetas ativas de Inbox são os marcadores dos e-mails.',
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
                'O asterisco (*) mostra que o campo é obrigatório. O nome não pode repetir o de outra etiqueta no mesmo módulo.',
            ],
        },
        {
            id: 'tag-module',
            target: targets.module,
            group,
            title: 'Módulo',
            content:
                'Escolha Publicações ou Inbox. O módulo define onde a etiqueta aparece para seleção. Etiquetas já aplicadas não podem trocar de módulo; crie outra etiqueta para o novo módulo.',
        },
        {
            id: 'tag-color',
            target: targets.color,
            group,
            title: 'Cor',
            content:
                'Abra a paleta pelo conta-gotas ou digite uma cor no formato #RRGGBB. A cor identifica o marcador na lateral e nas mensagens da Inbox.',
        },
        {
            id: 'tag-active',
            target: targets.active,
            group,
            title: 'Etiqueta Ativa',
            content: [
                'Com esta opção ligada, a etiqueta fica disponível para novas aplicações no módulo escolhido. Desativar preserva os vínculos existentes.',
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
                'Mostra o nome, o módulo, a cor e a situação da etiqueta.',
                'A contagem mostra publicações vinculadas ou aplicações na Inbox, conforme o módulo.',
            ],
        },
        {
            id: 'tag-details-actions',
            target: targets.detailsActions,
            title: 'Ações da etiqueta',
            content: [
                'Voltar leva para a lista de etiquetas. Editar abre o formulário para mudar nome, cor e situação. O módulo só pode mudar se a etiqueta ainda não estiver em uso.',
                'Excluir apaga a etiqueta depois de pedir confirmação. Se quiser só parar de usar, prefira desligar Etiqueta Ativa na edição. Alguns botões só aparecem para quem tem permissão.',
            ],
        },
    ],
};

import { helpUrls } from '@/components/Help/Help.routes';
import type { TableListTourConfig } from '@/components/Tables/TableList/TableList';
import type {
    GuidedTourPageConfig,
    GuidedTourStep,
} from '@/components/UI/GuidedTour/GuidedTour.types';

/** Valores de `data-tour` das partes do cadastro, da edição e da visualização do ponto de referência. */
export const LOCATION_TOUR_TARGETS = {
    identification: 'location-identification',
    settings: 'location-settings',
    map: 'location-map',
    formActions: 'location-form-actions',
    detailsIdentification: 'location-details-identification',
    detailsSettings: 'location-details-settings',
    detailsMap: 'location-details-map',
    detailsActions: 'location-details-actions',
} as const;

const targets = LOCATION_TOUR_TARGETS;
const HELP_HREF = helpUrls.show('cadastros-do-radar', 'localizacoes');

export const locationListTour: TableListTourConfig = {
    moreFilters: [
        'Pesquise pelo Tipo de local e escolha se o ponto deve ter Barreiras vinculadas.',
        'Você pode combinar esses critérios com o período de cadastro. A borracha limpa todos os filtros.',
    ],
    helpHref: HELP_HREF,
    actions:
        'Cadastrar ponto de referência abre o formulário de um novo prédio, bloco, sala ou outra área da instituição.',
    filters: [
        'Pesquise pelo Nome do Local ou pela Instituição. Em Status, você pode ver só os pontos ativos ou só os inativos.',
        'A lista se atualiza sozinha enquanto você digita ou escolhe uma opção.',
    ],
    table: [
        'Cada linha é um ponto de referência, com o nome, a instituição, o tipo e o status.',
        'Use o botão de olho, no fim da linha, para abrir o ponto. A lixeira exclui depois de pedir confirmação.',
    ],
};

function locationFormSteps(mode: 'create' | 'edit'): GuidedTourStep[] {
    const group = mode === 'create' ? 'Cadastro do ponto' : 'Edição do ponto';

    return [
        {
            id: 'location-identification',
            target: targets.identification,
            group,
            title: 'Identificação',
            content: [
                mode === 'create'
                    ? 'Escolha primeiro a Instituição Base. O mapa vai para a sede dela e o marcador começa lá. Depois, preencha o Nome do Local, por exemplo "Bloco Acadêmico II".'
                    : 'Você pode mudar a Instituição Base. Ao trocar, o marcador volta para a sede da nova instituição. Você também pode mudar o Nome do Local.',
                'Os campos com asterisco (*) são obrigatórios. O Tipo de Local e a Descrição/Observações você preenche se quiser.',
            ],
        },
        {
            id: 'location-settings',
            target: targets.settings,
            group,
            title: 'Configuração',
            content:
                mode === 'create'
                    ? [
                          'Deixe Ponto Ativo no Sistema ligado para que o local apareça nos relatos de barreiras.',
                          'A Latitude e a Longitude são obrigatórias. Elas são preenchidas quando você marca o local no mapa, mas você também pode digitar.',
                      ]
                    : [
                          'Você pode ligar ou desligar Ponto Ativo no Sistema. Enquanto houver barreiras não resolvidas neste local, ele não pode ser desativado.',
                          'A Latitude e a Longitude são obrigatórias e mudam junto com o marcador do mapa.',
                      ],
        },
        {
            id: 'location-map',
            target: targets.map,
            group,
            title: 'Localização no Mapa',
            content: [
                'Clique no mapa ou arraste o marcador para definir o ponto. O mapa só aceita marcação depois que a Instituição Base é escolhida.',
                'O marcador vermelho é a sede da instituição. Os marcadores cinza menores são os outros pontos já cadastrados nela, para ajudar você a se localizar.',
            ],
        },
        {
            id: 'location-form-actions',
            target: targets.formActions,
            group,
            title: mode === 'create' ? 'Cadastrar ou cancelar' : 'Salvar ou cancelar',
            content: [
                mode === 'create'
                    ? 'Clique em Cadastrar para gravar o ponto de referência. Se faltar alguma informação, o aviso aparece embaixo do campo.'
                    : 'Clique em Salvar para gravar as mudanças. Se faltar alguma informação, o aviso aparece embaixo do campo.',
                mode === 'create'
                    ? 'Cancelar volta para a lista de pontos de referência sem salvar.'
                    : 'Cancelar volta para os detalhes do ponto sem salvar.',
            ],
        },
    ];
}

export const locationCreateTour: GuidedTourPageConfig = {
    helpHref: HELP_HREF,
    steps: locationFormSteps('create'),
};

export const locationEditTour: GuidedTourPageConfig = {
    helpHref: HELP_HREF,
    steps: locationFormSteps('edit'),
};

export const locationShowTour: GuidedTourPageConfig = {
    helpHref: HELP_HREF,
    steps: [
        {
            id: 'location-details-identification',
            target: targets.detailsIdentification,
            title: 'Identificação',
            content:
                'Mostra a instituição base, o nome, o tipo e a descrição do ponto de referência.',
        },
        {
            id: 'location-details-settings',
            target: targets.detailsSettings,
            title: 'Configuração',
            content: [
                'Mostra se o ponto está ativo no sistema e as coordenadas dele.',
                'Quando ele está ativo, aparece nos relatos de barreiras.',
            ],
        },
        {
            id: 'location-details-map',
            target: targets.detailsMap,
            title: 'Localização no Mapa',
            content:
                'O mapa mostra onde fica o ponto. O marcador vermelho é a sede da instituição, para ajudar você a se localizar.',
        },
        {
            id: 'location-details-actions',
            target: targets.detailsActions,
            title: 'Ações do ponto',
            content: [
                'Voltar leva para a lista. Editar abre o formulário para mudar os dados.',
                'Excluir apaga o ponto depois de pedir confirmação. Isso não é possível enquanto ele tiver barreiras ativas. Alguns botões só aparecem para quem tem permissão.',
            ],
        },
    ],
};

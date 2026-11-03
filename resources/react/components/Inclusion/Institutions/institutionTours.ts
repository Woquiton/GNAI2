import { helpUrls } from '@/components/Help/Help.routes';
import type { TableListTourConfig } from '@/components/Tables/TableList/TableList';
import type {
    GuidedTourPageConfig,
    GuidedTourStep,
} from '@/components/UI/GuidedTour/GuidedTour.types';

/** Valores de `data-tour` das partes do cadastro, da edição e da visualização da instituição. */
export const INSTITUTION_TOUR_TARGETS = {
    identification: 'institution-identification',
    settings: 'institution-settings',
    map: 'institution-map',
    formActions: 'institution-form-actions',
    detailsIdentification: 'institution-details-identification',
    detailsSettings: 'institution-details-settings',
    detailsMap: 'institution-details-map',
    detailsActions: 'institution-details-actions',
} as const;

const targets = INSTITUTION_TOUR_TARGETS;
const HELP_HREF = helpUrls.show('cadastros-do-radar', 'instituicoes');

export const institutionListTour: TableListTourConfig = {
    helpHref: HELP_HREF,
    actions: [
        'Cadastrar instituição abre o formulário da sede onde o Radar Inclusivo funciona.',
        'O Gnai trabalha com uma única instituição. Para mudar os dados dela, abra a instituição e clique em Editar.',
    ],
    filters: [
        'Pesquise pelo Nome da Instituição ou pela Cidade ou Estado. Em Status, você pode ver só as ativas ou só as inativas.',
        'A lista se atualiza sozinha enquanto você digita ou escolhe uma opção.',
    ],
    table: [
        'Cada linha é uma instituição, com o nome, a cidade e o estado e o status.',
        'Use o botão de olho, no fim da linha, para abrir a instituição. A lixeira exclui depois de pedir confirmação.',
    ],
};

function institutionFormSteps(mode: 'create' | 'edit'): GuidedTourStep[] {
    const group = mode === 'create' ? 'Cadastro da instituição' : 'Edição da instituição';

    return [
        {
            id: 'institution-identification',
            target: targets.identification,
            group,
            title: 'Identificação',
            content: [
                'Preencha o Nome da Instituição, a Cidade e o Estado. Os campos com asterisco (*) são obrigatórios. A Sigla, o Bairro e a Rua você preenche se quiser.',
                'Enquanto você digita o endereço, o mapa tenta encontrar a sede sozinho e leva o marcador até lá.',
            ],
        },
        {
            id: 'institution-settings',
            target: targets.settings,
            group,
            title: 'Configuração',
            content:
                mode === 'create'
                    ? [
                          'Deixe Instituição Ativa ligada para que ela apareça nos relatos de barreiras e no cadastro de pontos de referência.',
                          'O Zoom Padrão define o quanto o mapa de barreiras chega perto ao abrir. A Latitude Sede e a Longitude Sede são obrigatórias e são preenchidas pelo mapa, mas você também pode digitar.',
                      ]
                    : [
                          'Você pode ligar ou desligar Instituição Ativa. Enquanto houver barreiras não resolvidas, a instituição não pode ser desativada.',
                          'O Zoom Padrão define o quanto o mapa de barreiras chega perto ao abrir. A Latitude Sede e a Longitude Sede são obrigatórias e mudam junto com o marcador do mapa.',
                      ],
        },
        {
            id: 'institution-map',
            target: targets.map,
            group,
            title: 'Localização no Mapa',
            content: [
                mode === 'create'
                    ? 'Clique no mapa ou arraste o marcador até a sede. As coordenadas são preenchidas e o endereço encontrado aparece nos campos.'
                    : 'Para mudar a posição da sede, clique no mapa ou arraste o marcador. As coordenadas e o endereço são atualizados.',
                'Ao aproximar ou afastar o mapa, o Zoom Padrão acompanha.',
            ],
        },
        {
            id: 'institution-form-actions',
            target: targets.formActions,
            group,
            title: mode === 'create' ? 'Cadastrar ou cancelar' : 'Salvar ou cancelar',
            content: [
                mode === 'create'
                    ? 'Clique em Cadastrar para gravar a instituição. Se faltar alguma informação, o aviso aparece embaixo do campo.'
                    : 'Clique em Salvar para gravar as mudanças. Se faltar alguma informação, o aviso aparece embaixo do campo.',
                mode === 'create'
                    ? 'Cancelar volta para a lista de instituições sem salvar.'
                    : 'Cancelar volta para os detalhes da instituição sem salvar.',
            ],
        },
    ];
}

export const institutionCreateTour: GuidedTourPageConfig = {
    helpHref: HELP_HREF,
    steps: institutionFormSteps('create'),
};

export const institutionEditTour: GuidedTourPageConfig = {
    helpHref: HELP_HREF,
    steps: institutionFormSteps('edit'),
};

export const institutionShowTour: GuidedTourPageConfig = {
    helpHref: HELP_HREF,
    steps: [
        {
            id: 'institution-details-identification',
            target: targets.detailsIdentification,
            title: 'Identificação',
            content:
                'Mostra o nome, a sigla, a cidade, o estado, o bairro e a rua da sede da instituição.',
        },
        {
            id: 'institution-details-settings',
            target: targets.detailsSettings,
            title: 'Configuração',
            content: [
                'Mostra se a instituição está ativa, o Zoom Padrão do mapa de barreiras e as coordenadas da sede.',
                'Quando ela está ativa, aparece nos relatos de barreiras e no cadastro de pontos de referência.',
            ],
        },
        {
            id: 'institution-details-map',
            target: targets.detailsMap,
            title: 'Localização no Mapa',
            content:
                'O marcador mostra onde fica a sede. O mapa abre com o Zoom Padrão da instituição.',
        },
        {
            id: 'institution-details-actions',
            target: targets.detailsActions,
            title: 'Ações da instituição',
            content: [
                'Voltar leva para a lista. Editar abre o formulário para mudar os dados.',
                'Excluir apaga a instituição depois de pedir confirmação, junto com os pontos de referência dela. Isso não é possível enquanto houver barreiras ativas. Alguns botões só aparecem para quem tem permissão.',
            ],
        },
    ],
};

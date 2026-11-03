import { helpUrls } from '@/components/Help/Help.routes';
import type { TableListTourConfig } from '@/components/Tables/TableList/TableList';
import type {
    GuidedTourPageConfig,
    GuidedTourStep,
} from '@/components/UI/GuidedTour/GuidedTour.types';
import { openDisclosureDemo } from '@/components/UI/GuidedTour/guidedTourDemos';

/** Valores de `data-tour` das partes do formulário e da visualização do recurso de acessibilidade. */
export const ACCESSIBILITY_FEATURE_TOUR_TARGETS = {
    name: 'accessibility-feature-name',
    description: 'accessibility-feature-description',
    status: 'accessibility-feature-status',
    formActions: 'accessibility-feature-form-actions',
    details: 'accessibility-feature-details',
    detailsDescription: 'accessibility-feature-details-description',
    detailsActions: 'accessibility-feature-details-actions',
} as const;

const targets = ACCESSIBILITY_FEATURE_TOUR_TARGETS;
const HELP_HREF = helpUrls.show('cadastros-do-radar', 'recursos-de-acessibilidade');

export const accessibilityFeatureListTour: TableListTourConfig = {
    helpHref: HELP_HREF,
    filters: [
        'Em Nome, digite parte do nome para encontrar um recurso de acessibilidade.',
        'Em Status, você pode ver só os ativos ou só os inativos. A lista se atualiza sozinha.',
    ],
    table: [
        'Cada linha é um recurso, com o nome e o status. A coluna Descrição começa escondida e pode ser mostrada em Colunas.',
        'Use o botão de olho, no fim da linha, para abrir o recurso. A lixeira exclui depois de pedir confirmação.',
    ],
};

function accessibilityFeatureFormSteps(mode: 'create' | 'edit'): GuidedTourStep[] {
    const group = mode === 'create' ? 'Cadastro do recurso' : 'Edição do recurso';

    return [
        {
            id: 'accessibility-feature-name',
            target: targets.name,
            group,
            title: 'Nome do Recurso',
            content: [
                'Digite o nome do recurso, como Intérprete de Libras ou Piso Podotátil. Ele não pode repetir outro já cadastrado.',
                'Os campos com asterisco (*) são obrigatórios.',
            ],
        },
        {
            id: 'accessibility-feature-description',
            target: targets.description,
            group,
            title: 'Descrição Detalhada',
            content:
                'Você pode explicar o recurso com mais detalhes, em até 1000 caracteres. Este campo não é obrigatório.',
        },
        {
            id: 'accessibility-feature-status',
            target: targets.status,
            group,
            title: 'Recurso Ativo',
            content:
                mode === 'create'
                    ? [
                          'Deixe ligado para o recurso aparecer em Recursos presentes no item, no cadastro de itens.',
                          'Recursos inativos continuam guardados, mas não são oferecidos em novos cadastros.',
                      ]
                    : [
                          'Desligue para o recurso deixar de aparecer no cadastro de itens. Os itens que já usam o recurso continuam com ele.',
                          'Se o recurso ainda descreve itens do acervo, prefira desligar em vez de excluir.',
                      ],
        },
        {
            id: 'accessibility-feature-form-actions',
            target: targets.formActions,
            group,
            title: mode === 'create' ? 'Cadastrar ou cancelar' : 'Salvar ou cancelar',
            content: [
                mode === 'create'
                    ? 'Clique em Cadastrar para registrar o recurso. Se faltar alguma informação, o aviso aparece embaixo do campo.'
                    : 'Clique em Salvar para gravar as alterações. Se faltar alguma informação, o aviso aparece embaixo do campo.',
                mode === 'create'
                    ? 'Cancelar volta para a lista de recursos sem salvar.'
                    : 'Cancelar volta para o recurso sem salvar.',
            ],
        },
    ];
}

export const accessibilityFeatureCreateTour: GuidedTourPageConfig = {
    helpHref: HELP_HREF,
    steps: accessibilityFeatureFormSteps('create'),
};

export const accessibilityFeatureEditTour: GuidedTourPageConfig = {
    helpHref: HELP_HREF,
    steps: accessibilityFeatureFormSteps('edit'),
};

export const accessibilityFeatureShowTour: GuidedTourPageConfig = {
    helpHref: HELP_HREF,
    steps: [
        {
            id: 'accessibility-feature-details',
            target: targets.details,
            title: 'Identificação',
            content: [
                'Aqui aparecem o nome do recurso, a descrição e se ele está ativo.',
                'Em Itens Vinculados, você vê quantos itens do acervo usam este recurso.',
            ],
        },
        {
            id: 'accessibility-feature-details-description',
            target: targets.detailsDescription,
            title: 'Descrição Detalhada',
            content:
                'Quando o texto é longo, só o começo aparece. Clique em Ver mais para ler tudo e em Ver menos para recolher.',
            onEnter: (target) =>
                openDisclosureDemo(
                    target?.querySelector<HTMLElement>('.expandableContent__toggle') ?? null,
                    {
                        note: 'Abrimos o texto inteiro para você ver. Ele recolhe de novo no próximo passo.',
                    },
                ),
        },
        {
            id: 'accessibility-feature-details-actions',
            target: targets.detailsActions,
            title: 'Ações do recurso',
            content: [
                'Voltar leva para a lista. Editar abre o formulário para mudar o nome, a descrição ou o status.',
                'Excluir apaga o recurso depois de pedir confirmação. Alguns botões só aparecem para quem tem permissão.',
            ],
        },
    ],
};

import { helpUrls } from '@/components/Help/Help.routes';
import {
    TABLE_LIST_TOUR_GROUPS,
    TABLE_LIST_TOUR_TARGETS,
    tableListTourSteps,
} from '@/components/Tables/TableList/tableListTour';
import type {
    GuidedTourPageConfig,
    GuidedTourStep,
} from '@/components/UI/GuidedTour/GuidedTour.types';
import { itemListViewStep } from './List/itemListTourBridge';

/** Valores de `data-tour` do formulário e da visualização do item. */
export const ITEM_TOUR_TARGETS = {
    viewMode: 'item-view-mode',
    catalog: 'item-catalog',
    catalogActions: 'item-catalog-actions',
    identification: 'item-identification',
    management: 'item-management',
    inspection: 'item-inspection',
    formActions: 'item-form-actions',
    detailsIdentification: 'item-details-identification',
    detailsManagement: 'item-details-management',
    loanHistory: 'item-loan-history',
    inspectionHistory: 'item-inspection-history',
    detailsActions: 'item-details-actions',
} as const;

const targets = ITEM_TOUR_TARGETS;
const HELP_SLUG = 'itens';

const listSteps = tableListTourSteps({
    filters: [
        'Em Descrição, digite o nome do item. Você também pode filtrar pelo tipo, pela natureza e pelo recurso de acessibilidade.',
        'A lista se atualiza sozinha.',
    ],
    moreFilters: [
        'Aqui você filtra pelo Status, ativo ou inativo, e pela Disponibilidade, com ou sem unidades disponíveis.',
        'O número ao lado do nome mostra quantos desses filtros estão em uso.',
    ],
    table: [
        'Cada linha é um item, com a descrição, o tipo, a natureza, o estoque e o status. O estoque mostra as unidades disponíveis e o total. Recursos digitais aparecem como Ilimitado, e um item físico sem unidades livres aparece como Esgotado.',
        'No fim da linha, o botão de olho abre o item e o botão de lixeira exclui, depois de pedir confirmação.',
    ],
});

export const itemListTour: GuidedTourPageConfig = {
    helpHref: helpUrls.show(HELP_SLUG, 'encontrar-um-item-na-listagem'),
    steps: [
        ...listSteps.filter((step) => step.group === TABLE_LIST_TOUR_GROUPS.filters),
        {
            id: 'view-mode',
            target: targets.viewMode,
            title: 'Listagem e catálogo',
            content: [
                'Alterne entre a tabela e os cards. Os filtros, a página atual e as ações são os mesmos nos dois modos.',
                'O modo escolhido fica salvo na sua conta para esta tela e será usado nas próximas visitas, até você alterá-lo.',
            ],
        },
        ...listSteps
            .filter((step) => step.group === TABLE_LIST_TOUR_GROUPS.table)
            .map((step) =>
                itemListViewStep(
                    step,
                    'list',
                    step.target === TABLE_LIST_TOUR_TARGETS.rowActions
                        ? TABLE_LIST_TOUR_TARGETS.rowActions
                        : targets.viewMode,
                ),
            ),
        itemListViewStep(
            {
                id: 'catalog',
                target: targets.catalog,
                group: 'Catálogo',
                title: 'Catálogo de itens',
                content: [
                    'Os cards mostram a capa, o tipo, o estoque e o status. A foto favorita da vistoria é a capa; sem favorita, aparece uma imagem da vistoria mais recente com fotos.',
                    'Use o filtro Tipo da barra principal para filtrar com a animação de reorganização dos cards.',
                ],
            },
            'catalog',
            targets.viewMode,
        ),
        itemListViewStep(
            {
                id: 'catalog-actions',
                target: targets.catalogActions,
                group: 'Catálogo',
                title: 'Ações de cada card',
                content: [
                    'O olho abre os detalhes do item. A lixeira pede confirmação antes de excluir. Os botões disponíveis dependem da sua permissão.',
                    'No computador, as ações aparecem ao passar o mouse ou navegar pelo teclado. Durante este passo, elas ficam visíveis para você conhecer.',
                ],
            },
            'catalog',
            TABLE_LIST_TOUR_TARGETS.rowActions,
            true,
        ),
        ...listSteps.filter((step) => step.group === TABLE_LIST_TOUR_GROUPS.pages),
    ],
};

/** Formulário do item: cadastro, cadastro a partir de um clone ou edição. */
type ItemFormTourMode = 'create' | 'clone' | 'edit';

function identificationContent(mode: ItemFormTourMode): string[] {
    if (mode === 'clone') {
        return [
            'Os dados vieram do item original. Revise o tipo, a descrição, a natureza, os recursos e o público alvo.',
            'O Patrimônio / Tombamento fica em branco, porque cada exemplar tem o seu. Os campos com asterisco (*) são obrigatórios.',
        ];
    }

    return [
        mode === 'create'
            ? 'Escolha o tipo do item, escreva a descrição e diga se é um recurso físico ou digital. O Patrimônio / Tombamento só aparece para recursos físicos.'
            : 'Altere o tipo, a descrição, a natureza, os recursos presentes no item ou o público alvo. O Patrimônio / Tombamento só aparece para recursos físicos.',
        'Em Público Alvo, marque ao menos uma opção. Os campos com asterisco (*) são obrigatórios.',
    ];
}

function managementContent(mode: ItemFormTourMode): string[] {
    if (mode === 'edit') {
        return [
            'Altere a quantidade, o status do recurso e as opções de empréstimo e de ativação.',
            'Se houver empréstimos em andamento, um aviso mostra quantas unidades estão em uso. A quantidade total não pode ficar abaixo delas, e o status do recurso só muda depois das devoluções.',
        ];
    }

    return [
        mode === 'create'
            ? 'Informe a quantidade total de unidades. Ela é obrigatória para recursos físicos. O status do recurso já vem como Disponível.'
            : 'A quantidade, o status do recurso e as opções vieram do item original. Ajuste o que for diferente.',
        'Marque Permitir Empréstimos se o item pode ser emprestado. Ativar no Sistema deixa o item disponível para consulta e empréstimos.',
    ];
}

function inspectionStep(mode: ItemFormTourMode): GuidedTourStep {
    const evidences =
        'Em Evidências, arraste fotos e documentos ou clique na área para selecionar arquivos. São até 10 arquivos, com até 20 MB cada.';

    return mode === 'edit'
        ? {
              id: 'item-inspection',
              target: targets.inspection,
              title: 'Nova Vistoria',
              content: [
                  'Escolha o tipo de inspeção, a data e o estado de conservação. A data não pode ser futura.',
                  `${evidences} A nova vistoria só entra no histórico quando o estado muda ou quando você escreve o parecer ou anexa evidências.`,
              ],
          }
        : {
              id: 'item-inspection',
              target: targets.inspection,
              title: 'Vistoria Inicial',
              content: [
                  'Informe a data da inspeção e o estado de conservação do item. A data não pode ser futura.',
                  `${evidences} Ao salvar, esta vistoria vira a primeira do histórico do item.`,
              ],
          };
}

function itemFormSteps(mode: ItemFormTourMode): GuidedTourStep[] {
    return [
        {
            id: 'item-identification',
            target: targets.identification,
            title: 'Identificação',
            content: identificationContent(mode),
        },
        {
            id: 'item-management',
            target: targets.management,
            title: 'Gestão',
            content: managementContent(mode),
        },
        inspectionStep(mode),
        {
            id: 'item-form-actions',
            target: targets.formActions,
            title: 'Salvar ou cancelar',
            content: [
                mode === 'clone'
                    ? 'Clique em Salvar para criar o novo item. O item original não muda.'
                    : 'Clique em Salvar para gravar o item. Se faltar alguma informação, o aviso aparece embaixo do campo.',
                mode === 'edit'
                    ? 'Cancelar volta para os detalhes do item sem salvar.'
                    : 'Cancelar volta para a lista de itens sem salvar.',
            ],
        },
    ];
}

export const itemCreateTour: GuidedTourPageConfig = {
    helpHref: helpUrls.show(HELP_SLUG, 'cadastrar-um-item'),
    steps: itemFormSteps('create'),
};

export const itemCloneTour: GuidedTourPageConfig = {
    helpHref: helpUrls.show(HELP_SLUG, 'clonar-um-item'),
    steps: itemFormSteps('clone'),
};

export const itemEditTour: GuidedTourPageConfig = {
    helpHref: helpUrls.show(HELP_SLUG, 'editar-um-item-e-registrar-uma-nova-vistoria'),
    steps: itemFormSteps('edit'),
};

export const itemShowTour: GuidedTourPageConfig = {
    helpHref: helpUrls.show(HELP_SLUG, 'ver-os-detalhes-as-vistorias-e-os-emprestimos-de-um-item'),
    steps: [
        {
            id: 'item-details-identification',
            target: targets.detailsIdentification,
            title: 'Identificação',
            content:
                'Mostra o tipo, a descrição, a natureza, o patrimônio, a descrição detalhada e os recursos de acessibilidade do item.',
        },
        {
            id: 'item-details-management',
            target: targets.detailsManagement,
            title: 'Gestão',
            content: [
                'Mostra a quantidade total e a disponível, o status do recurso, se o item permite empréstimos, se está ativo e o público alvo.',
                'Recursos digitais não têm estoque, por isso as quantidades aparecem como Não se aplica.',
            ],
        },
        {
            id: 'item-loan-history',
            target: targets.loanHistory,
            title: 'Histórico de Empréstimos',
            content: [
                'Mostra quem recebeu o item, as datas de saída, prazo e devolução e o status de cada empréstimo.',
                'Use o botão de olho, no fim da linha, para abrir o empréstimo.',
            ],
        },
        {
            id: 'item-inspection-history',
            target: targets.inspectionHistory,
            title: 'Histórico de Vistorias',
            content: [
                'Cada linha é uma vistoria, com a data, o tipo, o estado de conservação, a descrição e as evidências.',
                'Use o botão de olho, no fim da linha, para ver a vistoria completa. Para registrar uma nova vistoria, use Editar.',
            ],
        },
        {
            id: 'item-details-actions',
            target: targets.detailsActions,
            title: 'Ações do item',
            content: [
                'PDF gera a ficha do item. Voltar leva para a lista. Clonar abre um cadastro novo já preenchido com os dados deste item. Editar abre o item para alterar.',
                'Excluir apaga o item, depois de pedir confirmação. Alguns botões só aparecem para quem tem permissão.',
            ],
        },
    ],
};

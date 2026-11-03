import { helpUrls } from '@/components/Help/Help.routes';
import type { TableListTourConfig } from '@/components/Tables/TableList/TableList';
import type {
    GuidedTourDemo,
    GuidedTourPageConfig,
    GuidedTourStep,
} from '@/components/UI/GuidedTour/GuidedTour.types';
import { openDisclosureDemo } from '@/components/UI/GuidedTour/guidedTourDemos';

/** Valores de `data-tour` das partes do cadastro, da edição e da visualização da categoria. */
export const BARRIER_CATEGORY_TOUR_TARGETS = {
    name: 'barrier-category-name',
    description: 'barrier-category-description',
    active: 'barrier-category-active',
    blocksMap: 'barrier-category-blocks-map',
    formActions: 'barrier-category-form-actions',
    details: 'barrier-category-details',
    detailsDescription: 'barrier-category-details-description',
    detailsActions: 'barrier-category-details-actions',
} as const;

const targets = BARRIER_CATEGORY_TOUR_TARGETS;
const HELP_HREF = helpUrls.show('cadastros-do-radar', 'categorias-de-barreiras');

export const barrierCategoryListTour: TableListTourConfig = {
    helpHref: HELP_HREF,
    filters: [
        'Digite o nome da categoria para encontrá-la. A lista se atualiza sozinha enquanto você digita.',
        'Em Status, você pode ver só as categorias ativas ou só as inativas.',
    ],
    table: [
        'Cada linha é uma categoria, com o nome, o número de barreiras ligadas a ela em Vínculos e o status.',
        'As colunas Descrição e Permite marcar no mapa ficam escondidas no começo. Você pode mostrá-las em Escolher colunas. Use o botão de olho, no fim da linha, para abrir a categoria.',
    ],
};

function barrierCategoryFormSteps(mode: 'create' | 'edit'): GuidedTourStep[] {
    const group = mode === 'create' ? 'Cadastro da categoria' : 'Edição da categoria';

    return [
        {
            id: 'barrier-category-name',
            target: targets.name,
            group,
            title: 'Nome da Categoria',
            content: [
                mode === 'create'
                    ? 'Digite o nome da categoria, como Arquitetônica, Atitudinal ou Comunicacional. Ele pode ter até 150 caracteres.'
                    : 'Você pode corrigir o nome da categoria. Ele pode ter até 150 caracteres.',
                'O asterisco (*) mostra que o campo é obrigatório. O nome não pode repetir o de outra categoria.',
            ],
        },
        {
            id: 'barrier-category-description',
            target: targets.description,
            group,
            title: 'Descrição Detalhada',
            content: [
                'Explique que tipo de obstáculo entra nesta categoria. Você pode usar negrito, listas e outros recursos do editor.',
                'Este campo não é obrigatório.',
            ],
        },
        {
            id: 'barrier-category-active',
            target: targets.active,
            group,
            title: 'Ativar no Sistema',
            content: [
                'Com esta opção ligada, a categoria aparece para escolha no relato de novas barreiras.',
                mode === 'create'
                    ? 'Ela já vem ligada. Desligue se ainda não quiser usar a categoria.'
                    : 'Para deixar de usar a categoria sem apagá-la, desligue esta opção.',
            ],
        },
        {
            id: 'barrier-category-blocks-map',
            target: targets.blocksMap,
            group,
            title: 'Bloquear Mapa',
            content: [
                'Com esta opção ligada, o mapa fica escondido no relato de uma barreira desta categoria. Use quando essas barreiras não tiverem um ponto no mapa.',
                mode === 'create'
                    ? 'Ela já vem ligada. Desligue para que as barreiras desta categoria possam ser marcadas no mapa.'
                    : 'Desligue para que as barreiras desta categoria possam ser marcadas no mapa.',
            ],
        },
        {
            id: 'barrier-category-form-actions',
            target: targets.formActions,
            group,
            title: 'Salvar ou cancelar',
            content: [
                mode === 'create'
                    ? 'Clique em Salvar para criar a categoria. Se faltar alguma informação, o aviso aparece embaixo do campo.'
                    : 'Clique em Salvar para gravar as mudanças. Se faltar alguma informação, o aviso aparece embaixo do campo.',
                mode === 'create'
                    ? 'Cancelar volta para a lista de categorias sem salvar.'
                    : 'Cancelar volta para os detalhes da categoria sem salvar.',
            ],
        },
    ];
}

export const barrierCategoryCreateTour: GuidedTourPageConfig = {
    helpHref: HELP_HREF,
    steps: barrierCategoryFormSteps('create'),
};

export const barrierCategoryEditTour: GuidedTourPageConfig = {
    helpHref: HELP_HREF,
    steps: barrierCategoryFormSteps('edit'),
};

/** Abre a descrição longa com "Ver mais"; descrições curtas já aparecem inteiras. */
function descriptionDemo(target: HTMLElement | null): GuidedTourDemo {
    return openDisclosureDemo(
        target?.querySelector<HTMLElement>('.expandableContent__toggle') ?? null,
        {
            note: 'Abrimos a descrição inteira para você ver. Ela volta a ficar resumida no próximo passo.',
        },
    );
}

export const barrierCategoryShowTour: GuidedTourPageConfig = {
    helpHref: HELP_HREF,
    steps: [
        {
            id: 'barrier-category-details',
            target: targets.details,
            title: 'Identificação',
            content: [
                'Mostra o nome, a descrição e quantas barreiras usam esta categoria, em Barreiras Vinculadas.',
                'Embaixo, Ativo no Sistema diz se a categoria aparece no relato de barreiras. Mapa se Aplica diz se essas barreiras podem ser marcadas no mapa.',
            ],
        },
        {
            id: 'barrier-category-details-description',
            target: targets.detailsDescription,
            title: 'Descrição Detalhada',
            content:
                'Quando a descrição é longa, ela aparece resumida. Clique em Ver mais para ler tudo e em Ver menos para resumir de novo.',
            onEnter: descriptionDemo,
        },
        {
            id: 'barrier-category-details-actions',
            target: targets.detailsActions,
            title: 'Ações da categoria',
            content: [
                'Voltar leva para a lista de categorias. Editar abre o formulário para mudar os dados.',
                'Excluir apaga a categoria depois de pedir confirmação. Uma categoria com barreiras ainda não resolvidas não pode ser excluída; nesse caso, você pode desligar Ativar no Sistema na edição. Alguns botões só aparecem para quem tem permissão.',
            ],
        },
    ],
};

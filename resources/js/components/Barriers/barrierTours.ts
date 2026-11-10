import { helpUrls } from '@/components/Help/Help.routes';
import type { TableListTourConfig } from '@/components/Tables/TableList/TableList';
import type {
    GuidedTourPageConfig,
    GuidedTourStep,
} from '@/components/UI/GuidedTour/GuidedTour.types';

/** Valores de `data-tour` das seções do formulário e da visualização da barreira. */
export const BARRIER_TOUR_TARGETS = {
    identification: 'barrier-identification',
    affectedPeople: 'barrier-affected-people',
    map: 'barrier-map',
    inspection: 'barrier-inspection',
    formActions: 'barrier-form-actions',
    detailsIdentification: 'barrier-details-identification',
    detailsMap: 'barrier-details-map',
    detailsInspections: 'barrier-details-inspections',
    detailsActions: 'barrier-details-actions',
} as const;

const targets = BARRIER_TOUR_TARGETS;
const HELP_SLUG = 'barreiras';

export const barrierListTour: TableListTourConfig = {
    moreFilters: [
        'Pesquise pela Instituição ou pelo Ponto de referência e escolha se o Registro ativo deve ser Sim ou Não.',
        'Você pode combinar esses critérios com o período de cadastro. A borracha limpa todos os filtros.',
    ],
    helpHref: helpUrls.show(HELP_SLUG, 'consultar-barreiras-vistorias-e-pdf'),
    actions:
        'Clique em Relatar barreira para registrar um novo problema de acessibilidade encontrado na instituição.',
    filters: [
        'Em Nome da barreira, digite o título do relato. Você também pode filtrar pela categoria, pela prioridade e pelo status.',
        'A lista se atualiza sozinha enquanto você digita ou escolhe uma opção.',
    ],
    table: [
        'Cada linha é uma barreira, com o nome, a categoria, a prioridade e o status da vistoria mais recente.',
        'Use o botão de olho, no fim da linha, para abrir a barreira.',
    ],
};

function barrierFormSteps(mode: 'create' | 'edit'): GuidedTourStep[] {
    const group = mode === 'create' ? 'Relato da barreira' : 'Edição da barreira';

    return [
        {
            id: 'barrier-identification',
            target: targets.identification,
            group,
            title: 'Identificação',
            content: [
                mode === 'create'
                    ? 'Dê um título ao relato e informe a data, a prioridade, a categoria e o campus ou unidade. Depois de escolher o campus, você pode indicar o local.'
                    : 'Aqui ficam o título, a data, a prioridade, a categoria, o local e a descrição da barreira. Você pode corrigir o que precisar.',
                'Os campos com asterisco (*) são obrigatórios. Em Público Alvo, marque ao menos uma opção.',
            ],
        },
        {
            id: 'barrier-affected-people',
            target: targets.affectedPeople,
            group,
            title: 'Pessoa Impactada',
            content: [
                'Escolha um estudante ou um profissional cadastrado. Em Relato Geral, informe o nome e o cargo da pessoa.',
                'Em Relato Anônimo, ninguém é identificado no registro.',
            ],
        },
        {
            id: 'barrier-map',
            target: targets.map,
            group,
            title: 'Localização no Mapa',
            content: [
                'Clique no mapa para marcar o ponto exato da barreira. O mapa só libera a marcação depois que você escolhe o campus ou unidade.',
                'Exibir Locais (Cinza) mostra os pontos de referência do campus. Algumas categorias não usam o mapa, e ele fica bloqueado.',
            ],
        },
        {
            id: 'barrier-inspection',
            target: targets.inspection,
            group,
            title: mode === 'create' ? 'Vistoria Inicial' : 'Vistoria Periódica',
            content:
                mode === 'create'
                    ? [
                          'Escolha o Status Inicial e confira a Data da Vistoria. A data não pode ser futura.',
                          'Em Evidências, arraste fotos e documentos ou clique na área para selecionar arquivos. Você também pode escrever o parecer técnico.',
                      ]
                    : [
                          'Para registrar uma nova vistoria, mude o Status Atual, arraste arquivos para Evidências ou clique na área para selecioná-los, ou escreva o parecer técnico.',
                          'Se você só mudar os dados do relato, nenhuma vistoria nova entra no histórico.',
                      ],
        },
        {
            id: 'barrier-form-actions',
            target: targets.formActions,
            group,
            title: 'Salvar ou cancelar',
            content: [
                'Clique em Salvar para gravar a barreira. Se faltar alguma informação, o aviso aparece embaixo do campo.',
                'Cancelar volta para a tela anterior sem salvar.',
            ],
        },
    ];
}

export const barrierCreateTour: GuidedTourPageConfig = {
    helpHref: helpUrls.show(HELP_SLUG, 'relatar-uma-barreira'),
    steps: barrierFormSteps('create'),
};

export const barrierEditTour: GuidedTourPageConfig = {
    helpHref: helpUrls.show(HELP_SLUG, 'atualizar-o-status-com-uma-nova-vistoria'),
    steps: barrierFormSteps('edit'),
};

export const barrierShowTour: GuidedTourPageConfig = {
    helpHref: helpUrls.show(HELP_SLUG, 'consultar-barreiras-vistorias-e-pdf'),
    steps: [
        {
            id: 'barrier-details-identification',
            target: targets.detailsIdentification,
            title: 'Identificação',
            content: [
                'Mostra o título, a data, a prioridade, a categoria, o local, quem relatou e a descrição da barreira.',
                'No fim ficam o público alvo e as pessoas impactadas.',
            ],
        },
        {
            id: 'barrier-details-map',
            target: targets.detailsMap,
            title: 'Localização no Mapa',
            content: 'Mostra o ponto da barreira no mapa do campus, com a latitude e a longitude.',
        },
        {
            id: 'barrier-details-inspections',
            target: targets.detailsInspections,
            title: 'Histórico de Vistorias',
            content: [
                'Cada linha é uma vistoria, da mais recente para a mais antiga. O status da barreira é sempre o da vistoria mais recente.',
                'Abra uma vistoria para ver o parecer técnico e as evidências. Para registrar uma nova, use Editar.',
            ],
        },
        {
            id: 'barrier-details-actions',
            target: targets.detailsActions,
            title: 'Ações da barreira',
            content: [
                'PDF gera um relatório da barreira. Voltar leva para a lista de barreiras. Editar abre a barreira para alterar.',
                'Excluir apaga a barreira, depois de pedir confirmação. Alguns botões só aparecem para quem tem permissão.',
            ],
        },
    ],
};

import { helpUrls } from '@/components/Help/Help.routes';
import type { TableListTourConfig } from '@/components/Tables/TableList/TableList';
import type {
    GuidedTourPageConfig,
    GuidedTourStep,
} from '@/components/UI/GuidedTour/GuidedTour.types';

/** Valores de `data-tour` das seções do formulário e da visualização da solicitação. */
export const SUPPORT_REQUEST_TOUR_TARGETS = {
    identification: 'support-request-identification',
    demand: 'support-request-demand',
    review: 'support-request-review',
    attachments: 'support-request-attachments',
    formActions: 'support-request-form-actions',
    detailsIdentification: 'support-request-details-identification',
    detailsDemand: 'support-request-details-demand',
    detailsReview: 'support-request-details-review',
    detailsAttachments: 'support-request-details-attachments',
    detailsActions: 'support-request-details-actions',
} as const;

const targets = SUPPORT_REQUEST_TOUR_TARGETS;
const HELP_SLUG = 'solicitacoes-de-atendimento';

export const supportRequestListTour: TableListTourConfig = {
    helpHref: helpUrls.show(HELP_SLUG, 'encontrar-registros-e-gerar-o-pdf'),
    filters: [
        'Em Buscar, digite o nome do aluno, o nome de quem pediu o atendimento ou o número do protocolo.',
        'Você também pode filtrar pela situação da solicitação e pelo aluno. A lista se atualiza sozinha.',
    ],
    table: [
        'Cada linha é uma solicitação, com o aluno, o protocolo, o motivo, quem pediu e a situação.',
        'Use o botão de olho, no fim da linha, para abrir a solicitação.',
    ],
};

function supportRequestFormSteps(mode: 'create' | 'edit'): GuidedTourStep[] {
    const group = mode === 'create' ? 'Registro da solicitação' : 'Edição da solicitação';

    return [
        {
            id: 'support-request-identification',
            target: targets.identification,
            group,
            title: 'Identificação',
            content: [
                mode === 'create'
                    ? 'Escolha o aluno e informe a data, o curso e quem apresentou a demanda. O aluno precisa estar cadastrado antes.'
                    : 'Aqui ficam o aluno, a data, o curso e quem apresentou a demanda. O aluno não pode ser trocado depois de salvar.',
                'Os campos com asterisco (*) são obrigatórios.',
            ],
        },
        {
            id: 'support-request-demand',
            target: targets.demand,
            group,
            title: 'Solicitação',
            content: [
                'Escolha o motivo. Em Perfil de atendimento, marque ao menos um perfil. Em Outro, descreva o motivo.',
                'Registre também as dificuldades e os apoios pedidos. Diagnóstico e laudo não são obrigatórios.',
            ],
        },
        {
            id: 'support-request-review',
            target: targets.review,
            group,
            title: 'Análise e encaminhamentos',
            content:
                mode === 'create'
                    ? [
                          'Toda solicitação nova começa como Recebida.',
                          'Depois de salvar, a equipe muda a situação e registra a análise e os encaminhamentos pela edição.',
                      ]
                    : [
                          'Mude a situação da solicitação e registre a análise da equipe e as providências tomadas.',
                          'Mudar a situação não altera a situação do aluno.',
                      ],
        },
        {
            id: 'support-request-attachments',
            target: targets.attachments,
            group,
            title: 'Documentos',
            content: [
                'Arraste os arquivos para a área tracejada ou clique nela para anexar PDF, Word, ODT, JPG ou PNG. São até 10 arquivos, com até 10 MB cada.',
                mode === 'create'
                    ? 'Os documentos não são obrigatórios.'
                    : 'Para tirar um anexo, use o botão de remover. Ele só sai de verdade quando você salva.',
            ],
        },
        {
            id: 'support-request-form-actions',
            target: targets.formActions,
            group,
            title: 'Salvar ou cancelar',
            content: [
                'Clique em Salvar para gravar a solicitação. Se faltar alguma informação, o aviso aparece embaixo do campo.',
                'Cancelar volta para a tela anterior sem salvar.',
            ],
        },
    ];
}

export const supportRequestCreateTour: GuidedTourPageConfig = {
    helpHref: helpUrls.show(HELP_SLUG, 'registrar-uma-solicitacao'),
    steps: supportRequestFormSteps('create'),
};

export const supportRequestEditTour: GuidedTourPageConfig = {
    helpHref: helpUrls.show(HELP_SLUG, 'analisar-e-registrar-encaminhamentos'),
    steps: supportRequestFormSteps('edit'),
};

export const supportRequestShowTour: GuidedTourPageConfig = {
    helpHref: helpUrls.show(HELP_SLUG),
    steps: [
        {
            id: 'support-request-details-identification',
            target: targets.detailsIdentification,
            title: 'Identificação',
            content:
                'Mostra o protocolo, o aluno, o curso, a data e quem apresentou a demanda, com o contato.',
        },
        {
            id: 'support-request-details-demand',
            target: targets.detailsDemand,
            title: 'Solicitação',
            content: 'Mostra o motivo, as dificuldades relatadas e os apoios pedidos.',
        },
        {
            id: 'support-request-details-review',
            target: targets.detailsReview,
            title: 'Análise e encaminhamentos',
            content: [
                'Mostra a situação da solicitação, quem registrou e quando, a análise da equipe e as providências tomadas.',
                'Para mudar a situação ou registrar a análise, use Editar.',
            ],
        },
        {
            id: 'support-request-details-attachments',
            target: targets.detailsAttachments,
            title: 'Documentos',
            content: 'Clique no nome de um documento para baixar.',
        },
        {
            id: 'support-request-details-actions',
            target: targets.detailsActions,
            title: 'Ações da solicitação',
            content: [
                'PDF gera um arquivo com os dados da solicitação. Voltar leva para a tela anterior. Editar abre a solicitação para alterar.',
                'Excluir apaga a solicitação e os anexos, depois de pedir confirmação. Alguns botões só aparecem para quem tem permissão.',
            ],
        },
    ],
};

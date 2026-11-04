import { helpUrls } from '@/components/Help/Help.routes';
import type {
    GuidedTourPageConfig,
    GuidedTourStep,
} from '@/components/UI/GuidedTour/GuidedTour.types';

/** Valores de `data-tour` dos detalhes de uma vistoria, iguais para itens e barreiras. */
export const INSPECTION_TOUR_TARGETS = {
    general: 'inspection-general',
    evidences: 'inspection-evidences',
    cover: 'inspection-cover',
    actions: 'inspection-actions',
} as const;

const targets = INSPECTION_TOUR_TARGETS;

function actionsStep(subject: string): GuidedTourStep {
    return {
        id: 'inspection-actions',
        target: targets.actions,
        title: 'Voltar',
        content: `Clique em Voltar para retornar aos detalhes ${subject}, com o histórico de todas as vistorias.`,
    };
}

export const itemInspectionShowTour: GuidedTourPageConfig = {
    helpHref: helpUrls.show('itens', 'ver-os-detalhes-as-vistorias-e-os-emprestimos-de-um-item'),
    actions: 'Aqui aparece a data em que a vistoria foi feita.',
    steps: [
        {
            id: 'inspection-general',
            target: targets.general,
            title: 'Informações Gerais',
            content: [
                'Mostra o estado de conservação do item, o tipo de inspeção e o parecer técnico de quem fez a vistoria.',
                'Quando o parecer é longo, clique em Ver mais para ler tudo.',
            ],
        },
        {
            id: 'inspection-evidences',
            target: targets.evidences,
            title: 'Evidências',
            content: [
                'Aqui ficam as fotos e os documentos anexados na vistoria. Use as bolinhas abaixo para navegar. Com a escolha de favorita habilitada, a rotação automática fica pausada.',
                'Clique em uma foto para ver em tamanho maior. Os documentos abrem em uma nova aba.',
            ],
        },
        {
            id: 'inspection-cover',
            target: targets.cover,
            title: 'Imagem favorita e capa',
            content: [
                'Quem pode editar o item pode clicar na estrela sobre uma foto do carrossel para usá-la como capa no catálogo. Todos que consultam os itens podem ver essa capa.',
                'Se já houver uma favorita, a confirmação mostra a imagem atual e a nova antes de substituir.',
            ],
        },
        actionsStep('do item'),
    ],
};

export const barrierInspectionShowTour: GuidedTourPageConfig = {
    helpHref: helpUrls.show('barreiras', 'consultar-barreiras-vistorias-e-pdf'),
    steps: [
        {
            id: 'inspection-general',
            target: targets.general,
            title: 'Informações Gerais',
            content:
                'Mostra o status da barreira registrado nesta vistoria, o tipo de inspeção, a data e o parecer técnico de quem fez a vistoria.',
        },
        {
            id: 'inspection-evidences',
            target: targets.evidences,
            title: 'Evidências',
            content: [
                'Aqui ficam as fotos e os documentos anexados na vistoria.',
                'Clique em uma evidência para abrir em uma nova aba.',
            ],
        },
        actionsStep('da barreira'),
    ],
};

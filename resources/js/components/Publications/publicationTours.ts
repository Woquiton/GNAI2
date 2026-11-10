import { helpUrls } from '@/components/Help/Help.routes';
import type { TableListTourConfig } from '@/components/Tables/TableList/TableList';
import type {
    GuidedTourPageConfig,
    GuidedTourStep,
} from '@/components/UI/GuidedTour/GuidedTour.types';
import { openDisclosureDemo } from '@/components/UI/GuidedTour/guidedTourDemos';

/** Valores de `data-tour` das partes do cadastro, da edição e da visualização da publicação. */
export const PUBLICATION_TOUR_TARGETS = {
    content: 'publication-content',
    cover: 'publication-cover',
    gallery: 'publication-gallery',
    schedule: 'publication-schedule',
    people: 'publication-people',
    status: 'publication-status',
    seo: 'publication-seo',
    formActions: 'publication-form-actions',
    showContent: 'publication-show-content',
    showDescription: 'publication-show-description',
    showSchedule: 'publication-show-schedule',
    showMedia: 'publication-show-media',
    showVisibility: 'publication-show-visibility',
    showActions: 'publication-show-actions',
} as const;

const targets = PUBLICATION_TOUR_TARGETS;
const HELP_SLUG = 'publicacoes';

type FormMode = 'create' | 'edit';

export const publicationListTour: TableListTourConfig = {
    moreFilters: [
        'Pesquise por Autor ou Etiqueta e escolha se a publicação está Em destaque.',
        'Você pode combinar esses critérios com o período de cadastro. A borracha limpa todos os filtros.',
    ],
    helpHref: helpUrls.show(HELP_SLUG, 'consultar-as-publicacoes'),
    actions:
        'Clique em Cadastrar publicação para escrever uma notícia, um evento, um comunicado, um artigo ou um registro para o site.',
    filters: [
        'Digite parte do Título para encontrar uma publicação. Você também pode escolher o Tipo e a Situação, Publicado ou Rascunho.',
        'A lista se atualiza sozinha enquanto você digita ou escolhe uma opção.',
    ],
    table: [
        'Cada linha é uma publicação, com o tipo, a data de publicação, as datas do evento, o andamento e a situação. As publicações em destaque mostram uma estrela ao lado do título.',
        'No fim da linha, o olho abre a publicação. Quando ela está no site, outro botão abre a página pública em uma nova aba.',
    ],
};

function publicationFormSteps(mode: FormMode): GuidedTourStep[] {
    const group = mode === 'create' ? 'Cadastro da publicação' : 'Edição da publicação';

    return [
        {
            id: 'publication-content',
            target: targets.content,
            group,
            title: 'Conteúdo',
            content: [
                'Escreva o Título, um Resumo curto e o Texto da publicação. Escolha também o Tipo e, se quiser, as Etiquetas, que servem de filtro no site.',
                mode === 'create'
                    ? 'O Autor já vem com o seu nome, e você pode trocar. Os campos com asterisco (*) são obrigatórios.'
                    : 'Você pode trocar o Autor ou deixar Sem autor. Os campos com asterisco (*) são obrigatórios.',
            ],
        },
        {
            id: 'publication-cover',
            target: targets.cover,
            group,
            title: 'Imagem de capa',
            content: [
                mode === 'create'
                    ? 'A capa aparece nos cartões e no topo da publicação no site. Envie uma imagem JPG, PNG ou WEBP com até 4 MB.'
                    : 'Aqui aparece a capa atual. Você pode trocar a imagem ou remover a capa.',
                'Quando houver capa, descreva a imagem no Texto alternativo. Ele ajuda quem usa leitor de tela.',
            ],
        },
        {
            id: 'publication-gallery',
            target: targets.gallery,
            group,
            title: 'Galeria de fotos',
            content: [
                'Arraste as fotos para a área tracejada ou clique nela para enviar várias imagens de uma vez, até 30 fotos.',
                mode === 'create'
                    ? 'Cada foto precisa de um texto alternativo. Use o botão com X ao lado para tirar uma foto da lista.'
                    : 'Você pode mudar o texto alternativo das fotos, remover as que já estão salvas e acrescentar novas. As fotos removidas saem quando você salvar.',
            ],
        },
        {
            id: 'publication-schedule',
            target: targets.schedule,
            group,
            title: 'Datas e local',
            content: [
                'Para eventos, ative Tem data de início e término. Assim o site mostra se o evento está em breve, acontecendo agora ou encerrado.',
                'Com a opção ativada, as datas, os horários e o Local passam a ser obrigatórios. Organizador e Público são opcionais.',
            ],
        },
        {
            id: 'publication-people',
            target: targets.people,
            group,
            title: 'Participantes e link',
            content: [
                'Clique em Participante para incluir uma pessoa. Escolha alguém da equipe ou digite o nome de quem não está no sistema, e diga a Atuação, como palestrante.',
                'Em Link, coloque um endereço de inscrição, transmissão ou material extra. O Texto do link é o que aparece no botão do site.',
            ],
        },
        {
            id: 'publication-status',
            target: targets.status,
            group,
            title: 'Publicação',
            content: [
                mode === 'create'
                    ? 'Na Situação, Publicado leva a publicação ao site e Rascunho deixa ela só aqui no sistema. Novas publicações começam como Publicado.'
                    : 'Na Situação, Publicado mantém a publicação no site. Para tirar do site sem excluir, escolha Rascunho.',
                'A Data de publicação pode ficar em branco. Com uma data futura, a publicação só aparece no site a partir desse dia. Exibir em destaque coloca a publicação primeiro na página inicial.',
            ],
        },
        {
            id: 'publication-seo',
            target: targets.seo,
            group,
            title: 'Endereço e buscadores',
            content: [
                'O Endereço da página é o final do link da publicação no site. Em branco, ele é criado a partir do título.',
                'O Título e a Descrição para buscadores são opcionais. Vazios, usam o título e o resumo da publicação.',
            ],
        },
        {
            id: 'publication-form-actions',
            target: targets.formActions,
            group,
            title: 'Salvar ou cancelar',
            content: [
                mode === 'create'
                    ? 'Clique em Salvar para cadastrar a publicação. Se faltar alguma informação, o aviso aparece embaixo do campo.'
                    : 'Clique em Salvar para gravar as alterações. Se faltar alguma informação, o aviso aparece embaixo do campo.',
                'Cancelar volta para as publicações sem salvar.',
            ],
        },
    ];
}

export const publicationCreateTour: GuidedTourPageConfig = {
    helpHref: helpUrls.show(HELP_SLUG, 'cadastrar-uma-publicacao'),
    steps: publicationFormSteps('create'),
};

export const publicationEditTour: GuidedTourPageConfig = {
    helpHref: helpUrls.show(HELP_SLUG, 'ver-editar-ou-exportar-uma-publicacao'),
    steps: publicationFormSteps('edit'),
};

export const publicationShowTour: GuidedTourPageConfig = {
    helpHref: helpUrls.show(HELP_SLUG, 'ver-editar-ou-exportar-uma-publicacao'),
    steps: [
        {
            id: 'publication-show-content',
            target: targets.showContent,
            title: 'Conteúdo',
            content:
                'Aqui aparecem o título, o resumo, o tipo, as etiquetas, o autor e o link da publicação.',
        },
        {
            id: 'publication-show-description',
            target: targets.showDescription,
            title: 'Texto da publicação',
            content: [
                'Este é o texto completo da publicação.',
                'Quando o texto é longo, clique em Ver mais para ler tudo e em Ver menos para recolher.',
            ],
            onEnter: (target) =>
                openDisclosureDemo(
                    target?.querySelector<HTMLElement>('.expandableContent__toggle') ?? null,
                    {
                        note: 'Abrimos o texto inteiro para você ver. Ele recolhe no próximo passo.',
                    },
                ),
        },
        {
            id: 'publication-show-schedule',
            target: targets.showSchedule,
            title: 'Datas e local',
            content: [
                'Mostra as datas e os horários do evento, o andamento, o local, o organizador e o público.',
                'Os participantes aparecem aqui com a atuação de cada um.',
            ],
        },
        {
            id: 'publication-show-media',
            target: targets.showMedia,
            title: 'Mídia',
            content: 'Aqui ficam a capa, com o texto alternativo, e as fotos da galeria.',
        },
        {
            id: 'publication-show-visibility',
            target: targets.showVisibility,
            title: 'Publicação no site',
            content: [
                'Mostra a Situação, Publicado ou Rascunho, a data de publicação e se está em destaque.',
                'Também mostra o endereço da página no site e os textos para buscadores.',
            ],
        },
        {
            id: 'publication-show-actions',
            target: targets.showActions,
            title: 'Ações da publicação',
            content: [
                'PDF gera a publicação em uma nova aba. Ver no site abre a página pública, quando a publicação já está no ar.',
                'Voltar leva para a lista. Editar abre o formulário. Excluir apaga a publicação depois de pedir confirmação. Alguns botões só aparecem para quem tem permissão.',
            ],
        },
    ],
};

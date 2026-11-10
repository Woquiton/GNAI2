import { helpUrls } from '@/components/Help/Help.routes';
import type {
    GuidedTourDemo,
    GuidedTourPageConfig,
} from '@/components/UI/GuidedTour/GuidedTour.types';

/** Valores de `data-tour` das partes da administração do site. */
export const WEBSITE_BUILDER_TOUR_TARGETS = {
    accessibility: 'website-builder-accessibility',
    tabs: 'website-builder-tabs',
    sectionsTabLabel: 'website-builder-sections-tab',
    editTabLabel: 'website-builder-edit-tab',
    structure: 'website-builder-structure',
    identity: 'website-builder-identity',
    sectionActions: 'website-builder-section-actions',
    addSection: 'website-builder-add-section',
    editor: 'website-builder-editor',
    preview: 'website-builder-preview',
    devices: 'website-builder-devices',
    actions: 'website-builder-actions',
} as const;

const targets = WEBSITE_BUILDER_TOUR_TARGETS;
const HELP_SLUG = 'site';

/**
 * Abre a aba Seções ou Edição para mostrar o que só aparece com ela aberta e devolve como voltar
 * para a aba anterior. Trocar de aba não altera nada do site. A leitura espera a volta do passo
 * anterior terminar.
 */
function tabDemo(tabKey: 'sections' | 'edit', label: string) {
    return (): GuidedTourDemo => {
        const strip = document.querySelector<HTMLElement>(`[data-tour="${targets.tabs}"]`);

        if (!strip) {
            return {};
        }

        let previous: HTMLElement | null = null;
        const timer = window.setTimeout(() => {
            const tab = strip.querySelector<HTMLElement>(`[role="tab"][data-tab-key="${tabKey}"]`);
            const selected = strip.querySelector<HTMLElement>('[role="tab"][aria-selected="true"]');

            if (!tab || !selected || tab === selected) {
                return;
            }

            previous = selected;
            tab.click();
        }, 0);

        return {
            note: `Mostramos a aba ${label}. Ao sair do passo, a aba anterior volta.`,
            undo: () => {
                window.clearTimeout(timer);
                previous?.click();
            },
        };
    };
}

const sectionsTabDemo = tabDemo('sections', 'Seções');
const editTabDemo = tabDemo('edit', 'Edição');

/** Mostra a prévia como no celular e volta para o computador ao sair do passo. */
function mobilePreviewDemo(): GuidedTourDemo {
    const group = document.querySelector<HTMLElement>(`[data-tour="${targets.devices}"]`);
    const buttons = group ? Array.from(group.querySelectorAll<HTMLElement>('button')) : [];
    const pressed = buttons.find((button) => button.getAttribute('aria-pressed') === 'true');
    const mobile = buttons.find((button) => button.textContent?.includes('Celular'));

    if (!mobile || !pressed || mobile === pressed) {
        return {};
    }

    mobile.click();

    return {
        note: 'A prévia mudou para Celular. Ao sair do passo, ela volta para Computador.',
        undo: () => pressed.click(),
    };
}

const STRUCTURE_GROUP = 'Seções da página';
const EDIT_GROUP = 'Edição';
const PREVIEW_GROUP = 'Prévia';

export const websiteBuilderEditTour: GuidedTourPageConfig = {
    helpHref: helpUrls.show(HELP_SLUG, 'abrir-o-construtor-e-a-previa'),
    steps: [
        {
            id: 'website-builder-accessibility',
            target: targets.accessibility,
            title: 'Acessibilidade antes de publicar',
            content: [
                'Revise os títulos, as descrições de imagens e os destinos das ações. O botão Revisar abre o campo correspondente.',
                'Ao salvar, o sistema verifica também as cores e o conteúdo formatado. Confira o site publicado com teclado e leitor de tela.',
            ],
        },
        {
            id: 'website-builder-tabs',
            target: targets.tabs,
            title: 'Seções e Edição',
            content: [
                'À esquerda ficam duas abas. Em Seções você organiza a página inicial. Em Edição você preenche os campos do item escolhido.',
                'Ao clicar em um item da lista, a aba Edição abre sozinha.',
            ],
        },
        {
            id: 'website-builder-structure',
            target: targets.structure,
            availableWith: targets.sectionsTabLabel,
            group: STRUCTURE_GROUP,
            title: 'Estrutura da página',
            content: [
                'A lista mostra as seções na ordem em que aparecem no site.',
                'Clique no nome de uma seção para editar os campos dela. Seções escondidas aparecem como Oculta.',
            ],
            onEnter: sectionsTabDemo,
        },
        {
            id: 'website-builder-identity',
            target: targets.identity,
            availableWith: targets.sectionsTabLabel,
            group: STRUCTURE_GROUP,
            title: 'Identidade',
            content: [
                'O primeiro item é sempre a Identidade, com o topo e o rodapé do site.',
                'Clique nele para mudar o nome do site, o slogan, a cor principal, o logo, os contatos e as redes sociais.',
            ],
            onEnter: sectionsTabDemo,
        },
        {
            id: 'website-builder-section-actions',
            target: targets.sectionActions,
            availableWith: targets.sectionsTabLabel,
            group: STRUCTURE_GROUP,
            title: 'Ordem e visibilidade',
            content: [
                'Ao lado de cada seção, as setas mudam a ordem. O olho oculta ou exibe a seção no site, sem apagar o conteúdo.',
                'A lixeira remove a seção da página.',
            ],
            onEnter: sectionsTabDemo,
        },
        {
            id: 'website-builder-add-section',
            target: targets.addSection,
            availableWith: targets.sectionsTabLabel,
            group: STRUCTURE_GROUP,
            title: 'Nova seção',
            content: [
                'Escolha o tipo em Nova seção e clique em Adicionar. A seção entra no final da página e abre na aba Edição.',
                'A página inicial aceita até 20 seções.',
            ],
            onEnter: sectionsTabDemo,
        },
        {
            id: 'website-builder-editor',
            target: targets.editor,
            availableWith: targets.editTabLabel,
            group: EDIT_GROUP,
            title: 'Edição',
            content: [
                'Aqui ficam os campos do item escolhido. Eles mudam conforme o tipo da seção, como textos, imagens, itens e aparência.',
                'Use Voltar às seções para retornar à lista.',
            ],
            onEnter: editTabDemo,
        },
        {
            id: 'website-builder-preview',
            target: targets.preview,
            group: PREVIEW_GROUP,
            title: 'Prévia em tempo real',
            content: [
                'A prévia mostra a página inicial como ela vai ficar. Cada mudança aparece aqui na hora.',
                'Clique duas vezes em um elemento da prévia para abrir direto a edição dele.',
            ],
        },
        {
            id: 'website-builder-devices',
            target: targets.devices,
            group: PREVIEW_GROUP,
            title: 'Computador e Celular',
            content: [
                'Alterne entre Computador e Celular para conferir as duas versões da página.',
            ],
            onEnter: mobilePreviewDemo,
        },
        {
            id: 'website-builder-actions',
            target: targets.actions,
            title: 'Salvar, cancelar e ver o site',
            content: [
                'As alterações só vão para o site depois de clicar em Salvar. Cancelar descarta o que não foi salvo.',
                'Ver site abre o site publicado em uma nova aba.',
            ],
        },
    ],
};

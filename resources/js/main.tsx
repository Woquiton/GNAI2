import { createInertiaApp, router } from '@inertiajs/react';
import type { ComponentType, ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import AppLayout from '@/components/Navigation/AppLayout/AppLayout';
import AppLoader from '@/components/UI/AppLoader/AppLoader';
import {
    applyAccessibilityPreferences,
    readAccessibilityPreferences,
    installFocusModality,
} from '@/utils/accessibilityPreferences';
import { applyColorPalette } from '@/utils/colorPalette';
import '@styles/reset.css';
import '@styles/tokens.css';
import '@styles/globals.css';
import '@styles/accessibility.css';

type PageComponent = ComponentType & { layout?: (page: ReactNode) => ReactNode };

/** Somente as entradas Inertia de `pages/` são resolvidas. */
const pages = import.meta.glob<{ default: PageComponent }>('./pages/**/*.tsx');

/** Páginas com estrutura própria (autenticação, site público e erros). */
const STANDALONE_PREFIXES = ['Website/Public/'];
const STANDALONE_PAGES = [
    'Auth/Login',
    'Auth/LockScreen',
    'Auth/ForgotPassword',
    'Auth/ResetPassword',
    'Errors/Error',
    'Errors/Maintenance',
];

function usesAppLayout(name: string): boolean {
    return (
        !STANDALONE_PREFIXES.some((prefix) => name.startsWith(prefix)) &&
        !STANDALONE_PAGES.includes(name)
    );
}

// O modo de foco vale antes da primeira renderização, inclusive no login.
installFocusModality();
applyAccessibilityPreferences(readAccessibilityPreferences());

void createInertiaApp({
    id: 'root',
    resolve: async (name) => {
        const load = pages[`./pages/${name}.tsx`];

        if (!load) {
            throw new Error(`Página React não encontrada: ${name}`);
        }

        const page = (await load()).default;

        if (usesAppLayout(name)) {
            page.layout ??= (children) => <AppLayout>{children}</AppLayout>;
        }

        return page;
    },
    setup({ el, App, props }) {
        type PaletteProps = typeof props.initialPage.props;
        const palettes = new Map<number, unknown>();
        function userId(pageProps: PaletteProps): number | undefined {
            return (pageProps.auth as { user?: { id: number } | null } | undefined)?.user?.id;
        }
        function rememberPalette(pageProps: PaletteProps): void {
            const id = userId(pageProps);
            if (id !== undefined) palettes.set(id, pageProps.colorPalette);
            applyColorPalette(pageProps.colorPalette);
        }

        rememberPalette(props.initialPage.props);
        router.on('navigate', (event) => {
            const pageProps = event.detail.page.props;
            const id = userId(pageProps);
            // Voltar no navegador não deve restaurar a paleta antiga de uma página em cache.
            applyColorPalette(
                id !== undefined && palettes.has(id)
                    ? palettes.get(id)
                    : pageProps.colorPalette,
            );
        });
        router.on('success', (event) => {
            rememberPalette(event.detail.page.props);
        });
        createRoot(el).render(
            <>
                <AppLoader />
                <App {...props} />
            </>,
        );
    },
});

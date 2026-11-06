import { createInertiaApp } from '@inertiajs/react';
import type { ComponentType, ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import AppLayout from '@/components/Navigation/AppLayout/AppLayout';
import AppLoader from '@/components/UI/AppLoader/AppLoader';
import { installFocusModality } from '@/utils/accessibilityPreferences';
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
        createRoot(el).render(
            <>
                <AppLoader />
                <App {...props} />
            </>,
        );
    },
});

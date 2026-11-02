// @ts-check
import { registerHooks } from 'node:module';

/*
 * O projeto compila com o TypeScript 7 nativo, que não expõe a API JavaScript usada pelo
 * typescript-eslint. Somente os módulos do typescript-eslint passam a resolver o pacote
 * `typescript-eslint-runtime` (TypeScript 6). O typecheck continua sendo `npm run check`.
 */
registerHooks({
    resolve(specifier, context, nextResolve) {
        const fromTypescriptEslint =
            context.parentURL?.includes('/node_modules/@typescript-eslint/') ||
            context.parentURL?.includes('/node_modules/typescript-eslint/') ||
            context.parentURL?.includes('/node_modules/ts-api-utils/');

        if (
            fromTypescriptEslint &&
            (specifier === 'typescript' || specifier.startsWith('typescript/'))
        ) {
            return nextResolve(
                specifier.replace(/^typescript/, 'typescript-eslint-runtime'),
                context,
            );
        }

        return nextResolve(specifier, context);
    },
});

const [
    { default: js },
    { default: tseslint },
    { default: react },
    { default: reactHooks },
    { default: jsxA11y },
    { default: prettier },
    { default: globals },
] = await Promise.all([
    import('@eslint/js'),
    import('typescript-eslint'),
    import('eslint-plugin-react'),
    import('eslint-plugin-react-hooks'),
    import('eslint-plugin-jsx-a11y'),
    import('eslint-config-prettier'),
    import('globals'),
]);

/** Fronteiras de dependência descritas em resources/react/AGENTS.md. */
const pageImports = {
    group: ['@/pages/*', '@/pages/**'],
    message:
        'Componentes, hooks e utilitários não dependem de páginas. Mova o código compartilhado para components/.',
};
const appImports = {
    group: ['@/app/*', '@/app/**', '@/catalog/*', '@/catalog/**'],
    message: 'O produto não depende do catálogo demonstrativo.',
};
const uiImports = {
    group: ['@/components/*', '@/components/**'],
    message: 'Hooks, utilitários e tipos compartilhados não dependem de componentes.',
};
const upperLayerImports = {
    group: ['@/hooks/*', '@/hooks/**'],
    message: 'Utilitários e tipos não dependem de hooks.',
};

export default tseslint.config(
    {
        ignores: [
            'public/**',
            'vendor/**',
            'node_modules/**',
            'storage/**',
            'resources/js/**',
            'resources/css/**',
        ],
    },
    {
        files: ['resources/react/**/*.{ts,tsx}'],
        extends: [
            js.configs.recommended,
            ...tseslint.configs.recommended,
            react.configs.flat.recommended,
            react.configs.flat['jsx-runtime'],
            jsxA11y.flatConfigs.recommended,
        ],
        plugins: {
            'react-hooks': reactHooks,
        },
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: 'module',
            globals: globals.browser,
        },
        settings: {
            react: { version: '19.0' },
        },
        rules: {
            'react-hooks/rules-of-hooks': 'error',
            'react-hooks/exhaustive-deps': 'warn',

            'react/prop-types': 'off',
            'react/jsx-key': ['error', { checkFragmentShorthand: true }],
            'react/no-array-index-key': 'warn',
            'react/jsx-no-useless-fragment': ['warn', { allowExpressions: true }],
            'react/self-closing-comp': 'warn',
            'react/jsx-boolean-value': ['warn', 'never'],
            'react/jsx-curly-brace-presence': ['warn', { props: 'never', children: 'never' }],
            'react/no-danger': 'warn',
            // `head-key` é o atributo de deduplicação do <Head> do Inertia.
            'react/no-unknown-property': ['error', { ignore: ['head-key'] }],

            '@typescript-eslint/consistent-type-imports': [
                'warn',
                { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
            ],
            '@typescript-eslint/no-unused-vars': [
                'error',
                { argsIgnorePattern: '^_', varsIgnorePattern: '^_', ignoreRestSiblings: true },
            ],
            '@typescript-eslint/no-explicit-any': 'warn',

            // Os plugins legados exigem marcação herdada do tema; os avisos orientam correções graduais.
            'jsx-a11y/no-autofocus': 'warn',
            'jsx-a11y/anchor-is-valid': 'warn',
            'jsx-a11y/click-events-have-key-events': 'warn',
            'jsx-a11y/no-static-element-interactions': 'warn',
            'jsx-a11y/no-noninteractive-element-interactions': 'warn',
            'jsx-a11y/label-has-associated-control': 'warn',
            'jsx-a11y/no-noninteractive-tabindex': 'warn',
            'jsx-a11y/media-has-caption': 'warn',
            // role="list" preserva a semântica de listas sem marcadores no Safari/VoiceOver.
            'jsx-a11y/no-redundant-roles': ['error', { ul: ['list'], ol: ['list'] }],

            'no-console': ['warn', { allow: ['warn', 'error'] }],
            eqeqeq: ['error', 'smart'],
            curly: ['warn', 'all'],
            'prefer-const': 'error',
            'no-restricted-imports': ['error', { patterns: [appImports] }],
        },
    },
    {
        files: ['resources/react/components/**/*.{ts,tsx}'],
        rules: {
            'no-restricted-imports': ['error', { patterns: [pageImports, appImports] }],
        },
    },
    {
        files: ['resources/react/hooks/**/*.{ts,tsx}'],
        rules: {
            'no-restricted-imports': ['error', { patterns: [pageImports, appImports, uiImports] }],
        },
    },
    {
        files: ['resources/react/{utils,types}/**/*.{ts,tsx}'],
        rules: {
            'no-restricted-imports': [
                'error',
                { patterns: [pageImports, appImports, uiImports, upperLayerImports] },
            ],
        },
    },
    {
        // O catálogo reúne demonstrações do tema e pode compor qualquer camada.
        files: [
            'resources/react/catalog/**/*.{ts,tsx}',
            'resources/react/pages/Catalog/**/*.{ts,tsx}',
        ],
        rules: {
            'no-restricted-imports': 'off',
            '@typescript-eslint/no-unused-vars': 'warn',
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-unused-expressions': 'warn',
            'react/no-unescaped-entities': 'off',
            'react/no-array-index-key': 'off',
            'jsx-a11y/anchor-is-valid': 'off',
            'prefer-const': 'warn',
            'prefer-spread': 'warn',
            'jsx-a11y/no-redundant-roles': 'warn',
        },
    },
    {
        files: ['*.js'],
        languageOptions: { globals: globals.node },
        extends: [js.configs.recommended],
    },
    prettier,
);

/**
 * Carrega uma folha de estilos de plugin uma única vez por página.
 *
 * Segue o mesmo contrato de `loadExternalScript`: chamadas simultâneas compartilham a mesma tag,
 * e uma falha anterior não prende as próximas tentativas, pois a tag marcada é recriada.
 */
export function loadExternalStylesheet(href: string): Promise<void> {
    return new Promise((resolve: () => void, reject: (reason?: unknown) => void) => {
        const existing = document.querySelector<HTMLLinkElement>(`link[href="${href}"]`);

        if (existing?.dataset.failed === 'true') {
            existing.remove();
        } else if (existing) {
            if (existing.dataset.loaded === 'true' || existing.sheet) {
                resolve();
                return;
            }

            existing.addEventListener('load', () => resolve(), { once: true });
            existing.addEventListener('error', (event: Event) => reject(event), { once: true });
            return;
        }

        const link = document.createElement('link');
        link.href = href;
        link.rel = 'stylesheet';
        link.addEventListener(
            'load',
            () => {
                link.dataset.loaded = 'true';
                resolve();
            },
            { once: true },
        );
        link.addEventListener(
            'error',
            (event: Event) => {
                link.dataset.failed = 'true';
                reject(event);
            },
            { once: true },
        );
        document.head.appendChild(link);
    });
}

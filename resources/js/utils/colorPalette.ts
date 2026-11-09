export type ColorPalette = 'lilac' | 'purple';

export function currentColorPalette(): ColorPalette {
    return document.documentElement.dataset.primaryPalette === 'purple' ? 'purple' : 'lilac';
}

/** Altera somente os tokens primários; nenhuma cor semântica é sobrescrita. */
export function applyColorPalette(palette: unknown): void {
    document.documentElement.dataset.primaryPalette = palette === 'purple' ? 'purple' : 'lilac';
}

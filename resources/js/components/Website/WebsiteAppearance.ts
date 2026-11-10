/** Restringe cores editáveis ao mesmo formato aceito pelo backend. */
export function appearanceColor(value: string, fallback: string): string {
    return /^#[0-9a-f]{6}$/i.test(value) ? value : fallback;
}

/** Mesma mistura sRGB usada por WebsiteContrast no servidor. */
export function mixAppearanceColors(first: string, second: string, weight: number): string {
    return '#' + [1, 3, 5].map((offset) => {
        const channel = Math.round(
            Number.parseInt(first.slice(offset, offset + 2), 16) * weight
            + Number.parseInt(second.slice(offset, offset + 2), 16) * (1 - weight),
        );
        return channel.toString(16).padStart(2, '0');
    }).join('');
}

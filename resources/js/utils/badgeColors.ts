export function badgeColors(color: string | null | undefined) {
    if (!color || !/^#[\da-f]{6}$/i.test(color)) return undefined;

    const channels = [1, 3, 5].map((offset) => {
        const channel = Number.parseInt(color.slice(offset, offset + 2), 16) / 255;
        return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
    });
    const luminance = 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];

    return { backgroundColor: color, color: luminance >= 0.179 ? '#000' : '#fff' };
}

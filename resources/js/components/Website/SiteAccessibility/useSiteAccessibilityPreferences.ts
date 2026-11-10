import { useEffect, useState } from 'react';
import { readAccessibilityPreferences } from '@/utils/accessibilityPreferences';

export interface SiteAccessibilityPreferences {
    scale: number;
    contrast: number;
    lineHeight: number;
    alignment: number;
    readableFont: boolean;
    grayscale: boolean;
    readingMask: boolean;
    hideImages: boolean;
    pauseMotion: boolean;
    highlightLinks: boolean;
    strongFocus: boolean;
}

export const DEFAULT_SITE_ACCESSIBILITY: SiteAccessibilityPreferences = {
    scale: 100,
    contrast: 0,
    lineHeight: 0,
    alignment: 0,
    readableFont: false,
    grayscale: false,
    readingMask: false,
    hideImages: false,
    pauseMotion: false,
    highlightLinks: false,
    strongFocus: false,
};

const STORAGE_KEY = 'gnai.site.accessibility';
export const SITE_TEXT_SCALES = [100, 125, 150, 175, 200] as const;

function readPreferences(): SiteAccessibilityPreferences {
    try {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}');
        const previous = readAccessibilityPreferences();
        // Migra os ajustes básicos usados pelo site antes de ele ter um painel próprio.
        const legacyScale = Math.max(100, Math.min(200, Math.round(previous.scale / 25) * 25));
        return {
            scale: SITE_TEXT_SCALES.includes(saved?.scale) ? saved.scale : legacyScale,
            contrast: [0, 1, 2, 3].includes(saved?.contrast)
                ? saved.contrast : Number(previous.highContrast) * 3,
            lineHeight: [0, 1, 2, 3].includes(saved?.lineHeight) ? saved.lineHeight : 0,
            alignment: [0, 1, 2, 3].includes(saved?.alignment) ? saved.alignment : 0,
            readableFont: saved?.readableFont === true,
            grayscale: saved?.grayscale === true,
            readingMask: saved?.readingMask === true,
            hideImages: saved?.hideImages === true,
            pauseMotion: saved?.pauseMotion === true,
            highlightLinks: saved?.highlightLinks === true,
            strongFocus: saved?.strongFocus === true,
        };
    } catch {
        return { ...DEFAULT_SITE_ACCESSIBILITY };
    }
}

/** Preferências do site público, independentes dos ajustes do painel administrativo. */
export function useSiteAccessibilityPreferences() {
    const [preferences, setPreferences] = useState(readPreferences);

    useEffect(() => {
        function handleStorage(event: StorageEvent): void {
            if (event.key === STORAGE_KEY || event.key === null) {
                setPreferences(readPreferences());
            }
        }
        window.addEventListener('storage', handleStorage);
        return () => window.removeEventListener('storage', handleStorage);
    }, []);

    function update(next: SiteAccessibilityPreferences): void {
        setPreferences(next);
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        } catch {
            // Os ajustes permanecem ativos mesmo quando o navegador bloqueia o armazenamento.
        }
    }

    return { preferences, update };
}

import { useState } from 'react';
import { saveHighContrast, storedHighContrast } from '@/utils/accessibilityPreferences';

/** Estado do modo de alto contraste, persistido no navegador e aplicado ao documento. */
export function useHighContrast(): { enabled: boolean; toggle: () => void } {
    const [enabled, setEnabled] = useState<boolean>(storedHighContrast);

    function toggle(): void {
        const next = !enabled;
        setEnabled(next);
        saveHighContrast(next);
    }

    return { enabled, toggle };
}

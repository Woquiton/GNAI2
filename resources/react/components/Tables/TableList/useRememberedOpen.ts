import { useState } from 'react';
import { usePathname } from '@/hooks/usePathname';

function read(key: string): boolean {
    try {
        return window.localStorage.getItem(key) === 'true';
    } catch {
        return false;
    }
}

/**
 * Estado aberto/fechado de uma região recolhível dos filtros, lembrado por tela e por navegador
 * (como o recolhimento da sidebar). Começa fechado e não abre sozinho: quem decide é o usuário.
 */
export function useRememberedOpen(scope: string): [boolean, () => void] {
    const key = `gnai.tableListFilters.${scope}:${usePathname()}`;
    const [open, setOpen] = useState(() => read(key));

    function toggle(): void {
        const next = !open;
        setOpen(next);
        try {
            window.localStorage.setItem(key, String(next));
        } catch {
            // Sem armazenamento, a região continua funcionando só nesta visita.
        }
    }

    return [open, toggle];
}

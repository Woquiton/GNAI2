import { useEffect, useRef, useState, type KeyboardEvent, type RefObject } from 'react';

interface DropdownBehavior {
    host: RefObject<HTMLDivElement | null>;
    open: boolean;
    toggle: () => void;
    close: () => void;
    onKeyDown: (event: KeyboardEvent<HTMLElement>) => void;
}

export function useDropdownMenu(): DropdownBehavior {
    const [open, setOpen] = useState<boolean>(false);
    const host = useRef<HTMLDivElement>(null);
    const openAtEnd = useRef(false);

    function links(): HTMLElement[] {
        return Array.from(host.current?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? []);
    }

    useEffect(() => {
        if (!open) {
            return;
        }
        function outside(event: MouseEvent): void {
            if (!host.current?.contains(event.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener('mousedown', outside);
        const frame = window.requestAnimationFrame(() => {
            const items = host.current?.querySelectorAll<HTMLElement>('[role="menuitem"]');
            if (items?.length) {
                items[openAtEnd.current ? items.length - 1 : 0].focus();
            }
        });
        return () => {
            window.cancelAnimationFrame(frame);
            document.removeEventListener('mousedown', outside);
        };
    }, [open]);

    function onKeyDown(event: KeyboardEvent<HTMLElement>): void {
        const active = document.activeElement as HTMLElement | null;
        if (event.key === ' ' && active?.getAttribute('role') === 'menuitem') {
            event.preventDefault();
            event.stopPropagation();
            active.click();
            setOpen(false);
            return;
        }
        if (event.key === 'Escape') {
            if (!open) {
                return;
            }
            event.preventDefault();
            event.stopPropagation();
            setOpen(false);
            host.current?.querySelector<HTMLElement>('[aria-haspopup="menu"]')?.focus();
            return;
        }
        if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp' && event.key !== ' ') {
            return;
        }
        event.preventDefault();
        event.stopPropagation();
        if (!open) {
            openAtEnd.current = event.key === 'ArrowUp';
            setOpen(true);
            return;
        }
        const items = links();
        const current = active ? items.indexOf(active) : -1;
        const next =
            event.key === 'ArrowDown'
                ? Math.min(current + 1, items.length - 1)
                : event.key === 'ArrowUp'
                  ? Math.max(current - 1, 0)
                  : Math.max(current, 0);
        items[next]?.focus();
    }

    return {
        host,
        open,
        toggle: () => {
            openAtEnd.current = false;
            setOpen((value) => !value);
        },
        close: () => setOpen(false),
        onKeyDown,
    };
}

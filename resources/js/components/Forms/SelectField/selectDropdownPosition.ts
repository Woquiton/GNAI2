import type { SelectFieldInstance } from './SelectField.types';

/** Select2 3.5 mistura offsets visuais com dimensões CSS quando o documento usa zoom. */
export function installSelectDropdownPosition(
    instance: SelectFieldInstance,
    container: HTMLElement,
): () => void {
    const original = instance.positionDropdown;
    instance.positionDropdown = () => {
        const dropdown = instance.dropdown[0];
        const scale =
            Number.parseFloat(getComputedStyle(document.documentElement).getPropertyValue('zoom')) ||
            1;
        if (!dropdown || scale === 1) {
            original.call(instance);
            return;
        }

        const rect = container.getBoundingClientRect();
        dropdown.style.width = `${rect.width / scale}px`;
        // offsetHeight não inclui o transform da animação de entrada.
        const height = dropdown.offsetHeight * scale;
        const spaceBelow = window.innerHeight - rect.bottom;
        const above = height > spaceBelow && rect.top > spaceBelow;
        container.classList.toggle('select2-drop-above', above);
        dropdown.classList.toggle('select2-drop-above', above);

        const parent = dropdown.offsetParent;
        const positionedParent =
            parent instanceof HTMLElement &&
            parent !== document.documentElement &&
            (parent !== document.body || getComputedStyle(parent).position !== 'static')
                ? parent
                : null;
        const parentRect = positionedParent?.getBoundingClientRect();
        const originX =
            parentRect && positionedParent
                ? parentRect.left + positionedParent.clientLeft * scale
                : -window.scrollX;
        const originY =
            parentRect && positionedParent
                ? parentRect.top + positionedParent.clientTop * scale
                : -window.scrollY;
        const left = Math.max(0, Math.min(rect.left, window.innerWidth - rect.width));
        const top = above ? rect.top - height : rect.bottom;
        dropdown.style.left = `${(left - originX) / scale + (positionedParent?.scrollLeft ?? 0)}px`;
        dropdown.style.top = `${(top - originY) / scale + (positionedParent?.scrollTop ?? 0)}px`;
        dropdown.style.bottom = 'auto';
    };
    return () => {
        instance.positionDropdown = original;
    };
}

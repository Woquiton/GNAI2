import { useId } from 'react';
import { useDropdownMenu } from '@/hooks/useDropdownMenu';
import Button from '@/components/UI/Button/Button';
import type { DropdownMenuProps } from './DropdownMenu.types';
import '@styles/components/Navigation/DropdownMenu/DropdownMenu.css';
export default function DropdownMenu({
    label,
    accessibleLabel,
    tone = 'primary',
    items,
    className = '',
    size,
    wavesLight,
}: DropdownMenuProps): React.JSX.Element {
    const { host, open, toggle, close, onKeyDown } = useDropdownMenu();
    const id = useId();
    return (
        <div ref={host} className={`dropdownMenu ${className}`}>
            <Button
                tone={tone}
                size={size}
                wavesLight={wavesLight}
                aria-label={accessibleLabel}
                aria-haspopup="menu"
                aria-expanded={open}
                aria-controls={id}
                title={accessibleLabel ?? (typeof label === 'string' ? label : undefined)}
                onClick={toggle}
                onKeyDown={onKeyDown}
            >
                {label}
                {label ? ' ' : null}
                <span className="dropdownMenu__caret" />
            </Button>
            <ul
                id={id}
                role="menu"
                className="dropdownMenu__items"
                hidden={!open}
                onKeyDown={onKeyDown}
            >
                {items.map((item, index) => (
                    <li role="none" key={index}>
                        {item.dividerBefore && (
                            <div className="dropdownMenu__divider" role="separator" />
                        )}
                        {item.onSelect && !item.href ? (
                            <button
                                type="button"
                                role="menuitem"
                                onClick={() => {
                                    item.onSelect?.();
                                    close();
                                }}
                            >
                                {item.iconClass ? (
                                    <i
                                        className={`${item.iconClass} dropdownMenu__itemIcon`}
                                        style={{ color: item.iconColor }}
                                        aria-hidden="true"
                                    />
                                ) : null}
                                {item.label}
                            </button>
                        ) : (
                            <a
                                role="menuitem"
                                href={item.href ?? '#fakelink'}
                                onClick={() => {
                                    item.onSelect?.();
                                    close();
                                }}
                            >
                                {item.iconClass ? (
                                    <i
                                        className={`${item.iconClass} dropdownMenu__itemIcon`}
                                        style={{ color: item.iconColor }}
                                        aria-hidden="true"
                                    />
                                ) : null}
                                {item.label}
                            </a>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}

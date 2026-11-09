import { Link } from '@inertiajs/react';
import { forwardRef, useId, type KeyboardEvent } from 'react';
import type { ProfileLink } from './TopBarPrimary.data';
import { joinClassNames } from '@/utils/joinClassNames';

interface TopBarProfileDropdownProps {
    isOpen: boolean;
    links?: ProfileLink[];
    user?: { name: string; photo_url: string };
    onToggle: (event: React.MouseEvent<HTMLButtonElement>) => void;
    onClose: () => void;
    preventNavigation: (event: React.MouseEvent<HTMLAnchorElement>) => void;
}

const TopBarProfileDropdown = forwardRef<HTMLLIElement, TopBarProfileDropdownProps>(
    function TopBarProfileDropdown(
        {
            isOpen,
            onToggle,
            onClose,
            preventNavigation,
            links = [],
            user,
        }: TopBarProfileDropdownProps,
        ref,
    ): React.JSX.Element {
        const menuId = useId();

        function handleKeyDown(event: KeyboardEvent<HTMLLIElement>): void {
            const host = event.currentTarget;
            const trigger = host.querySelector<HTMLButtonElement>('[aria-haspopup="menu"]');
            if (event.key === 'Escape') {
                event.preventDefault();
                event.stopPropagation();
                onClose();
                trigger?.focus();
                return;
            }
            if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
            event.preventDefault();
            if (!isOpen) trigger?.click();
            const key = event.key;
            requestAnimationFrame(() => {
                const items = Array.from(host.querySelectorAll<HTMLElement>('[role="menuitem"]'));
                const current = items.indexOf(document.activeElement as HTMLElement);
                let next = current + (key === 'ArrowUp' ? -1 : 1);
                if (key === 'Home' || current < 0) next = 0;
                if (key === 'End' || (current < 0 && key === 'ArrowUp')) next = items.length - 1;
                items[(next + items.length) % items.length]?.focus();
            });
        }

        function renderLink(link: ProfileLink): React.JSX.Element {
            const content = (
                <>
                    <i
                        className={`${link.iconClass} topbarDropdown__profileIcon m-r-5`}
                        aria-hidden="true"
                    />
                    {link.label}
                </>
            );

            if (link.onSelect) {
                return (
                    <button
                        type="button"
                        role="menuitem"
                        className="topbarDropdown__profileLink"
                        onClick={(event) => {
                            const host = event.currentTarget.closest('.topbar__navItem');
                            host?.querySelector<HTMLButtonElement>('[aria-haspopup="menu"]')?.focus();
                            onClose();
                            link.onSelect?.();
                        }}
                    >
                        {content}
                    </button>
                );
            }

            if (link.href) {
                return (
                    <Link
                        href={link.href}
                        method={link.method ?? 'get'}
                        as={link.method === 'post' ? 'button' : 'a'}
                        role="menuitem"
                        className="topbarDropdown__profileLink"
                        onClick={onClose}
                    >
                        {content}
                    </Link>
                );
            }

            return (
                <a
                    href="/"
                    role="menuitem"
                    onClick={preventNavigation}
                    className="topbarDropdown__profileLink"
                >
                    {content}
                </a>
            );
        }

        return (
            <li
                ref={ref}
                onKeyDown={handleKeyDown}
                onBlur={(event) => {
                    if (!event.currentTarget.contains(event.relatedTarget)) onClose();
                }}
                className={joinClassNames(
                    'topbar__navItem',
                    'topbar__navItem--dropdown',
                    'dropdown',
                    isOpen && 'is-open',
                )}
            >
                <button
                    type="button"
                    className="topbar__navLink topbar__navButton topbar__profile dropdown-toggle profile waves-effect"
                    onClick={onToggle}
                    aria-label={user ? `Menu do usuário: ${user.name}` : 'Menu do usuário'}
                    aria-expanded={isOpen}
                    aria-haspopup="menu"
                    aria-controls={menuId}
                >
                    <img
                        src={user?.photo_url ?? '/images/default-user.jpg'}
                        alt={user ? `Foto de ${user.name}` : 'Usuário'}
                        className="topbar__avatar img-circle"
                    />
                </button>

                <ul
                    id={menuId}
                    className="topbarDropdown topbarDropdown--profile dropdown-menu"
                    role="menu"
                    hidden={!isOpen}
                >
                    {links.map((link: ProfileLink) => (
                        <li key={link.label} role="none">
                            {renderLink(link)}
                        </li>
                    ))}
                </ul>
            </li>
        );
    },
);

export default TopBarProfileDropdown;

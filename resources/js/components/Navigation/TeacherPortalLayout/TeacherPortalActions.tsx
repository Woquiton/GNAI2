import { usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import TeacherPortalViewAction from './TeacherPortalViewAction';
import ColorPaletteModal from '@/components/Navigation/ColorPalette/ColorPaletteModal';
import TopBarAccessibilityAction from '@/components/Navigation/TopBarPrimary/TopBarAccessibilityAction';
import TopBarProfileDropdown from '@/components/Navigation/TopBarPrimary/TopBarProfileDropdown';
import TopBarTourAction from '@/components/Navigation/TopBarPrimary/TopBarTourAction';
import type { ProfileLink } from '@/components/Navigation/TopBarPrimary/TopBarPrimary.data';
import { teacherPortalUrls } from '@/components/TeacherPortal/TeacherPortal.routes';
import { currentColorPalette, type ColorPalette } from '@/utils/colorPalette';
import '@styles/components/Navigation/TopBarPrimary/TopBarPrimary.css';

interface TeacherPortalActionsProps {
    user: { name: string; photo_url: string } | null;
    canLock: boolean;
    impersonating: boolean;
    viewMode: 'centered' | 'full';
}

export default function TeacherPortalActions({
    user,
    canLock,
    impersonating,
    viewMode,
}: TeacherPortalActionsProps): React.JSX.Element {
    const { url } = usePage();
    const [profileOpen, setProfileOpen] = useState(false);
    const [paletteToEdit, setPaletteToEdit] = useState<ColorPalette | null>(null);
    const profileRef = useRef<HTMLLIElement>(null);

    useEffect(() => {
        function closeOutside(event: MouseEvent): void {
            if (!profileRef.current?.contains(event.target as Node)) setProfileOpen(false);
        }
        document.addEventListener('mousedown', closeOutside);
        return () => document.removeEventListener('mousedown', closeOutside);
    }, []);

    useEffect(() => {
        setProfileOpen(false);
    }, [url]);

    const links: ProfileLink[] = [
        ...(canLock
            ? [
                  {
                      label: 'Bloquear tela',
                      iconClass: 'ti-lock',
                      href: '/autenticacao/sessao/bloquear',
                      method: 'post' as const,
                  },
              ]
            : []),
        { label: 'Perfil', iconClass: 'ti-user', href: teacherPortalUrls.profile },
        {
            label: 'Paleta de cor',
            iconClass: 'ti-palette',
            onSelect: () => setPaletteToEdit(currentColorPalette()),
        },
        { label: 'Central de Ajuda', iconClass: 'fa fa-question-circle', href: '/ajuda' },
        { label: 'Acessibilidade', iconClass: 'md md-accessibility', href: '/acessibilidade' },
        ...(impersonating
            ? [
                  {
                      label: 'Voltar para a minha conta',
                      iconClass: 'ti-back-left',
                      href: '/autenticacao/acessar-como/encerrar',
                      method: 'post' as const,
                  },
              ]
            : []),
        { label: 'Sair', iconClass: 'ti-power-off', href: '/autenticacao/sair', method: 'post' },
    ];

    return (
        <>
            <nav aria-label="Ações do professor">
                <ul className="topbar__navList">
                    <TeacherPortalViewAction mode={viewMode} />
                    <TopBarTourAction />
                    <TopBarAccessibilityAction />
                    <TopBarProfileDropdown
                        ref={profileRef}
                        user={user ?? undefined}
                        links={links}
                        isOpen={profileOpen}
                        onToggle={() => setProfileOpen((open) => !open)}
                        onClose={() => setProfileOpen(false)}
                        preventNavigation={(event) => event.preventDefault()}
                    />
                </ul>
            </nav>
            {paletteToEdit ? (
                <ColorPaletteModal
                    palette={paletteToEdit}
                    onClose={() => setPaletteToEdit(null)}
                />
            ) : null}
        </>
    );
}

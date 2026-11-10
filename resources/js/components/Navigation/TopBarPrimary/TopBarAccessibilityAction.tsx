import { useState } from 'react';
import AccessibilityPreferencesDialog from '@/components/UI/AccessibilityPreferencesDialog/AccessibilityPreferencesDialog';

export default function TopBarAccessibilityAction(): React.JSX.Element {
    const [open, setOpen] = useState(false);

    return (
        <li className="topbar__navItem">
            <button
                type="button"
                className="topbar__navLink topbar__navButton"
                aria-label="Acessibilidade: contraste e tamanho do texto"
                title="Acessibilidade: contraste e tamanho do texto"
                aria-haspopup="dialog"
                aria-expanded={open}
                onClick={() => setOpen(true)}
            >
                <i className="md md-accessibility" aria-hidden="true" />
            </button>
            <AccessibilityPreferencesDialog open={open} onClose={() => setOpen(false)} />
        </li>
    );
}

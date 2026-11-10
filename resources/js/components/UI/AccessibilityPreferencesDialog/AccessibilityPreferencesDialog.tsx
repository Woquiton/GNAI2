import Modal from '@/components/UI/Modal/Modal';
import Button from '@/components/UI/Button/Button';
import { useAccessibilityPreferences } from '@/hooks/useAccessibilityPreferences';
import {
    MIN_ACCESSIBILITY_SCALE,
    MAX_ACCESSIBILITY_SCALE,
} from '@/utils/accessibilityPreferences';
import '@styles/components/UI/AccessibilityPreferencesDialog/AccessibilityPreferencesDialog.css';

export default function AccessibilityPreferencesDialog({
    open,
    onClose,
}: {
    open: boolean;
    onClose: () => void;
}): React.JSX.Element {
    const { preferences, update } = useAccessibilityPreferences();

    return (
        <Modal open={open} title="Acessibilidade" onClose={onClose}>
            <div className="accessibilityControls">
                <Button
                    tone="list-action"
                    title="Alternar alto contraste"
                    label="Alto contraste"
                    leftIconClass="fa fa-adjust"
                    aria-pressed={preferences.highContrast}
                    onClick={() => update({ ...preferences, highContrast: !preferences.highContrast })}
                />
                <h2>Tamanho do texto e da interface</h2>
                <p>De 90% a 150%. Os controles acompanham o texto.</p>
                <div className="accessibilityControls__actions">
                    <Button
                        tone="list-action"
                        label="A−"
                        title="Diminuir tamanho"
                        aria-label="Diminuir tamanho"
                        disabled={preferences.scale <= MIN_ACCESSIBILITY_SCALE}
                        onClick={() => update({ ...preferences, scale: preferences.scale - 10 })}
                    />
                    <span role="status" aria-live="polite">{preferences.scale}%</span>
                    <Button
                        tone="list-action"
                        label="A+"
                        title="Aumentar tamanho"
                        aria-label="Aumentar tamanho"
                        disabled={preferences.scale >= MAX_ACCESSIBILITY_SCALE}
                        onClick={() => update({ ...preferences, scale: preferences.scale + 10 })}
                    />
                    <Button
                        tone="list-action"
                        label="Restaurar padrão"
                        title="Restaurar cores e tamanho padrão"
                        onClick={() => update({ highContrast: false, scale: 100 })}
                    />
                </div>
            </div>
        </Modal>
    );
}

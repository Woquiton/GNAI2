import { createRoot } from 'react-dom/client';
import AboutAccessibility from '@/components/About/AboutAccessibility';
import {
    applyAccessibilityPreferences,
    installFocusModality,
    readAccessibilityPreferences,
} from '@/utils/accessibilityPreferences';
import '@styles/tokens.css';
import '@styles/accessibility.css';
import '@styles/icons.css';

applyAccessibilityPreferences(readAccessibilityPreferences());
installFocusModality();

const root = document.getElementById('about-accessibility');
if (root) createRoot(root).render(<AboutAccessibility />);

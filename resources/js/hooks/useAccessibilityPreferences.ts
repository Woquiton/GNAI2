import { useEffect, useState } from 'react';
import {
    readAccessibilityPreferences,
    saveAccessibilityPreferences,
    subscribeAccessibilityPreferences,
    type AccessibilityPreferences,
} from '@/utils/accessibilityPreferences';

export function useAccessibilityPreferences() {
    const [preferences, setPreferences] = useState(readAccessibilityPreferences);

    useEffect(() => subscribeAccessibilityPreferences(setPreferences), []);

    function update(next: AccessibilityPreferences): void {
        setPreferences(next);
        saveAccessibilityPreferences(next);
    }

    return { preferences, update };
}

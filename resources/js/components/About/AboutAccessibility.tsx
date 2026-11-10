import { useLayoutEffect, useRef } from 'react';
import SiteAccessibility from '@/components/Website/SiteAccessibility/SiteAccessibility';
import { useSiteAccessibilityPreferences } from '@/components/Website/SiteAccessibility/useSiteAccessibilityPreferences';
import { useSiteTextPresentation } from '@/components/Website/SiteAccessibility/useSiteTextPresentation';
import {
    applyAccessibilityPreferences,
    readAccessibilityPreferences,
} from '@/utils/accessibilityPreferences';

export default function AboutAccessibility(): React.JSX.Element {
    const reading = useSiteAccessibilityPreferences();
    const content = useRef(document.getElementById('about-content') as HTMLDivElement | null);
    const preferences = reading.preferences;

    useLayoutEffect(() => {
        applyAccessibilityPreferences({ highContrast: false, scale: 100 });
        return () => applyAccessibilityPreferences(readAccessibilityPreferences());
    }, []);

    useLayoutEffect(() => {
        const root = content.current;
        if (!root) return;
        root.dataset.siteContrast = String(preferences.contrast);
        root.dataset.siteTextScale = String(preferences.scale);
        root.dataset.siteReadableFont = String(preferences.readableFont);
        root.dataset.siteLineHeight = String(preferences.lineHeight);
        root.dataset.siteAlignment = String(preferences.alignment);
        root.dataset.siteGrayscale = String(preferences.grayscale);
        root.dataset.siteHideImages = String(preferences.hideImages);
        root.dataset.sitePauseMotion = String(preferences.pauseMotion);
        root.dataset.siteHighlightLinks = String(preferences.highlightLinks);
        root.dataset.siteStrongFocus = String(preferences.strongFocus);
        root.style.setProperty(
            '--site-reading-align',
            ['start', 'left', 'center', 'right'][preferences.alignment],
        );
    }, [preferences]);

    useSiteTextPresentation(
        content,
        preferences.scale,
        preferences.lineHeight,
        true,
        preferences.readableFont,
    );

    return <SiteAccessibility preferences={preferences} onChange={reading.update} />;
}

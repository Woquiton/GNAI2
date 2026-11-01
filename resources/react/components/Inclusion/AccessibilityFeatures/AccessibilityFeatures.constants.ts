import { booleanOptions } from '@/components/Forms/FormFields/fieldOptions';
import type { AccessibilityFeatureFilters } from './AccessibilityFeatures.types';

export const emptyAccessibilityFeatureFilters: AccessibilityFeatureFilters = {
    name: '',
    is_active: '',
};

export const accessibilityFeatureStatusOptions = booleanOptions('Ativo', 'Inativo');

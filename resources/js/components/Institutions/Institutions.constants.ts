import { booleanOptions } from '@/components/Forms/FormFields/fieldOptions';
import type { InstitutionFilters } from './Institutions.types';

export const emptyInstitutionFilters: InstitutionFilters = {
    short_name: '',
    district: '',
    has_barriers: '',

    created_from: '',
    created_to: '',
    name: '',
    location: '',
    is_active: '',
};

export const institutionStatusOptions = booleanOptions('Ativo', 'Inativo');

/** Zoom padrão de uma nova sede e do mapa quando o valor digitado não é numérico. */
export const DEFAULT_INSTITUTION_ZOOM = 16;

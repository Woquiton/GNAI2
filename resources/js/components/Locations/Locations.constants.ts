import { booleanOptions } from '@/components/Forms/FormFields/fieldOptions';
import type { LocationFilters } from './Locations.types';

export const emptyLocationFilters: LocationFilters = {
    type: '',
    has_barriers: '',

    created_from: '',
    created_to: '',
    name: '',
    institution_name: '',
    is_active: '',
};

export const locationStatusOptions = booleanOptions('Ativo', 'Inativo');

/** Zoom do mapa quando a instituição não informa `default_zoom`. */
export const DEFAULT_LOCATION_ZOOM = 16;

import type { InertiaFormProps } from '@inertiajs/react';

/** Payload enviado a `ItemController@store/update` (ver `Application/Data/Items`). */
export type ItemFormData = {
    item_type: string;
    name: string;
    is_digital: boolean;
    asset_code: string;
    notes: string;
    accessibility_features: number[];
    conservation_state: string;
    quantity: string;
    is_loanable: boolean;
    status: string;
    is_active: boolean;
    deficiencies: number[];
    inspection: {
        type: string;
        date: string;
        description: string;
        evidences: File[];
    };
};

export type ItemFormMode = 'create' | 'edit';

/** Estado compartilhado pelas seções do formulário. */
export interface ItemFormSectionProps {
    form: InertiaFormProps<ItemFormData>;
    errors: Record<string, string | undefined>;
    disabled: boolean;
}

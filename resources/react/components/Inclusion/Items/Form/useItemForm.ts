import { useForm } from '@inertiajs/react';
import { useState } from 'react';
import { useFormSubmission } from '@/components/Forms/FormLayout/useFormSubmission';
import { itemUrls } from '../Items.routes';
import type { ItemFormOptions, ItemRecord } from '../Items.types';
import type { ItemFormData, ItemFormMode } from './ItemForm.types';

function today(): string {
    const date = new Date();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${date.getFullYear()}-${month}-${day}`;
}

function initialData(
    mode: ItemFormMode,
    options: ItemFormOptions,
    item?: ItemRecord,
    cloneSource?: ItemRecord | null,
): ItemFormData {
    const source = item ?? cloneSource ?? undefined;
    const cloning = mode === 'create' && Boolean(cloneSource);

    return {
        item_type: source?.item_type ?? '',
        name: source?.name ?? '',
        is_digital: source?.is_digital ?? false,
        // Patrimônio e conservação pertencem ao exemplar; a clonagem não os copia.
        asset_code: item?.asset_code ?? '',
        notes: source?.notes ?? '',
        accessibility_features: source?.accessibility_features.map(({ id }) => id) ?? [],
        conservation_state: item?.conservation_state ?? '',
        quantity: String(source?.quantity ?? 1),
        is_loanable: source?.is_loanable ?? true,
        status: source?.status ?? options.defaultStatus ?? '',
        is_active: source?.is_active ?? true,
        deficiencies: source?.deficiencies.map(({ id }) => id) ?? [],
        inspection: {
            type: cloning ? '' : options.defaultInspection,
            date: cloning ? '' : today(),
            description: '',
            evidences: [],
        },
    };
}

interface UseItemFormOptions {
    mode: ItemFormMode;
    options: ItemFormOptions;
    item?: ItemRecord;
    cloneSource?: ItemRecord | null;
}

/** Estado, falhas dos editores e envio multipart do cadastro/edição de itens. */
export function useItemForm({ mode, options, item, cloneSource }: UseItemFormOptions) {
    const form = useForm<ItemFormData>(initialData(mode, options, item, cloneSource));
    const { formRef, submit } = useFormSubmission(form);
    const [editorFailed, setEditorFailed] = useState(false);
    const errors = form.errors as Record<string, string | undefined>;

    /** Bloqueia o envio quando um editor rico não carrega, para não perder o conteúdo. */
    function reportEditorFailure(field: 'notes' | 'inspection.description', message: string): void {
        setEditorFailed(true);
        form.setError(field, message);
    }

    function save(): void {
        submit({
            url: mode === 'edit' && item ? itemUrls.update(item.id) : itemUrls.store,
            method: mode === 'edit' ? 'put' : 'post',
            files: true,
            failureText: 'Não foi possível concluir a operação. Tente novamente.',
            blocked: !options.can.submit || editorFailed,
        });
    }

    return { form, errors, formRef, editorFailed, reportEditorFailure, save };
}

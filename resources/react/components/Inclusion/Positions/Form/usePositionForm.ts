import { useForm } from '@inertiajs/react';
import { useEditorFailure } from '@/components/Forms/FormLayout/useEditorFailure';
import { useFormSubmission } from '@/components/Forms/FormLayout/useFormSubmission';
import { positionUrls } from '../Positions.routes';
import type { PositionRecord } from '../Positions.types';
import type { PositionFormData } from './PositionForm.types';

/** Primeiro erro das permissões: o Laravel pode apontar o array ou um item (`permissions.0`). */
function permissionsError(errors: Record<string, string | undefined>): string | undefined {
    return (
        errors.permissions ??
        Object.entries(errors).find(([key]) => key.startsWith('permissions.'))?.[1]
    );
}

/** Estado, seleção de permissões e envio do cadastro/edição de cargos. */
export function usePositionForm(position?: PositionRecord) {
    const form = useForm<PositionFormData>({
        name: position?.name ?? '',
        description: position?.description ?? '',
        is_active: position?.is_active ?? true,
        permissions: position?.permissions?.map((permission) => permission.id) ?? [],
    });
    const { formRef, submit } = useFormSubmission(form);
    const { editorFailed, reportEditorFailure } = useEditorFailure(form);
    const errors = form.errors as Record<string, string | undefined>;

    function togglePermissions(ids: number[], checked: boolean): void {
        form.setData((current) => ({
            ...current,
            permissions: checked
                ? Array.from(new Set([...current.permissions, ...ids]))
                : current.permissions.filter((id) => !ids.includes(id)),
        }));
    }

    function save(): void {
        submit({
            url: position ? positionUrls.update(position.id) : positionUrls.store,
            method: position ? 'put' : 'post',
            failureText: position
                ? 'Não foi possível salvar o cargo. Tente novamente.'
                : 'Não foi possível cadastrar o cargo. Tente novamente.',
            blocked: editorFailed,
        });
    }

    return {
        form,
        errors,
        permissionsError: permissionsError(errors),
        formRef,
        editorFailed,
        reportEditorFailure,
        togglePermissions,
        save,
    };
}

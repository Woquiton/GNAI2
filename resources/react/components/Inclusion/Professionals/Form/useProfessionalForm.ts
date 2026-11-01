import { useForm } from '@inertiajs/react';
import { useState } from 'react';
import { useEditorFailure } from '@/components/Forms/FormLayout/useEditorFailure';
import { useFormSubmission } from '@/components/Forms/FormLayout/useFormSubmission';
import { cpfMask, phoneMask } from '@/utils/masks';
import { professionalUrls } from '../Professionals.routes';
import type { ProfessionalFormOptions, ProfessionalRecord } from '../Professionals.types';
import type { ProfessionalFormData, ProfessionalFormMode } from './ProfessionalForm.types';

function initialData(
    options: ProfessionalFormOptions,
    professional?: ProfessionalRecord,
): ProfessionalFormData {
    const person = professional?.person;

    return {
        name: person?.name ?? '',
        document: cpfMask(person?.document ?? ''),
        birth_date: person?.birth_date?.slice(0, 10) ?? '',
        gender: person?.gender ?? options.defaultGender ?? '',
        email: person?.email ?? '',
        phone: phoneMask(person?.phone ?? ''),
        address: person?.address ?? '',
        position_id: professional?.position_id != null ? String(professional.position_id) : '',
        registration: professional?.registration ?? '',
        entry_date: professional?.entry_date?.slice(0, 10) ?? '',
        status: professional?.status ?? options.defaultStatus ?? '',
        is_admin: professional?.user?.is_admin === true,
        show_on_website: professional?.show_on_website === true,
        photo: null,
        remove_photo: false,
        password: '',
        password_confirmation: '',
    };
}

interface UseProfessionalFormOptions {
    mode: ProfessionalFormMode;
    options: ProfessionalFormOptions;
    professional?: ProfessionalRecord;
}

/** Estado, validação da foto e envio multipart do cadastro/edição de profissionais. */
export function useProfessionalForm({ mode, options, professional }: UseProfessionalFormOptions) {
    const editing = mode === 'edit';
    // Somente o administrador superior concede ou retira o acesso de administrador interno.
    const canManageAdmin = options.canManageAdministrators;
    const form = useForm<ProfessionalFormData>(initialData(options, professional));
    const errors = form.errors as Record<string, string | undefined>;
    const [photoValidating, setPhotoValidating] = useState(false);
    const { editorFailed, reportEditorFailure } = useEditorFailure(form);

    /**
     * Payload de `Create/UpdateProfessionalData`: status e remoção da foto só na edição, senha
     * inicial só no cadastro e `is_admin` somente para quem pode gerenciá-lo.
     */
    function payload(data: ProfessionalFormData): Record<string, unknown> {
        const {
            status,
            remove_photo: removePhoto,
            is_admin: isAdmin,
            password,
            password_confirmation: passwordConfirmation,
            ...common
        } = data;
        const admin = canManageAdmin ? { is_admin: isAdmin } : {};

        return editing
            ? { ...common, ...admin, status, remove_photo: removePhoto }
            : { ...common, ...admin, password, password_confirmation: passwordConfirmation };
    }

    const { formRef, submit } = useFormSubmission(form);

    function save(): void {
        submit({
            url: professional ? professionalUrls.update(professional.id) : professionalUrls.store,
            method: editing ? 'put' : 'post',
            files: true,
            transform: (data) => payload(data as ProfessionalFormData),
            failureText: editing
                ? 'Não foi possível salvar o profissional. Tente novamente.'
                : 'Não foi possível cadastrar o profissional. Tente novamente.',
            blocked: photoValidating || editorFailed,
            options: {
                // A senha nunca permanece no formulário depois de uma tentativa de envio.
                onFinish: () =>
                    form.setData((data) => ({ ...data, password: '', password_confirmation: '' })),
            },
        });
    }

    return {
        form,
        errors,
        formRef,
        canManageAdmin,
        photoValidating,
        setPhotoValidating,
        editorFailed,
        reportEditorFailure,
        save,
    };
}

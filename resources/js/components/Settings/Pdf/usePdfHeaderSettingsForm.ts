import { useForm } from '@inertiajs/react';
import { useFormSubmission } from '@/components/Forms/FormLayout/useFormSubmission';
import { notify } from '@/components/UI/NotificationToast/notify';
import { settingsUrls } from '../Settings.routes';
import type { PdfHeaderSettingsProps } from '../Settings.types';

export interface PdfHeaderFormData {
    institution_name: string;
    issuing_unit: string;
    details: string;
    logo: File | null;
    remove_logo: boolean;
    logo_shape: string;
}

export function usePdfHeaderSettingsForm({ pdfHeader, canUpdate }: PdfHeaderSettingsProps) {
    const form = useForm<PdfHeaderFormData>({
        institution_name: pdfHeader.institution_name,
        issuing_unit: pdfHeader.issuing_unit ?? '',
        details: pdfHeader.details ?? '',
        logo: null,
        remove_logo: false,
        logo_shape: pdfHeader.logo_shape,
    });
    const { formRef, submit } = useFormSubmission(form);
    const errors = form.errors as Record<string, string | undefined>;
    const disabled = !canUpdate || form.processing;

    function save(): void {
        submit({
            url: settingsUrls.pdf,
            method: 'put',
            files: true,
            blocked: !canUpdate,
            failureText: 'Não foi possível salvar o cabeçalho dos PDFs. Tente novamente.',
            options: {
                onSuccess: () => {
                    form.setData((current) => ({ ...current, logo: null, remove_logo: false }));
                },
            },
        });
    }

    function imageError(message: string): void {
        notify({ tone: 'warning', title: 'Imagem não aceita', text: message });
    }

    return { form, formRef, errors, disabled, save, imageError };
}

import { useForm } from '@inertiajs/react';
import { useState } from 'react';
import { useFormSubmission } from '@/components/Forms/FormLayout/useFormSubmission';
import { emailUrls } from './Emails.routes';

export function useMailboxActions(onSuccess?: () => void) {
    const form = useForm({ ids: [] as string[], operation: '', label: null as string | null });
    const submission = useFormSubmission(form);
    const [trashIds, setTrashIds] = useState<string[]>([]);

    function execute(operation: string, ids: string[], label: string | null = null): void {
        submission.submit({
            url: emailUrls.organize,
            method: 'patch',
            blocked: ids.length === 0,
            failureText: 'Não foi possível atualizar a caixa de e-mail.',
            transform: () => ({ ids, operation, label }),
            options: {
                preserveState: true,
                onSuccess: (page) => {
                    const flash = page.props.flash as
                        { error?: string; warning?: string } | undefined;
                    if (flash?.error || flash?.warning) {
                        return;
                    }
                    setTrashIds([]);
                    onSuccess?.();
                },
            },
        });
    }

    function organize(operation: string, ids: string[], label: string | null = null): void {
        if (operation === 'trash') {
            setTrashIds(ids);
            return;
        }
        execute(operation, ids, label);
    }

    return {
        processing: form.processing,
        trashIds,
        organize,
        closeTrash: () => {
            if (!form.processing) {
                setTrashIds([]);
            }
        },
        confirmTrash: () => execute('trash', trashIds),
    };
}

import { useForm } from '@inertiajs/react';
import type { FieldOption } from '@/components/Forms/FormFields/FormFields';
import { useFormSubmission } from '@/components/Forms/FormLayout/useFormSubmission';
import { waitlistUrls } from '../Waitlists.routes';
import type { WaitlistCreateProps, WaitlistResource } from '../Waitlists.types';
import type { WaitlistCreateFormData } from './WaitlistForm.types';

/** Beneficiários chegam como mapa `id => nome` ou como lista de registros. */
function beneficiaryOptions(
    value: Record<string, string> | ReadonlyArray<{ id: number; name: string }>,
): FieldOption[] {
    if (Array.isArray(value)) {
        return value.map((option) => ({ value: String(option.id), label: option.name }));
    }

    return Object.entries(value).map(([id, label]) => ({ value: id, label }));
}

function resourceLabel(item: WaitlistResource): string {
    const label = item.name || item.title || item.description || 'Item sem identificação';

    return `${label} (${item.asset_code || 'S/N'})`;
}

const initialData: WaitlistCreateFormData = {
    item_type: '',
    waitlistable_id: '',
    student_id: '',
    professional_id: '',
    observation: '',
};

/** Estado, itens do tipo escolhido, beneficiário único e envio do cadastro na fila de espera. */
export function useWaitlistCreateForm({
    students,
    professionals,
    items = [],
    can,
}: Pick<WaitlistCreateProps, 'students' | 'professionals' | 'items' | 'can'>) {
    const form = useForm<WaitlistCreateFormData>(initialData);
    const { formRef, submit } = useFormSubmission(form);
    const errors = form.errors as Record<string, string | undefined>;
    const resourceOptions = items
        .filter((item) => item.item_type === form.data.item_type)
        .map((item) => ({ value: String(item.id), label: resourceLabel(item) }));

    /** Trocar o tipo descarta o item escolhido, que pertence ao tipo anterior. */
    function changeItemType(itemType: string): void {
        form.setData((data) => ({ ...data, item_type: itemType, waitlistable_id: '' }));
    }

    /** Aluno e profissional são exclusivos: escolher um limpa o outro. */
    function changeStudent(value: string): void {
        form.setData((data) => ({
            ...data,
            student_id: value,
            professional_id: value ? '' : data.professional_id,
        }));
    }

    function changeProfessional(value: string): void {
        form.setData((data) => ({
            ...data,
            professional_id: value,
            student_id: value ? '' : data.student_id,
        }));
    }

    function save(): void {
        submit({
            url: waitlistUrls.store,
            failureText: 'Não foi possível concluir a operação. Tente novamente.',
            blocked: !can.submit,
        });
    }

    return {
        form,
        errors,
        formRef,
        studentOptions: beneficiaryOptions(students),
        professionalOptions: beneficiaryOptions(professionals),
        resourceOptions,
        changeItemType,
        changeStudent,
        changeProfessional,
        save,
    };
}

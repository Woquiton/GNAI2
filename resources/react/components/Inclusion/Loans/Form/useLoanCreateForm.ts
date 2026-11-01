import { useForm } from '@inertiajs/react';
import { useState } from 'react';
import { useEditorFailure } from '@/components/Forms/FormLayout/useEditorFailure';
import { useFormSubmission } from '@/components/Forms/FormLayout/useFormSubmission';
import { loanUrls } from '../Loans.routes';
import type { LoanCreateOptions, LoanFormOptions, LoanableItem } from '../Loans.types';
import type { LoanCreateFormData } from './LoanForm.types';

function localDateTime(): string {
    const date = new Date();
    const pad = (value: number) => String(value).padStart(2, '0');
    const day = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

    return `${day}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function itemLabel(item: LoanableItem): string {
    if (item.is_digital) {
        return `${item.name} (Digital)`;
    }

    return `${item.name}, Patrimônio: ${item.asset_code}, ${item.quantity_available ?? 0} disponível(is)`;
}

function initialData(options: LoanCreateOptions): LoanCreateFormData {
    return {
        item_type: options.selectedItemType ?? '',
        loanable_id: options.selectedItemId ? String(options.selectedItemId) : '',
        student_id: options.selectedStudentId ? String(options.selectedStudentId) : '',
        professional_id: options.selectedProfessionalId
            ? String(options.selectedProfessionalId)
            : '',
        loan_date: localDateTime(),
        due_date: '',
        observation: '',
    };
}

/** Estado, itens do tipo escolhido, data/horário de saída e envio do cadastro de empréstimos. */
export function useLoanCreateForm(options: LoanFormOptions & LoanCreateOptions) {
    const form = useForm<LoanCreateFormData>(initialData(options));
    const { formRef, submit } = useFormSubmission(form);
    const { editorFailed, reportEditorFailure } = useEditorFailure(form);
    // O horário inicial alimenta o relógio na montagem; depois ele é mantido à parte da data.
    const [initialTime] = useState(() => form.data.loan_date.split('T')[1] ?? '');
    const [loanTime, setLoanTime] = useState(initialTime);
    const errors = form.errors as Record<string, string | undefined>;
    const loanDay = form.data.loan_date.split('T')[0] ?? '';
    const itemOptions = options.items
        .filter((item) => item.item_type === form.data.item_type)
        .map((item) => ({ value: String(item.id), label: itemLabel(item) }));

    /** Trocar o tipo descarta o item escolhido, que pertence ao tipo anterior. */
    function changeItemType(itemType: string): void {
        form.setData((data) => ({ ...data, item_type: itemType, loanable_id: '' }));
        form.clearErrors('item_type', 'loanable_id');
    }

    function changeItem(itemId: string): void {
        form.setData('loanable_id', itemId);
        form.clearErrors('loanable_id');
    }

    function changeLoanDay(day: string): void {
        form.setData('loan_date', day ? `${day}T${loanTime}` : '');
    }

    function changeLoanTime(time: string): void {
        setLoanTime(time);
        form.setData('loan_date', loanDay ? `${loanDay}T${time}` : '');
    }

    function save(): void {
        submit({
            url: loanUrls.store,
            failureText: 'Não foi possível concluir a operação. Tente novamente.',
            blocked: !options.can.submit || editorFailed,
        });
    }

    return {
        form,
        errors,
        formRef,
        itemOptions,
        initialTime,
        loanDay,
        changeItemType,
        changeItem,
        changeLoanDay,
        changeLoanTime,
        editorFailed,
        reportEditorFailure,
        save,
    };
}

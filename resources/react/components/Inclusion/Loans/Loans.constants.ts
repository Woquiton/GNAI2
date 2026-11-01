import type { LoanFilters } from './Loans.types';

export const emptyLoanFilters: LoanFilters = {
    item: '',
    student: '',
    professional: '',
    status: '',
};

/** Filtro de status da listagem (`ListLoansData`). */
export const loanStatusOptions = [
    { value: 'active', label: 'Ativo (Com o Beneficiário)' },
    { value: 'returned', label: 'Devolvido (No prazo)' },
    { value: 'late', label: 'Devolvido (Com atraso)' },
    { value: 'damaged', label: 'Devolvido (Com avaria)' },
];

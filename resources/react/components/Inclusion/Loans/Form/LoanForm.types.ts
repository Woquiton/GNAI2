/** Payload enviado a `LoanController@store` (ver `Application/Data/Loans/CreateLoanData`). */
export type LoanCreateFormData = {
    item_type: string;
    loanable_id: string;
    student_id: string;
    professional_id: string;
    /** Data e horário de saída (`AAAA-MM-DDTHH:mm`). */
    loan_date: string;
    due_date: string;
    observation: string;
};

/** Payload enviado a `LoanController@update`: somente as observações podem ser alteradas. */
export type LoanEditFormData = {
    observation: string;
};

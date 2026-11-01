import type { TableListPage } from '@/components/Tables/TableList/TableList';

export type LoanOptionMap = Record<string, string>;

/** Item disponível para empréstimo (`LoanFormQuery::loanableItems`). */
export type LoanableItem = {
    id: number;
    item_type: string;
    name: string;
    asset_code: string;
    is_digital: boolean;
    quantity_available: number | null;
};

/** Empréstimo apresentado por `LoanPresenter::loan`. */
export type LoanRecord = {
    id: number;
    loanable_id: number;
    item_type: string;
    item_type_label: string;
    loanable_icon: string;
    loanable: { name: string; asset_code: string | null };
    student: { id: number; name: string; registration: string } | null;
    professional: { id: number; name: string; registration: string } | null;
    user: { name: string };
    loan_date: string | null;
    loan_date_label: string;
    due_date: string | null;
    due_date_label: string;
    return_date_label: string | null;
    status: string | null;
    status_label: string;
    status_color: string;
    observation: string | null;
    is_active: boolean;
    is_returned: boolean;
    is_overdue: boolean;
};

export interface LoanPaginator extends TableListPage {
    data: LoanRecord[];
}

export type LoanFilters = {
    item: string;
    student: string;
    professional: string;
    status: string;
};

export interface LoanListPermissions {
    create: boolean;
    show: boolean;
    destroy: boolean;
}

export interface LoanIndexProps {
    loans: LoanPaginator;
    filters: Partial<LoanFilters>;
    can: LoanListPermissions;
}

/** Opções compartilhadas pelo cadastro e pela edição (`LoanFormQuery`). */
export type LoanFormOptions = {
    students: LoanOptionMap;
    professionals: LoanOptionMap;
    authUser: { id: number; name: string };
    can: { submit: boolean };
};

/** Dados exclusivos do cadastro, inclusive as pré-seleções vindas da query string. */
export type LoanCreateOptions = {
    itemTypes: LoanOptionMap;
    items: LoanableItem[];
    selectedStudentId: number | null;
    selectedProfessionalId: number | null;
    selectedItemId: number | null;
    selectedItemType: string | null;
};

export type LoanCreateProps = LoanFormOptions & LoanCreateOptions;

export type LoanEditProps = LoanFormOptions & {
    display: LoanRecord;
};

export interface LoanDetailsPermissions {
    edit: boolean;
    return: boolean;
    destroy: boolean;
    pdf: boolean;
    /** Liga o recurso e o aluno às respectivas visualizações. */
    viewItem: boolean;
    viewStudent: boolean;
}

export interface LoanShowProps {
    loan: LoanRecord;
    can: LoanDetailsPermissions;
}

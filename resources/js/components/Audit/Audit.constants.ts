import type { AuditFilters } from './Audit.types';

export const emptyAuditFilters: AuditFilters = {
    date_from: '',
    date_to: '',
    actor: '',
    type: '',
    event: '',
    search: '',
};

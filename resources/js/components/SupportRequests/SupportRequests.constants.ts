import type { TableLabelTone } from '@/components/UI/TableLabel/TableLabel';
import type { SupportRequestFilters } from './SupportRequests.types';

export const emptySupportRequestFilters: SupportRequestFilters = {
    created_from: '',
    created_to: '',
    search: '',
    status: '',
    student_id: '',
};
export const supportRequestStatusTones: Record<string, TableLabelTone> = {
    received: 'inverse',
    in_review: 'warning',
    referred: 'primary',
    closed: 'success',
};

export type CrmKind = 'dashboard' | 'contact' | 'opportunities' | 'leads' | 'customers';
export interface CrmPageDefinition {
    key: string;
    kind: CrmKind;
    title: string;
    breadcrumb?: string;
}
export type { BusinessRecord } from '@/catalog/types/BusinessRecord.types';
export type { PersonRecord } from '@/catalog/components/Tables/PeopleTable/PeopleTable.types';

export type ReportOptions = Record<string, string>;
export type Operator = 'eq' | 'neq' | 'contains' | 'gt' | 'gte' | 'lt' | 'lte';
export interface ReportSource {
    key: string;
    label: string;
}
export interface FilterDefinition {
    key: string;
    label: string;
    type: 'text' | 'date' | 'boolean' | 'select';
    operators: Operator[];
    options: ReportOptions;
}
export interface ReportRelation {
    name: string;
    label: string;
    columns: ReportOptions;
    pivot?: { columns: ReportOptions } | null;
    filter_definitions: FilterDefinition[];
}
export interface ReportMetadata {
    key: string;
    label: string;
    columns: ReportOptions;
    filters: FilterDefinition[];
    relations: ReportRelation[];
}
export interface ReportResult {
    headers: ReportOptions;
    rows: Record<string, string | number | boolean | null>[];
    total: number;
}
export interface ReportFilter {
    id: number;
    field: string;
    operator: Operator;
    value: string;
}
export interface ReportPayload {
    source: string;
    columns: string[];
    filters: Omit<ReportFilter, 'id'>[];
    filter_related_values: boolean;
}
export interface ReportPermissions {
    sources: boolean;
    metadata: boolean;
    configureRelations: boolean;
    run: boolean;
    pdf: boolean;
}
/** Operação em andamento no construtor; bloqueia novos envios até terminar. */
export type ReportOperation = 'run' | 'pdf' | 'copy';
/** Props de `Inertia::render('Reports/Builder')`. */
export interface ReportBuilderProps {
    can: ReportPermissions;
}

export interface ReportBuilderProps {
    can: ReportPermissions;
}

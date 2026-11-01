import type { FieldOption } from '@/components/Forms/FormFields/FormFields';
import type { TableLabelTone } from '@/components/UI/TableLabel/TableLabel';
import type { PaeeListFilters } from './Paees.types';

export const emptyPaeeFilters: PaeeListFilters = {
    status: '',
    semester_id: '',
    search: '',
};

export const paeeStatusOptions: FieldOption[] = [
    { value: 'active', label: 'Ativo' },
    { value: 'under_review', label: 'Em revisão' },
    { value: 'draft', label: 'Rascunho' },
];

export const attendanceFormatOptions: FieldOption[] = [
    { value: 'individual', label: 'Individual' },
    { value: 'collective', label: 'Coletivo' },
    { value: 'mixed', label: 'Misto' },
];

export const attendanceLocationOptions: FieldOption[] = [
    { value: 'srm', label: 'Sala de Recursos Multifuncionais' },
    { value: 'common_classroom', label: 'Sala comum' },
    { value: 'accessibility_center', label: 'Núcleo de acessibilidade' },
    { value: 'other', label: 'Outro' },
];

export const objectiveTermOptions: FieldOption[] = [
    { value: 'short', label: 'Curto' },
    { value: 'medium', label: 'Médio' },
    { value: 'long', label: 'Longo' },
];

export const acquisitionTypeOptions: FieldOption[] = [
    { value: 'to_produce', label: 'A produzir' },
    { value: 'to_accessibilize', label: 'A acessibilizar' },
    { value: 'to_acquire', label: 'A adquirir' },
];

export function paeeStatusTone(status: string | null): TableLabelTone {
    if (status === 'active') return 'success';
    if (status === 'under_review') return 'warning';

    return 'inverse';
}

export function paeeVersionLabel(version: number | null): string {
    return `v${version ?? 'N/A'}`;
}

/** Título curto do registro ("PAEE v2"), usado no título da visualização e no breadcrumb. */
export function paeeTitle(version: number | null): string {
    return `PAEE ${paeeVersionLabel(version)}`;
}

/** Nome acessível do PAEE nas ações e confirmações ("PAEE v2 de Maria"). */
export function paeeName(paee: {
    version: number | null;
    student?: { name: string } | null;
}): string {
    const owner = paee.student?.name;

    return `${paeeTitle(paee.version)}${owner ? ` de ${owner}` : ''}`;
}

/** Textos de falha das operações do PAEE. */
export const paeeFailureTexts = {
    list: 'Não foi possível atualizar os PAEEs. Tente novamente.',
    delete: 'Não foi possível excluir o PAEE. Tente novamente.',
    save: 'Não foi possível salvar o PAEE. Tente novamente.',
    review: 'Não foi possível registrar a revisão. Tente novamente.',
    editor: 'Não foi possível carregar o editor. Atualize a página e tente novamente.',
};

/** Valor exibido quando o campo não foi preenchido. */
export const PAEE_NOT_INFORMED = 'Não informado';

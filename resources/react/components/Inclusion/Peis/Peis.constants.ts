import type { PeiListFilters, PeiListRecord } from './Peis.types';

export const emptyPeiFilters: PeiListFilters = {
    student_id: '',
    semester_id: '',
    version: '',
    is_finished: '',
};

/** Status do filtro: o backend recebe `'0'`/`'1'` em `is_finished`. */
export const peiStatusOptions = [
    { value: '0', label: 'Em andamento' },
    { value: '1', label: 'Finalizado' },
];

export const PEI_LIST_FAILURE_TEXT = 'Não foi possível atualizar os PEIs. Tente novamente.';
export const PEI_DELETE_FAILURE_TEXT = 'Não foi possível excluir o PEI. Tente novamente.';
/** Falha das ações confirmadas da visualização (finalizar e excluir). */
export const PEI_ACTION_FAILURE_TEXT =
    'Não foi possível concluir a operação. Atualize a página e tente novamente.';
export const PEI_CREATE_FAILURE_TEXT = 'Não foi possível gerar o PEI. Tente novamente.';
export const PEI_OTHER_INFO_FAILURE_TEXT =
    'Não foi possível salvar as informações. Tente novamente.';
export const PEI_DISCIPLINE_BULK_FAILURE_TEXT =
    'Não foi possível salvar as adaptações curriculares. Tente novamente.';
export const PEI_DISCIPLINE_UPDATE_FAILURE_TEXT =
    'Não foi possível salvar a adaptação curricular. Tente novamente.';
export const PEI_DISCIPLINE_REVISION_FAILURE_TEXT =
    'Não foi possível registrar a revisão. Tente novamente.';

export const NOT_INFORMED = 'Não informado';

/** Rótulo da versão nas listagens (`V1`, `VN/A`). */
export function peiVersionLabel(pei: { version: number | null }): string {
    return `V${pei.version ?? 'N/A'}`;
}

/** Rótulo da versão na visualização (`v1`, `vNão informado`). */
export function peiRecordVersionLabel(pei: { version: number | null }): string {
    return `v${pei.version ?? NOT_INFORMED}`;
}

/** Situação de preenchimento exibida na visualização do PEI. */
export function peiProgressLabel(pei: { is_finished: boolean }): string {
    return pei.is_finished ? 'Finalizado' : 'Em preenchimento';
}

/** Nome acessível do PEI nas ações da linha e na confirmação ("PEI V2 de Fulano"). */
export function peiDisplayName(pei: PeiListRecord): string {
    const owner = pei.student?.person?.name;

    return `PEI ${peiVersionLabel(pei)}${owner ? ` de ${owner}` : ''}`;
}

/** Subtítulo da visualização: versão, semestre e situação, separados por "•". */
export function peiShowSubtitle(pei: {
    version: number | null;
    semester_label: string | null;
    is_finished: boolean;
}): string {
    return [`Versão ${pei.version ?? NOT_INFORMED}`, pei.semester_label, peiProgressLabel(pei)]
        .filter(Boolean)
        .join(' • ');
}

/** Nome da disciplina da adaptação, com o padrão das visualizações quando ausente. */
export function peiDisciplineName(peiDiscipline: { discipline_name: string | null }): string {
    return peiDiscipline.discipline_name || NOT_INFORMED;
}

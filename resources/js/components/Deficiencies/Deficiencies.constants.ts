import { booleanOptions } from '@/components/Forms/FormFields/fieldOptions';
import type { DeficiencyFilters } from './Deficiencies.types';

export const emptyDeficiencyFilters: DeficiencyFilters = {
    created_from: '',
    created_to: '',
    name: '',
    cid_code: '',
    is_active: '',
};

export const deficiencyStatusOptions = booleanOptions('Ativo', 'Inativo');

/** Subtítulo compartilhado pela listagem e pelo cadastro. */
export const deficiencyDescription =
    'Cadastro das condições, características e necessidades educacionais dos estudantes, com a finalidade de apoiar o acompanhamento, os encaminhamentos e a oferta de atendimentos adequados, como deficiência, TEA, TDAH, altas habilidades/superdotação e dificuldades de aprendizagem.';

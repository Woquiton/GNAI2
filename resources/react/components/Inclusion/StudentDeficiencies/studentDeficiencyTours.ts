import { helpUrls } from '@/components/Help/Help.routes';
import type { GuidedTourPageConfig } from '@/components/UI/GuidedTour/GuidedTour.types';

/** Valores de `data-tour` do vínculo, da edição e da visualização do perfil de atendimento do aluno. */
export const STUDENT_DEFICIENCY_TOUR_TARGETS = {
    information: 'student-deficiency-information',
    formActions: 'student-deficiency-form-actions',
    details: 'student-deficiency-details',
    detailsActions: 'student-deficiency-details-actions',
} as const;

const targets = STUDENT_DEFICIENCY_TOUR_TARGETS;
const HELP_SLUG = 'alunos-responsaveis-e-documentos';

export const studentDeficiencyCreateTour: GuidedTourPageConfig = {
    helpHref: helpUrls.show(HELP_SLUG, 'vincular-um-perfil-de-atendimento-ao-aluno'),
    steps: [
        {
            id: 'student-deficiency-information',
            target: targets.information,
            title: 'Identificação do Perfil',
            content: [
                'Escolha o Perfil de atendimento do aluno e a Severidade: Leve, Moderada ou Severa. Os campos com asterisco (*) são obrigatórios.',
                'Em Observações, você pode registrar outras informações sobre o perfil. Esse campo não é obrigatório.',
            ],
        },
        {
            id: 'student-deficiency-form-actions',
            target: targets.formActions,
            title: 'Salvar ou cancelar',
            content: [
                'Clique em Salvar para vincular o perfil ao aluno. Se faltar alguma informação, o aviso aparece embaixo do campo.',
                'Cancelar volta para o prontuário do aluno sem salvar.',
            ],
        },
    ],
};

export const studentDeficiencyEditTour: GuidedTourPageConfig = {
    helpHref: helpUrls.show(HELP_SLUG, 'editar-ou-remover-um-perfil-de-atendimento-do-aluno'),
    steps: [
        {
            id: 'student-deficiency-information',
            target: targets.information,
            title: 'Atualizar Informações',
            content: [
                'Aqui você muda a Severidade e as Observações do perfil.',
                'O Perfil aparece só para consulta e não pode ser trocado. Para usar outro perfil, exclua este vínculo e cadastre um novo.',
            ],
        },
        {
            id: 'student-deficiency-form-actions',
            target: targets.formActions,
            title: 'Salvar ou cancelar',
            content: [
                'Clique em Salvar para gravar as alterações. Se faltar alguma informação, o aviso aparece embaixo do campo.',
                'Cancelar volta para o prontuário do aluno sem salvar.',
            ],
        },
    ],
};

export const studentDeficiencyShowTour: GuidedTourPageConfig = {
    helpHref: helpUrls.show(HELP_SLUG, 'editar-ou-remover-um-perfil-de-atendimento-do-aluno'),
    steps: [
        {
            id: 'student-deficiency-details',
            target: targets.details,
            title: 'Informações do Diagnóstico',
            content:
                'Mostra o nome do perfil, a severidade, a data do registro e as observações técnicas.',
        },
        {
            id: 'student-deficiency-details-actions',
            target: targets.detailsActions,
            title: 'Voltar, editar ou excluir',
            content: [
                'Voltar leva para os perfis de atendimento no prontuário do aluno. Editar abre o formulário para mudar a severidade e as observações.',
                'Excluir remove o perfil do aluno, depois de pedir confirmação. Editar e Excluir só aparecem para quem tem permissão.',
            ],
        },
    ],
};

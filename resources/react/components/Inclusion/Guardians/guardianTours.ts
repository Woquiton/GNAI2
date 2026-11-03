import { helpUrls } from '@/components/Help/Help.routes';
import type { TableListTourConfig } from '@/components/Tables/TableList/TableList';
import type {
    GuidedTourPageConfig,
    GuidedTourStep,
} from '@/components/UI/GuidedTour/GuidedTour.types';
import type { GuardianFormMode } from './Form/GuardianForm.types';

/** Valores de `data-tour` da listagem, do cadastro, da edição e da visualização do responsável. */
export const GUARDIAN_TOUR_TARGETS = {
    photo: 'guardian-photo',
    personal: 'guardian-personal',
    contact: 'guardian-contact',
    formActions: 'guardian-form-actions',
    detailsRelationship: 'guardian-details-relationship',
    detailsPersonal: 'guardian-details-personal',
    detailsContact: 'guardian-details-contact',
    detailsActions: 'guardian-details-actions',
} as const;

const targets = GUARDIAN_TOUR_TARGETS;
const HELP_SLUG = 'alunos-responsaveis-e-documentos';

export const guardianListTour: TableListTourConfig = {
    helpHref: helpUrls.show(HELP_SLUG, 'adicionar-um-responsavel'),
    actions: [
        'Voltar leva para o prontuário do aluno, na aba Responsáveis. Cadastrar abre a tela para adicionar um responsável.',
        'O botão Cadastrar só aparece para quem tem permissão.',
    ],
    filters: [
        'Pesquise o responsável pelo nome ou pelo e-mail, ou escolha o parentesco.',
        'A lista se atualiza sozinha enquanto você digita ou escolhe uma opção.',
    ],
    table: [
        'Cada linha é um responsável deste aluno, com a foto, o nome, o CPF, o vínculo e o contato.',
        'Use o botão de olho, no fim da linha, para abrir os dados do responsável. O botão de excluir pede confirmação antes de remover.',
    ],
};

function guardianFormSteps(mode: GuardianFormMode): GuidedTourStep[] {
    const group = mode === 'create' ? 'Cadastro do responsável' : 'Edição do responsável';

    return [
        {
            id: 'guardian-photo',
            target: targets.photo,
            group,
            title: 'Foto do Responsável',
            content: [
                'Clique no círculo para escolher uma imagem, arraste uma imagem até ele ou use o botão da câmera para tirar a foto na hora.',
                mode === 'create'
                    ? 'A foto não é obrigatória. Use uma imagem JPG, PNG ou WEBP de até 2 MB.'
                    : 'Para trocar a foto, envie outra imagem. Para tirar a foto atual, use o botão de remover sobre ela.',
            ],
        },
        {
            id: 'guardian-personal',
            target: targets.personal,
            group,
            title: 'Dados Pessoais',
            content: [
                'Preencha o nome completo, o CPF, a data de nascimento e o gênero do responsável.',
                'Os campos com asterisco (*) são obrigatórios. O CPF pode ficar em branco.',
            ],
        },
        {
            id: 'guardian-contact',
            target: targets.contact,
            group,
            title: 'Contato e Vínculo',
            content: [
                'Informe o telefone com DDD e o parentesco com o aluno, como pai, mãe ou responsável legal.',
                'O e-mail e o endereço completo podem ficar em branco.',
            ],
        },
        {
            id: 'guardian-form-actions',
            target: targets.formActions,
            group,
            title: 'Salvar ou cancelar',
            content: [
                mode === 'create'
                    ? 'Clique em Salvar para vincular o responsável ao aluno. Se faltar alguma informação, o aviso aparece embaixo do campo.'
                    : 'Clique em Salvar para gravar as alterações. Se faltar alguma informação, o aviso aparece embaixo do campo.',
                'Cancelar volta para o prontuário do aluno sem salvar.',
            ],
        },
    ];
}

export const guardianCreateTour: GuidedTourPageConfig = {
    helpHref: helpUrls.show(HELP_SLUG, 'adicionar-um-responsavel'),
    steps: guardianFormSteps('create'),
};

export const guardianEditTour: GuidedTourPageConfig = {
    helpHref: helpUrls.show(HELP_SLUG, 'editar-ou-excluir-um-responsavel'),
    steps: guardianFormSteps('edit'),
};

export const guardianShowTour: GuidedTourPageConfig = {
    helpHref: helpUrls.show(HELP_SLUG, 'editar-ou-excluir-um-responsavel'),
    steps: [
        {
            id: 'guardian-details-relationship',
            target: targets.detailsRelationship,
            title: 'Vínculo Familiar',
            content:
                'Aqui ficam a foto e o nome do responsável, o parentesco com o aluno e o nome do estudante vinculado.',
        },
        {
            id: 'guardian-details-personal',
            target: targets.detailsPersonal,
            title: 'Informações Pessoais',
            content: 'Mostra o nome completo, o gênero, o CPF, a data de nascimento e a idade.',
        },
        {
            id: 'guardian-details-contact',
            target: targets.detailsContact,
            title: 'Canais de Contato',
            content:
                'Mostra o telefone, o e-mail e o endereço do responsável. Quando um dado não foi preenchido, aparece Não informado.',
        },
        {
            id: 'guardian-details-actions',
            target: targets.detailsActions,
            title: 'Voltar, editar ou excluir',
            content: [
                'Voltar leva para os responsáveis no prontuário do aluno. Editar abre o formulário para alterar os dados.',
                'Excluir remove o responsável, depois de pedir confirmação. Editar e Excluir só aparecem para quem tem permissão.',
            ],
        },
    ],
};

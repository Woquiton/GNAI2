import { helpUrls } from '@/components/Help/Help.routes';
import type {
    GuidedTourPageConfig,
    GuidedTourStep,
} from '@/components/UI/GuidedTour/GuidedTour.types';

/** Valores de `data-tour` das partes do Meu Perfil. */
export const PROFILE_TOUR_TARGETS = {
    identity: 'profile-identity',
    personal: 'profile-personal',
    password: 'profile-password',
    accountData: 'profile-account-data',
    security: 'profile-security',
    formActions: 'profile-form-actions',
} as const;

const targets = PROFILE_TOUR_TARGETS;
const HELP_SLUG = 'minha-conta';

function identityStep(roleText: string): GuidedTourStep {
    return {
        id: 'profile-identity',
        target: targets.identity,
        title: 'Foto e identificação',
        content: [
            'Clique no círculo Alterar Foto para escolher uma imagem, arraste uma imagem até ele ou use o botão da câmera. Use JPG ou PNG de até 2 MB. A foto só é gravada quando você clica em Salvar.',
            roleText,
        ],
    };
}

const formActionsStep: GuidedTourStep = {
    id: 'profile-form-actions',
    target: targets.formActions,
    title: 'Salvar ou cancelar',
    content: [
        'Clique em Salvar para gravar as alterações. Se algo precisar de ajuste, o aviso aparece embaixo do campo.',
        'Cancelar volta para o Painel sem salvar.',
    ],
};

/** Perfil de quem faz parte da equipe ou do corpo docente. */
export const profileEditTour: GuidedTourPageConfig = {
    helpHref: helpUrls.show(HELP_SLUG, 'atualizar-meus-dados-pessoais'),
    steps: [
        identityStep(
            'Embaixo da foto aparecem o seu nome, o cargo e o vínculo, como Profissional Apoio ou Corpo Docente. O cargo é definido no cadastro da equipe.',
        ),
        {
            id: 'profile-personal',
            target: targets.personal,
            title: 'Dados Pessoais',
            content: [
                'Mantenha atualizados o nome, o e-mail, o CPF, a data de nascimento, o gênero, o telefone, a matrícula e o endereço.',
                'Os campos com asterisco (*) são obrigatórios. O e-mail é o que você usa para entrar no Gnai.',
            ],
        },
        {
            id: 'profile-password',
            target: targets.password,
            title: 'Alterar Senha',
            content: [
                'Para trocar a senha, preencha Nova Senha e Confirmar Nova Senha. Ela precisa ter pelo menos 8 caracteres, com letras e números.',
                'Se deixar os dois campos em branco, a senha atual continua valendo.',
            ],
        },
        formActionsStep,
    ],
};

/** Perfil das contas administrativas sem vínculo com a equipe. */
export const profileAccountTour: GuidedTourPageConfig = {
    helpHref: helpUrls.show(HELP_SLUG, 'atualizar-os-dados-de-uma-conta-administrativa'),
    steps: [
        identityStep(
            'Embaixo da foto aparecem o seu nome e o tipo da sua conta, como Administrador.',
        ),
        {
            id: 'profile-account-data',
            target: targets.accountData,
            title: 'Dados da Conta',
            content: [
                'Aqui você altera o Nome e o E-mail de acesso, que é o e-mail usado para entrar no Gnai. Os dois têm asterisco (*) e são obrigatórios.',
                'Para trocar o e-mail, preencha também a Senha atual, logo abaixo.',
            ],
        },
        {
            id: 'profile-security',
            target: targets.security,
            title: 'Segurança',
            content: [
                'Para trocar a senha, preencha a Senha atual, a Nova senha e a confirmação. A nova senha precisa ter pelo menos 12 caracteres, com letras maiúsculas e minúsculas, números e símbolos.',
                'Deixe Nova senha em branco para manter a senha atual.',
            ],
        },
        formActionsStep,
    ],
};

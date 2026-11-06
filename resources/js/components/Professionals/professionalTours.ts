import { helpUrls } from '@/components/Help/Help.routes';
import type { TableListTourConfig } from '@/components/Tables/TableList/TableList';
import type {
    GuidedTourPageConfig,
    GuidedTourStep,
} from '@/components/UI/GuidedTour/GuidedTour.types';

/** Valores de `data-tour` das partes do cadastro, da edição e da visualização do profissional. */
export const PROFESSIONAL_TOUR_TARGETS = {
    photo: 'professional-photo',
    person: 'professional-person',
    work: 'professional-work',
    access: 'professional-access',
    formActions: 'professional-form-actions',
    identification: 'professional-identification',
    employment: 'professional-employment',
    detailsActions: 'professional-details-actions',
} as const;

const targets = PROFESSIONAL_TOUR_TARGETS;
const HELP_SLUG = 'equipe';

export const professionalListTour: TableListTourConfig = {
    helpHref: helpUrls.show(HELP_SLUG, 'encontrar-um-profissional'),
    actions: [
        'Clique em Cadastrar profissional para incluir um profissional ou um tutor de pares.',
        'Este botão só aparece para quem tem permissão para cadastrar.',
    ],
    filters: [
        'Pesquise o profissional pelo nome ou filtre pelo cargo e pelo status.',
        'A lista se atualiza sozinha enquanto você digita ou escolhe uma opção.',
    ],
    moreFilters: [
        'Aqui você filtra também pelo e-mail e pela matrícula.',
        'O número ao lado do nome mostra quantos desses filtros estão em uso.',
    ],
    table: [
        'Cada linha é um profissional ou tutor de pares, com a foto, o nome, o e-mail, o cargo e o status.',
        'Use o botão de olho, no fim da linha, para abrir o perfil do profissional. A lixeira exclui, depois de pedir confirmação.',
    ],
};

function professionalFormSteps(mode: 'create' | 'edit'): GuidedTourStep[] {
    const group = mode === 'create' ? 'Cadastro do profissional' : 'Edição do profissional';
    const steps: GuidedTourStep[] = [
        {
            id: 'professional-photo',
            target: targets.photo,
            group,
            title: 'Foto do Profissional',
            content: [
                'Clique no círculo para escolher uma imagem, arraste uma imagem até ele ou use o botão da câmera para tirar a foto na hora.',
                mode === 'create'
                    ? 'A foto não é obrigatória. Use uma imagem JPG ou PNG de até 2 MB.'
                    : 'Para trocar a foto, envie outra imagem. Para tirar a foto atual, use o botão de remover sobre ela e salve.',
            ],
        },
        {
            id: 'professional-person',
            target: targets.person,
            group,
            title: 'Dados da Pessoa',
            content: [
                'Preencha o nome, o e-mail, o CPF, a data de nascimento, o gênero, o telefone e o endereço. Os campos com asterisco (*) são obrigatórios.',
                mode === 'create'
                    ? 'O e-mail também será o login do profissional no sistema. Ele não pode ser o mesmo de outra pessoa.'
                    : 'O e-mail também é o login do profissional. Se você mudar o e-mail, o login muda junto.',
            ],
        },
        {
            id: 'professional-work',
            target: targets.work,
            group,
            title: 'Dados do Profissional',
            content: [
                mode === 'create'
                    ? 'Escolha o cargo e informe a matrícula e a data de ingresso. O cargo define o que o profissional pode ver e fazer no sistema. Só aparecem os cargos ativos.'
                    : 'Aqui você muda o cargo, a matrícula, a data de ingresso e o status. Ao trocar o cargo, o profissional passa a ter as permissões do novo cargo. Use o status Inativo quando ele deixar a equipe.',
                'Ligue Aparece no site para mostrar o profissional na página de equipe do site. A opção de administrador interno só aparece para o administrador superior do Gnai.',
            ],
        },
    ];

    if (mode === 'create') {
        steps.push({
            id: 'professional-access',
            target: targets.access,
            group,
            title: 'Acesso ao Sistema',
            content: [
                'Ao salvar, o sistema já cria a conta de acesso do profissional. Você pode definir uma senha inicial, com pelo menos 8 caracteres, letras e números.',
                'Se deixar a senha em branco, o profissional recebe por e-mail um link para criar a própria senha.',
            ],
        });
    }

    steps.push({
        id: 'professional-form-actions',
        target: targets.formActions,
        group,
        title: 'Salvar ou cancelar',
        content: [
            'Clique em Salvar para gravar os dados. Se faltar alguma informação, o aviso aparece embaixo do campo.',
            mode === 'create'
                ? 'Cancelar volta para a lista de profissionais sem salvar.'
                : 'Cancelar volta para o perfil do profissional sem salvar.',
        ],
    });

    return steps;
}

export const professionalCreateTour: GuidedTourPageConfig = {
    helpHref: helpUrls.show(HELP_SLUG, 'cadastrar-um-profissional'),
    steps: professionalFormSteps('create'),
};

export const professionalEditTour: GuidedTourPageConfig = {
    helpHref: helpUrls.show(HELP_SLUG, 'editar-um-profissional'),
    steps: professionalFormSteps('edit'),
};

export const professionalShowTour: GuidedTourPageConfig = {
    helpHref: helpUrls.show(HELP_SLUG, 'encontrar-um-profissional'),
    steps: [
        {
            id: 'professional-identification',
            target: targets.identification,
            title: 'Identificação Pessoal',
            content:
                'Aqui ficam a foto, o nome, o CPF, a data de nascimento, o e-mail, o telefone e o endereço do profissional.',
        },
        {
            id: 'professional-employment',
            target: targets.employment,
            title: 'Vínculo Profissional',
            content: [
                'Aqui você vê o cargo, a matrícula, o status, se o profissional aparece no site, a data de admissão e o tempo de instituição.',
                'O cargo define o que o profissional pode ver e fazer no sistema.',
            ],
        },
        {
            id: 'professional-details-actions',
            target: targets.detailsActions,
            title: 'Ações do perfil',
            content: [
                'Voltar leva para a lista de profissionais. Editar abre o cadastro para alterar os dados. Excluir apaga o profissional e a conta de acesso dele, depois de pedir confirmação.',
                'Entrar como, à esquerda, aparece só para o administrador superior do Gnai. Os outros botões dependem das suas permissões.',
            ],
        },
    ],
};

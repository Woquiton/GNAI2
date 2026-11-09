import type { GuidedTourPageConfig } from '@/components/UI/GuidedTour/GuidedTour.types';
import type { TableListTourConfig } from '@/components/Tables/TableList/TableList';

export const peopleListTour: TableListTourConfig = {
    helpHref: '/ajuda/pessoas',
    filters: [
        'Pesquise pelo nome ou filtre por qualquer etiqueta, convencional ou especial. As especiais aparecem com estrela dourada. Uma pessoa pode ter vários papéis.',
    ],
    table: [
        'Consulte as pessoas cadastradas e suas etiquetas. Abra a edição para atualizar os dados compartilhados e os dados de cada papel.',
    ],
};
export const personFormTour: GuidedTourPageConfig = {
    helpHref: '/ajuda/pessoas',
    steps: [
        {
            id: 'person-identity',
            target: 'person-identity',
            title: 'Dados compartilhados',
            content:
                'Nome, documentos, contatos e foto pertencem à pessoa e são compartilhados entre seus cadastros.',
        },
        {
            id: 'person-roles',
            target: 'person-roles',
            title: 'Etiquetas',
            content:
                'Use o campo Etiquetas, ao lado do Telefone, para selecionar etiquetas convencionais e especiais juntas. Aluno, Professor, Equipe e Responsáveis são identificadas pela estrela dourada e exibem seus campos específicos abaixo. Ao salvar, a mesma pessoa passa a aparecer nos respectivos cadastros. Para remover um papel já salvo, utilize a exclusão do cadastro correspondente, que verifica os históricos.',
        },
        {
            id: 'person-details',
            target: 'person-details',
            title: 'Dados de cada papel',
            content:
                'Preencha os dados específicos das etiquetas selecionadas. Responsáveis podem ter vínculos com vários alunos. Novos professores e integrantes da equipe recebem um link para definir a senha de acesso.',
        },
    ],
};

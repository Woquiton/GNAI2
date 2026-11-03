import { helpUrls } from '@/components/Help/Help.routes';
import type { TableListTourConfig } from '@/components/Tables/TableList/TableList';
import type { GuidedTourPageConfig } from '@/components/UI/GuidedTour/GuidedTour.types';

/** Valores de `data-tour` das telas de cursos do aluno (matrículas). */
export const STUDENT_COURSE_TOUR_TARGETS = {
    formStudent: 'student-course-form-student',
    formEnrollment: 'student-course-form-enrollment',
    formFollowUp: 'student-course-form-follow-up',
    formActions: 'student-course-form-actions',
    data: 'student-course-data',
    followUp: 'student-course-follow-up',
    academicHistory: 'student-course-academic-history',
    curriculum: 'student-course-curriculum',
    system: 'student-course-system',
    detailsActions: 'student-course-details-actions',
} as const;

const targets = STUDENT_COURSE_TOUR_TARGETS;
const HELP_SLUG = 'alunos';
const CREATE_GROUP = 'Nova matrícula';
const EDIT_GROUP = 'Edição da matrícula';

export const studentCourseListTour: TableListTourConfig = {
    helpHref: helpUrls.show(HELP_SLUG, 'editar-tornar-atual-ou-excluir-um-curso-do-aluno'),
    actions: [
        'Voltar leva para o prontuário do aluno, na aba Cursos do aluno. Cadastrar abre a tela Nova Matrícula, para vincular o aluno a outro curso.',
        'O botão Cadastrar só aparece para quem tem permissão.',
    ],
    filters: [
        'Filtre os cursos deste aluno pelo Curso, pelo Ano letivo ou pelo Status: Curso Atual ou Histórico.',
        'A lista se atualiza sozinha enquanto você digita ou escolhe uma opção.',
    ],
    table: [
        'Cada linha é um curso do aluno, com o ano letivo, o semestre e a situação. Atual mostra o curso em andamento; Histórico, os cursos anteriores.',
        'Use o botão de olho, no fim da linha, para ver os detalhes do curso. O botão de excluir aparece só para quem tem permissão.',
    ],
};

export const studentCourseCreateTour: GuidedTourPageConfig = {
    helpHref: helpUrls.show(HELP_SLUG, 'vincular-um-curso-ao-aluno'),
    steps: [
        {
            id: 'student-course-form-student',
            target: targets.formStudent,
            group: CREATE_GROUP,
            title: 'Aluno',
            content: 'Aqui aparecem o nome e a matrícula do aluno que vai ser vinculado ao curso.',
        },
        {
            id: 'student-course-form-enrollment',
            target: targets.formEnrollment,
            group: CREATE_GROUP,
            title: 'Dados da Matrícula',
            content: [
                'Escolha o Curso / Série e informe o Ano Letivo, com 4 dígitos. Os campos com asterisco (*) são obrigatórios. O Semestre já vem com o semestre atual, e o Período do Curso é opcional.',
                'Marque Definir este como o curso atual do aluno se ele for o curso em andamento. O curso atual anterior passa para o histórico. No primeiro curso do aluno, essa opção já vem marcada.',
            ],
        },
        {
            id: 'student-course-form-follow-up',
            target: targets.formFollowUp,
            group: CREATE_GROUP,
            title: 'Acompanhamento Acadêmico no Semestre',
            content: [
                'Esta parte aparece para o curso atual. Você pode escrever a Situação da Frequência Escolar e marcar as Disciplinas com Reprovação e as Disciplinas com Risco de Insucesso Acadêmico.',
                'Marque só as exceções. As disciplinas não marcadas são consideradas sem reprovação. Tudo fica registrado no Semestre escolhido.',
            ],
        },
        {
            id: 'student-course-form-actions',
            target: targets.formActions,
            group: CREATE_GROUP,
            title: 'Salvar ou cancelar',
            content: [
                'Clique em Salvar para vincular o aluno ao curso. Se faltar alguma informação, o aviso aparece embaixo do campo.',
                'Cancelar volta para o prontuário do aluno sem salvar.',
            ],
        },
    ],
};

export const studentCourseEditTour: GuidedTourPageConfig = {
    helpHref: helpUrls.show(HELP_SLUG, 'reprovacoes-riscos-e-dependencias-por-semestre'),
    steps: [
        {
            id: 'student-course-form-student',
            target: targets.formStudent,
            group: EDIT_GROUP,
            title: 'Dados do Aluno e Curso',
            content:
                'Aqui aparecem o aluno e o curso desta matrícula. O curso não pode ser trocado na edição.',
        },
        {
            id: 'student-course-form-enrollment',
            target: targets.formEnrollment,
            group: EDIT_GROUP,
            title: 'Dados da Matrícula',
            content: [
                'Altere o Ano Letivo, o Semestre e o Período do Curso. Os campos com asterisco (*) são obrigatórios.',
                'Ao trocar o Semestre, a tela carrega o período, as reprovações e os riscos já registrados nele. Os outros semestres continuam como estavam.',
            ],
        },
        {
            id: 'student-course-form-follow-up',
            target: targets.formFollowUp,
            group: EDIT_GROUP,
            title: 'Acompanhamento Acadêmico no Semestre',
            content: [
                'Escreva a Situação da Frequência Escolar e marque as Disciplinas com Reprovação e as com Risco de Insucesso Acadêmico no semestre escolhido. Marque só as exceções.',
                'Quando o aluno tem reprovações de semestres anteriores, aparece também Dependências aprovadas neste semestre. Marque as que ele concluiu.',
            ],
        },
        {
            id: 'student-course-form-actions',
            target: targets.formActions,
            group: EDIT_GROUP,
            title: 'Salvar ou cancelar',
            content: [
                'Clique em Salvar para gravar as alterações. Se faltar alguma informação, o aviso aparece embaixo do campo.',
                'Cancelar volta para o prontuário do aluno sem salvar.',
            ],
        },
    ],
};

export const studentCourseShowTour: GuidedTourPageConfig = {
    helpHref: helpUrls.show(HELP_SLUG, 'editar-tornar-atual-ou-excluir-um-curso-do-aluno'),
    steps: [
        {
            id: 'student-course-data',
            target: targets.data,
            title: 'Dados da Matrícula',
            content: [
                'Mostra o aluno, o curso, o ano letivo, o semestre e o período do curso. A Situação diz se este é o curso Atual ou se está no Histórico.',
                'Em Períodos por Semestre, você vê o período do aluno em cada semestre já registrado.',
            ],
        },
        {
            id: 'student-course-follow-up',
            target: targets.followUp,
            title: 'Acompanhamento Acadêmico no Curso',
            content:
                'Aqui ficam a situação da frequência escolar e as dependências pendentes, que são reprovações de semestres anteriores que o aluno ainda não concluiu.',
        },
        {
            id: 'student-course-academic-history',
            target: targets.academicHistory,
            title: 'Reprovações e Riscos por Semestre',
            content:
                'Cada semestre mostra as disciplinas com reprovação, as com risco de insucesso e as dependências aprovadas naquele semestre.',
        },
        {
            id: 'student-course-curriculum',
            target: targets.curriculum,
            title: 'Matriz Curricular',
            content:
                'Lista as disciplinas do curso. Quando a disciplina tem descrição, passe o mouse sobre o nome para ver.',
        },
        {
            id: 'student-course-system',
            target: targets.system,
            title: 'Informações do Sistema',
            content: 'Mostra quando a matrícula foi criada e quando foi alterada pela última vez.',
        },
        {
            id: 'student-course-details-actions',
            target: targets.detailsActions,
            title: 'Ações da matrícula',
            content: [
                'Voltar leva para o prontuário do aluno. Editar aparece só para o curso atual. Tornar Atual aparece para os cursos do histórico e pede confirmação.',
                'Excluir apaga a matrícula depois de pedir confirmação. Se era o curso atual, o curso mais recente passa a ser o atual. Alguns botões só aparecem para quem tem permissão.',
            ],
        },
    ],
};

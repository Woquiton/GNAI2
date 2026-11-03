import { helpUrls } from '@/components/Help/Help.routes';
import type { GuidedTourPageConfig } from '@/components/UI/GuidedTour/GuidedTour.types';

/** Valores de `data-tour` do envio e da edição do documento do aluno. */
export const STUDENT_DOCUMENT_TOUR_TARGETS = {
    information: 'student-document-information',
    file: 'student-document-file',
    formActions: 'student-document-form-actions',
} as const;

const targets = STUDENT_DOCUMENT_TOUR_TARGETS;
const HELP_SLUG = 'alunos-responsaveis-e-documentos';
const CREATE_GROUP = 'Envio do documento';
const EDIT_GROUP = 'Edição do documento';

export const studentDocumentCreateTour: GuidedTourPageConfig = {
    helpHref: helpUrls.show(HELP_SLUG, 'enviar-um-documento-do-aluno'),
    steps: [
        {
            id: 'student-document-information',
            target: targets.information,
            group: CREATE_GROUP,
            title: 'Informações do Documento',
            content: [
                'Dê um título ao documento, como Laudo Médico Psicológico 2024, e escolha o Tipo de Documento. Os campos com asterisco (*) são obrigatórios.',
                'O Semestre Atual é preenchido sozinho com o semestre atual do sistema.',
            ],
        },
        {
            id: 'student-document-file',
            target: targets.file,
            group: CREATE_GROUP,
            title: 'Arquivo',
            content: [
                'Clique em Selecionar arquivo para escolher o documento no seu computador. Ele é obrigatório.',
                'Você pode enviar PDF, DOC, DOCX, JPG ou PNG de até 10 MB. Depois de escolher, use Remover para tirar o arquivo e escolher outro.',
            ],
        },
        {
            id: 'student-document-form-actions',
            target: targets.formActions,
            group: CREATE_GROUP,
            title: 'Enviar ou cancelar',
            content: [
                'Clique em Realizar Upload para enviar o documento. Se faltar alguma informação, o aviso aparece embaixo do campo.',
                'Cancelar volta para o prontuário do aluno sem enviar nada.',
            ],
        },
    ],
};

export const studentDocumentEditTour: GuidedTourPageConfig = {
    helpHref: helpUrls.show(HELP_SLUG, 'visualizar-baixar-editar-ou-excluir-um-documento'),
    steps: [
        {
            id: 'student-document-information',
            target: targets.information,
            group: EDIT_GROUP,
            title: 'Informações Gerais',
            content: [
                'Aqui você muda o título e o tipo do documento. Os campos com asterisco (*) são obrigatórios.',
                'O Semestre Atual aparece só para consulta.',
            ],
        },
        {
            id: 'student-document-file',
            target: targets.file,
            group: EDIT_GROUP,
            title: 'Arquivo',
            content: [
                'Em Arquivo Atual, você vê o nome do arquivo enviado. Para trocar, clique em Selecionar arquivo e escolha outro.',
                'Se não escolher nada, o arquivo atual continua. O novo arquivo pode ser PDF, DOC, DOCX, JPG ou PNG de até 10 MB.',
            ],
        },
        {
            id: 'student-document-form-actions',
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

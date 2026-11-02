import type { StudentDocumentFilters } from './StudentDocuments.types';

export const emptyStudentDocumentFilters: StudentDocumentFilters = {
    title: '',
    type: '',
    semester_id: '',
};

/** Formatos e limite aceitos por `CreateStudentDocumentData`/`UpdateStudentDocumentData`. */
export const studentDocumentAcceptedFiles = '.pdf,.doc,.docx,.jpg,.jpeg,.png';
export const studentDocumentMaxFileSize = 10 * 1024 * 1024;

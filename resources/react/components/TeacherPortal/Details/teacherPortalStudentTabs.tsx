import type { TabItem } from '@/components/Navigation/Tabs/Tabs';
import type { TeacherPortalStudentShowProps } from '../TeacherPortal.types';
import TeacherPortalCaseStudy from './TeacherPortalCaseStudy';
import TeacherPortalDocuments from './TeacherPortalDocuments';
import TeacherPortalPaee from './TeacherPortalPaee';
import TeacherPortalPei from './TeacherPortalPei';

/** Abas do prontuário em modo leitura, na ordem do atendimento: laudo, estudo, PAEE e PEI. */
export function createTeacherPortalStudentTabs({
    documents,
    caseStudy,
    paee,
    pei,
}: TeacherPortalStudentShowProps): TabItem[] {
    return [
        {
            id: 'documents',
            label: 'Laudo e Documentos',
            content: <TeacherPortalDocuments documents={documents} />,
        },
        {
            id: 'case-study',
            label: 'Estudo de Caso',
            content: <TeacherPortalCaseStudy caseStudy={caseStudy} />,
        },
        { id: 'paee', label: 'PAEE', content: <TeacherPortalPaee paee={paee} /> },
        { id: 'pei', label: 'PEI', content: <TeacherPortalPei pei={pei} /> },
    ];
}

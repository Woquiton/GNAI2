import type { TabItem } from '@/components/Navigation/Tabs/Tabs';
import type { TeacherPortalStudentShowProps } from '../TeacherPortal.types';
import TeacherPortalCaseStudy from './TeacherPortalCaseStudy';
import TeacherPortalDocuments from './TeacherPortalDocuments';
import TeacherPortalPaee from './TeacherPortalPaee';
import TeacherPortalPei from './TeacherPortalPei';
import { TEACHER_PORTAL_TOUR_TARGETS } from '../teacherPortalTours';

/** Abas do prontuário em modo leitura, com o PEI primeiro e os documentos por último. */
export function createTeacherPortalStudentTabs({
    documents,
    caseStudy,
    paee,
    pei,
}: TeacherPortalStudentShowProps): TabItem[] {
    return [
        {
            id: 'pei',
            label: 'PEI',
            icon: 'fa fa-map-o',
            content: <TeacherPortalPei pei={pei} />,
            tourTarget: TEACHER_PORTAL_TOUR_TARGETS.peiTab,
        },
        {
            id: 'case-study',
            label: 'Estudo de Caso',
            icon: 'fa fa-stethoscope',
            content: <TeacherPortalCaseStudy caseStudy={caseStudy} />,
        },
        {
            id: 'paee',
            label: 'PAEE',
            icon: 'fa fa-sitemap',
            content: <TeacherPortalPaee paee={paee} />,
        },
        {
            id: 'documents',
            label: 'Laudo e Documentos',
            icon: 'fa fa-folder-open-o',
            content: <TeacherPortalDocuments documents={documents} />,
        },
    ];
}

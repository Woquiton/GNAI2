import type { TabItem } from '@/components/Navigation/Tabs/Tabs';
import { peiUrls } from '../Peis.routes';
import type { PeiShowProps } from '../Peis.types';
import PeiAttendanceDetails from './PeiAttendanceDetails';
import PeiDisciplineTable from './PeiDisciplineTable';
import PeiGeneralDetails from './PeiGeneralDetails';
import PeiOtherInfo from './PeiOtherInfo';
import PeiPaeeDetails from './PeiPaeeDetails';
import { PEI_TOUR_TARGETS } from '../peiTours';

/** Aba aberta por padrão quando `activeTab` não corresponde a uma aba permitida. */
export const PEI_DEFAULT_TAB = 'details';

/** Abas do PEI montadas conforme as permissões recebidas do controller. */
export function createPeiRecordTabs({
    pei,
    student,
    paee,
    attendanceSummary,
    otherRelevantInfo,
    peiDisciplines,
    can,
}: PeiShowProps): TabItem[] {
    const tabs: TabItem[] = [
        {
            id: PEI_DEFAULT_TAB,
            label: 'Dados do PEI',
            icon: 'fa fa-file-text-o',
            content: <PeiGeneralDetails pei={pei} student={student} />,
        },
    ];

    if (can.viewPaee) {
        tabs.push({
            id: 'paee',
            label: 'PAEE vinculado',
            tourTarget: PEI_TOUR_TARGETS.paeeTabLabel,
            icon: 'fa fa-sitemap',
            content: <PeiPaeeDetails paee={paee} />,
        });
    }

    if (can.viewDisciplines || can.createDiscipline) {
        tabs.push({
            id: 'disciplines',
            label: 'Adaptações curriculares',
            tourTarget: PEI_TOUR_TARGETS.disciplinesTabLabel,
            accessibleLabel: 'Adaptações razoáveis e/ou acessibilidades curriculares',
            icon: 'fa fa-book',
            content: (
                <PeiDisciplineTable
                    peiId={pei.id}
                    disciplines={peiDisciplines}
                    canView={can.viewDisciplines}
                    canCreate={can.createDiscipline}
                    canPdf={can.pdf}
                />
            ),
        });
    }

    tabs.push(
        {
            id: 'attendance',
            label: 'Acompanhamento',
            accessibleLabel: 'Atividades, acompanhamento e devolutivas do semestre',
            icon: 'fa fa-calendar-check-o',
            content: <PeiAttendanceDetails summary={attendanceSummary} />,
        },
        {
            id: 'other-info',
            label: 'Outras informações',
            accessibleLabel: 'Outras informações relevantes',
            icon: 'fa fa-info-circle',
            content: (
                <PeiOtherInfo
                    action={peiUrls.otherInfo(pei.id)}
                    value={otherRelevantInfo}
                    canUpdate={can.updateOtherInfo}
                />
            ),
        },
    );

    return tabs;
}

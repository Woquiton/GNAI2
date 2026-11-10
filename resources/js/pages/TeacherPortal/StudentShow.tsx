import { useEffect, useState, type ReactNode } from 'react';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';
import RecordTabs from '@/components/Navigation/RecordTabs/RecordTabs';
import TeacherPortalLayout from '@/components/Navigation/TeacherPortalLayout/TeacherPortalLayout';
import TeacherPortalStudentActions from '@/components/TeacherPortal/Details/TeacherPortalStudentActions';
import TeacherPortalStudentSummary from '@/components/TeacherPortal/Details/TeacherPortalStudentSummary';
import { createTeacherPortalStudentTabs } from '@/components/TeacherPortal/Details/teacherPortalStudentTabs';
import { teacherPortalBreadcrumb } from '@/components/TeacherPortal/TeacherPortal.routes';
import type { TeacherPortalStudentShowProps } from '@/components/TeacherPortal/TeacherPortal.types';
import TableLabel from '@/components/UI/TableLabel/TableLabel';
import {
    TEACHER_PORTAL_TOUR_TARGETS,
    teacherPortalStudentTour,
} from '@/components/TeacherPortal/teacherPortalTours';

export default function TeacherPortalStudentShowPage(
    props: TeacherPortalStudentShowProps,
): React.JSX.Element {
    const { student, status, initialTab } = props;
    const [activeTab, setActiveTab] = useState<string>(initialTab);

    useEffect(() => {
        setActiveTab(initialTab);
    }, [initialTab, student.id]);

    return (
        <BusinessPage
            title={student.name}
            subtitle={`Matrícula: ${student.registration ?? 'não informada'}`}
            breadcrumbItems={teacherPortalBreadcrumb({ current: student.name })}
            actions={<TableLabel tone="inverse">Modo leitura</TableLabel>}
            tour={teacherPortalStudentTour}
            className="teacherPortal"
        >
            <TeacherPortalStudentSummary student={student} status={status} />
            <RecordTabs
                items={createTeacherPortalStudentTabs(props)}
                initialActiveId={activeTab}
                tourTarget={TEACHER_PORTAL_TOUR_TARGETS.tabs}
                onChange={setActiveTab}
            />
            <TeacherPortalStudentActions pei={props.pei} activeTab={activeTab} />
        </BusinessPage>
    );
}

TeacherPortalStudentShowPage.layout = (page: ReactNode): ReactNode => (
    <TeacherPortalLayout>{page}</TeacherPortalLayout>
);

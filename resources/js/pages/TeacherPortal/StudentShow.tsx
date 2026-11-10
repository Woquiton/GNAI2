import { useEffect, useMemo, useState, type ReactNode } from 'react';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';
import RecordTabs from '@/components/Navigation/RecordTabs/RecordTabs';
import TeacherPortalLayout from '@/components/Navigation/TeacherPortalLayout/TeacherPortalLayout';
import TeacherPortalStudentActions from '@/components/TeacherPortal/Details/TeacherPortalStudentActions';
import TeacherPortalStudentSummary from '@/components/TeacherPortal/Details/TeacherPortalStudentSummary';
import { createTeacherPortalStudentTabs } from '@/components/TeacherPortal/Details/teacherPortalStudentTabs';
import { teacherPortalBreadcrumb } from '@/components/TeacherPortal/TeacherPortal.routes';
import type { TeacherPortalStudentShowProps } from '@/components/TeacherPortal/TeacherPortal.types';
import {
    TEACHER_PORTAL_TOUR_TARGETS,
    createTeacherPortalStudentTour,
} from '@/components/TeacherPortal/teacherPortalTours';

export default function TeacherPortalStudentShowPage(
    props: TeacherPortalStudentShowProps,
): React.JSX.Element {
    const { student, status, initialTab } = props;
    const [activeTab, setActiveTab] = useState<string>(initialTab);
    const tour = useMemo(() => createTeacherPortalStudentTour(props.pei), [props.pei]);

    useEffect(() => {
        setActiveTab(initialTab);
    }, [initialTab, student.id]);

    return (
        <BusinessPage
            title={student.name}
            subtitle={`Matrícula: ${student.registration ?? 'não informada'}`}
            breadcrumbItems={teacherPortalBreadcrumb({ current: student.name })}
            tour={tour}
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

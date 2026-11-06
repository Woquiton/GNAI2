import type { ReactNode } from 'react';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';
import RecordTabs from '@/components/Navigation/RecordTabs/RecordTabs';
import TeacherPortalLayout from '@/components/Navigation/TeacherPortalLayout/TeacherPortalLayout';
import TeacherPortalAccessNotice from '@/components/TeacherPortal/Details/TeacherPortalAccessNotice';
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
    const { student, status } = props;

    return (
        <BusinessPage
            title={student.name}
            subtitle={`Matrícula: ${student.registration ?? 'não informada'}`}
            breadcrumbItems={teacherPortalBreadcrumb({ current: student.name })}
            actions={<TableLabel tone="inverse">Modo leitura</TableLabel>}
            tour={teacherPortalStudentTour}
            className="teacherPortal"
        >
            <TeacherPortalAccessNotice />
            <TeacherPortalStudentSummary student={student} status={status} />
            <RecordTabs
                items={createTeacherPortalStudentTabs(props)}
                tourTarget={TEACHER_PORTAL_TOUR_TARGETS.tabs}
            />
            <TeacherPortalStudentActions />
        </BusinessPage>
    );
}

TeacherPortalStudentShowPage.layout = (page: ReactNode): ReactNode => (
    <TeacherPortalLayout>{page}</TeacherPortalLayout>
);

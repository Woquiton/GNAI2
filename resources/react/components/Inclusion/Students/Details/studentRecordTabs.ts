import type { TabItem } from '@/components/Navigation/Tabs/Tabs';
import type { StudentRecordTabId, StudentShowProps } from '../Students.types';
import { createStudentAttendanceTabs } from './StudentAttendanceRecord';
import { createStudentDocumentTabs } from './StudentDocumentsRecord';
import { createStudentLoanTabs } from './StudentLoansRecord';
import { createStudentPersonalTabs } from './StudentPersonalRecord';
import { createStudentSupportTabs } from './StudentSupportRecord';
import { createStudentSupportRequestTabs } from './StudentSupportRequestsRecord';

/** Abas do prontuário, na ordem do cadastro; cada grupo inclui somente as abas permitidas. */
export function createStudentRecordTabs(
    props: StudentShowProps & { loadingTab: StudentRecordTabId | null },
): TabItem[] {
    const {
        student,
        permissions,
        caseStudies = [],
        paees = [],
        loans = [],
        supportRequests = [],
        loadingTab,
    } = props;

    return [
        ...createStudentPersonalTabs({
            ...props,
            academicLoading: loadingTab === 'academic-data',
        }),
        ...createStudentSupportTabs({
            student,
            permissions,
            caseStudies,
            paees,
            loadingTab,
        }),
        ...createStudentDocumentTabs({ student, permissions, loadingTab }),
        ...createStudentAttendanceTabs({ ...props, loadingTab }),
        ...createStudentLoanTabs({ student, permissions, loans, loadingTab }),
        ...createStudentSupportRequestTabs({ student, permissions, supportRequests, loadingTab }),
    ];
}

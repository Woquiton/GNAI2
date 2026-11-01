import type { TabItem } from '@/components/Navigation/Tabs/Tabs';
import type { StudentShowProps } from '../Students.types';
import { createStudentAttendanceTabs } from './StudentAttendanceRecord';
import { createStudentDocumentTabs } from './StudentDocumentsRecord';
import { createStudentLoanTabs } from './StudentLoansRecord';
import { createStudentPersonalTabs } from './StudentPersonalRecord';
import { createStudentSupportTabs } from './StudentSupportRecord';

/** Abas do prontuário, na ordem do cadastro; cada grupo inclui somente as abas permitidas. */
export function createStudentRecordTabs(props: StudentShowProps): TabItem[] {
    const { student, permissions, caseStudies, paees, loans } = props;

    return [
        ...createStudentPersonalTabs(props),
        ...createStudentSupportTabs({ student, permissions, caseStudies, paees }),
        ...createStudentDocumentTabs({ student, permissions }),
        ...createStudentAttendanceTabs(props),
        ...createStudentLoanTabs({ student, permissions, loans }),
    ];
}

import { router } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import StudentDetailsActions from '@/components/Students/Details/StudentDetailsActions';
import StudentRecordWorkspace from '@/components/Students/Details/StudentRecordWorkspace';
import StudentRecordSummary from '@/components/Students/Details/StudentRecordSummary';
import { createStudentRecordTabs } from '@/components/Students/Details/studentRecordTabs';
import StudentDeleteModal from '@/components/Students/StudentDeleteModal';
import { STUDENT_FAILURE_TEXT } from '@/components/Students/Students.constants';
import {
    studentBreadcrumb,
    studentRecordUrl,
    studentUrls,
} from '@/components/Students/Students.routes';
import {
    STUDENT_TOUR_TARGETS,
    studentRecordTour,
} from '@/components/Students/studentTours';
import type {
    Permissions,
    StudentRecord,
    StudentRecordTabId,
    StudentShowProps,
} from '@/components/Students/Students.types';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';
import Tabs from '@/components/Navigation/Tabs/Tabs';
import { useConfirmedAction } from '@/components/UI/ConfirmActionModal/useConfirmedAction';
import {
    notifyConnectionFailure,
    notifyOperationFailure,
} from '@/components/UI/NotificationToast/operationFeedback';

function isTabAvailable(tab: StudentRecordTabId, permissions: Permissions): boolean {
    switch (tab) {
        case 'support-profiles':
            return permissions['student-deficiency.view'];
        case 'guardians':
            return permissions['guardian.view'];
        case 'case-studies':
            return permissions['case-study.view'];
        case 'paees':
            return permissions['paee.view'];
        case 'peis':
            return permissions['pei.view'];
        case 'documents':
            return permissions['student-document.view'];
        case 'aee-attendance':
            return permissions['aee-record.view-all'] || permissions['aee-record.view-own'];
        case 'pedagogical-attendance':
            return (
                permissions['pedagogical-record.view-all'] ||
                permissions['pedagogical-record.view-own']
            );
        case 'loans':
            return permissions['loan.index'];
        case 'support-requests':
            return permissions['support-request.view'];
        default:
            return true;
    }
}

function initialTab(props: StudentShowProps): StudentRecordTabId {
    const requested = props.activeTab as StudentRecordTabId | undefined;

    return requested && isTabAvailable(requested, props.permissions) ? requested : 'personal-data';
}

function dataPropFor(tab: StudentRecordTabId): keyof StudentShowProps | null {
    switch (tab) {
        case 'academic-data':
            return 'studentCourses';
        case 'support-profiles':
            return 'supportProfiles';
        case 'guardians':
            return 'guardians';
        case 'case-studies':
            return 'caseStudies';
        case 'paees':
            return 'paees';
        case 'peis':
            return 'peis';
        case 'documents':
            return 'documents';
        case 'aee-attendance':
            return 'aeeEvaluations';
        case 'pedagogical-attendance':
            return 'pedagogicalRecords';
        case 'loans':
            return 'loans';
        case 'support-requests':
            return 'supportRequests';
        default:
            return null;
    }
}

function tabIsLoaded(tab: StudentRecordTabId, props: StudentShowProps): boolean {
    const dataProp = dataPropFor(tab);

    return dataProp === null || props[dataProp] !== undefined;
}

export default function StudentsShow(props: StudentShowProps): React.JSX.Element {
    const { student, permissions, statusPanel } = props;
    const [activeTab, setActiveTab] = useState<StudentRecordTabId>(() => initialTab(props));
    const [loadingTab, setLoadingTab] = useState<StudentRecordTabId | null>(null);
    const cancelRequest = useRef<(() => void) | null>(null);
    const pendingTab = useRef<StudentRecordTabId | null>(null);
    const removal = useConfirmedAction<StudentRecord>({ failureText: STUDENT_FAILURE_TEXT });
    const recordStudent: StudentRecord = {
        ...student,
        student_courses: props.studentCourses ?? [],
        deficiencies: props.supportProfiles ?? [],
        guardians: props.guardians ?? [],
        peis: props.peis ?? [],
        documents: props.documents ?? [],
    };
    const tabs = createStudentRecordTabs({
        ...props,
        student: recordStudent,
        loadingTab,
    });

    useEffect(() => () => cancelRequest.current?.(), []);

    useEffect(() => {
        const requested = props.activeTab as StudentRecordTabId | undefined;
        setActiveTab(
            requested && isTabAvailable(requested, permissions) ? requested : 'personal-data',
        );
    }, [permissions, props.activeTab]);

    function selectTab(tab: StudentRecordTabId): void {
        if (!isTabAvailable(tab, permissions)) return;

        const previousTab = activeTab;
        const dataProp = dataPropFor(tab);
        setActiveTab(tab);
        cancelRequest.current?.();
        cancelRequest.current = null;
        pendingTab.current = null;

        if (!dataProp || tabIsLoaded(tab, props)) {
            setLoadingTab(null);
            router.replace<StudentShowProps>({
                url: studentRecordUrl(student.id, tab),
                props: (current) => ({ ...current, activeTab: tab }),
                preserveScroll: true,
                preserveState: true,
            });
            return;
        }

        pendingTab.current = tab;
        setLoadingTab(tab);
        router.get(
            studentRecordUrl(student.id, tab),
            {},
            {
                only: ['activeTab', dataProp],
                preserveState: true,
                preserveScroll: true,
                replace: true,
                onCancelToken: (token) => {
                    if (pendingTab.current === tab) {
                        cancelRequest.current = () => token.cancel();
                    }
                },
                onNetworkError: () => {
                    setActiveTab(previousTab);
                    notifyConnectionFailure();
                    return false;
                },
                onHttpException: () => {
                    setActiveTab(previousTab);
                    notifyOperationFailure(
                        'Ocorreu uma falha ao consultar esta seção do prontuário.',
                    );
                    return false;
                },
                onFinish: () => {
                    if (pendingTab.current === tab) {
                        cancelRequest.current = null;
                        pendingTab.current = null;
                        setLoadingTab((current) => (current === tab ? null : current));
                    }
                },
            },
        );
    }

    return (
        <BusinessPage
            title="Prontuário do Aluno"
            subtitle="Visualize o ecossistema completo e histórico detalhado do aluno."
            documentTitle={student.person.name}
            breadcrumbItems={studentBreadcrumb({ student })}
            busy={removal.processing}
            tour={studentRecordTour}
        >
            <StudentRecordSummary {...props} />
            <StudentRecordWorkspace statusPanel={statusPanel}>
                <Tabs
                    items={tabs}
                    initialActiveId={activeTab}
                    variant="standard"
                    dragToScroll
                    tourTarget={STUDENT_TOUR_TARGETS.tabs}
                    onChange={(tab) => selectTab(tab as StudentRecordTabId)}
                />
                <StudentDetailsActions
                    studentId={student.id}
                    studentName={student.person.name}
                    permissions={permissions}
                    deleting={removal.processing}
                    onDelete={() => removal.open(student)}
                />
            </StudentRecordWorkspace>
            <StudentDeleteModal
                student={removal.target}
                processing={removal.processing}
                onClose={removal.close}
                onConfirm={() => removal.submit('delete', studentUrls.destroy(student.id))}
            />
        </BusinessPage>
    );
}

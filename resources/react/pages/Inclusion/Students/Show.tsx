import { router } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import Button from '@/components/UI/Button/Button';
import FormActions from '@/components/Forms/FormActions/FormActions';
import Tabs, {
  type TabItem,
} from '@/components/Navigation/Tabs/Tabs';
import StudentPage from '@/components/Students/StudentPage';
import StudentPersonalRecord, {
  createStudentPersonalTabs,
} from '@/components/Students/StudentPersonalRecord';
import {
  createStudentSupportTabs,
} from '@/components/Students/StudentSupportRecord';
import {
  createStudentDocumentTabs,
} from '@/components/Students/StudentDocumentsRecord';
import {
  createStudentAttendanceTabs,
} from '@/components/Students/StudentAttendanceRecord';
import DeleteStudent from '@/components/Students/DeleteStudent';
import StudentStatusPanel from '@/components/Students/StudentStatusPanel';
import type {
  Permissions,
  StudentRecordTabId,
  StudentShowProps,
} from '@/components/Students/Students.types';
import {
  studentRecordUrl,
  studentUrl,
  studentsBase,
} from '@/components/Students/Students.utils';
import { notify } from '@/components/UI/NotificationToast/notify';

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
      return permissions['aee-record.view-all']
        || permissions['aee-record.view-own'];
    case 'pedagogical-attendance':
      return permissions['pedagogical-record.view-all']
        || permissions['pedagogical-record.view-own'];
    default:
      return true;
  }
}

function initialTab(props: StudentShowProps): StudentRecordTabId {
  const requested = props.activeTab as StudentRecordTabId | undefined;

  return requested && isTabAvailable(requested, props.permissions)
    ? requested
    : 'personal-data';
}

function dataPropFor(tab: StudentRecordTabId): string | null {
  switch (tab) {
    case 'academic-data': return 'studentCourses';
    case 'support-profiles': return 'supportProfiles';
    case 'guardians': return 'guardians';
    case 'case-studies': return 'caseStudies';
    case 'paees': return 'paees';
    case 'peis': return 'peis';
    case 'documents': return 'documents';
    case 'aee-attendance': return 'aeeEvaluations';
    case 'pedagogical-attendance': return 'pedagogicalRecords';
    default: return null;
  }
}

function tabIsLoaded(tab: StudentRecordTabId, props: StudentShowProps): boolean {
  switch (tab) {
    case 'academic-data': return props.studentCourses !== undefined;
    case 'support-profiles': return props.supportProfiles !== undefined;
    case 'guardians': return props.guardians !== undefined;
    case 'case-studies': return props.caseStudies !== undefined;
    case 'paees': return props.paees !== undefined;
    case 'peis': return props.peis !== undefined;
    case 'documents': return props.documents !== undefined;
    case 'aee-attendance': return props.aeeEvaluations !== undefined;
    case 'pedagogical-attendance': return props.pedagogicalRecords !== undefined;
    default: return true;
  }
}

export default function StudentsShow(props: StudentShowProps): React.JSX.Element {
  const { student, permissions, statusPanel } = props;
  const [activeTab, setActiveTab] = useState<StudentRecordTabId>(() => initialTab(props));
  const [loadingTab, setLoadingTab] = useState<StudentRecordTabId | null>(null);
  const cancelRequest = useRef<(() => void) | null>(null);
  const pendingTab = useRef<StudentRecordTabId | null>(null);
  const recordStudent = {
    ...student,
    student_courses: props.studentCourses ?? [],
    deficiencies: props.supportProfiles ?? [],
    guardians: props.guardians ?? [],
    peis: props.peis ?? [],
    documents: props.documents ?? [],
  };
  const tabs: TabItem[] = [
    ...createStudentPersonalTabs({
      ...props,
      student: recordStudent,
      academicLoading: loadingTab === 'academic-data',
    }),
    ...createStudentSupportTabs({
      student: recordStudent,
      permissions,
      caseStudies: props.caseStudies ?? [],
      paees: props.paees ?? [],
      loadingTab,
    }),
    ...createStudentDocumentTabs({
      student: recordStudent,
      permissions,
      loadingTab,
    }),
    ...createStudentAttendanceTabs({
      student: recordStudent,
      permissions,
      aeeEvaluations: props.aeeEvaluations ?? [],
      pedagogicalRecords: props.pedagogicalRecords ?? [],
      loadingTab,
    }),
  ];

  useEffect(() => () => cancelRequest.current?.(), []);

  useEffect(() => {
    const nextTab = initialTab(props);
    setActiveTab(nextTab);
  }, [props.activeTab]);

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
    router.get(studentRecordUrl(student.id, tab), {}, {
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
        notify({
          tone: 'error',
          title: 'Falha de conexão',
          text: 'Não foi possível carregar esta seção do prontuário. Confira sua conexão e tente novamente.',
        });
        return false;
      },
      onHttpException: () => {
        setActiveTab(previousTab);
        notify({
          tone: 'error',
          title: 'Não foi possível carregar',
          text: 'Ocorreu uma falha ao consultar esta seção do prontuário.',
        });
        return false;
      },
      onFinish: () => {
        if (pendingTab.current === tab) {
          cancelRequest.current = null;
          pendingTab.current = null;
          setLoadingTab((current) => current === tab ? null : current);
        }
      },
    });
  }

  return (
    <StudentPage
      title="Prontuário do Aluno"
      current={student.person.name}
      subtitle="Visualize o ecossistema completo e histórico detalhado do aluno."
    >
      <StudentPersonalRecord
        {...props}
        student={recordStudent}
      />
      <StudentStatusPanel panel={statusPanel} />
      <div className="studentsPage__recordTabs">
        <Tabs
          items={tabs}
          initialActiveId={activeTab}
          onChange={(tab) => selectTab(tab as StudentRecordTabId)}
          variant="standard"
        />
      </div>
      <FormActions
        secondary={permissions['student.view'] ? (
          <Button
            href={studentUrl(student.id, 'pdf')}
            target="_blank"
            rel="noopener noreferrer"
            tone="dark-red"
            leftIconClass="fa fa-file-pdf-o"
            label="PDF"
            title="Gerar PDF do aluno"
            aria-label="Gerar PDF do aluno"
          />
        ) : undefined}
      >
        <Button
          href={studentsBase}
          tone="cancel"
          label="Voltar"
          title="Voltar para alunos"
          aria-label="Voltar para alunos"
        />
        {permissions['student.update'] ? (
          <Button
            href={studentUrl(student.id, 'edit')}
            tone="warning"
            leftIconClass="fa fa-pencil"
            label="Editar"
            title="Editar cadastro do aluno"
            aria-label="Editar cadastro do aluno"
          />
        ) : null}
        {permissions['student.delete'] ? (
          <DeleteStudent
            id={student.id}
            name={student.person.name}
          />
        ) : null}
      </FormActions>
    </StudentPage>
  );
}

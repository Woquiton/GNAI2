import { useState } from 'react';
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
import type { StudentShowProps } from '@/components/Students/Students.types';
import { studentUrl, studentsBase } from '@/components/Students/Students.utils';

export default function StudentsShow(props: StudentShowProps): React.JSX.Element {
  const { student, permissions, caseStudies, paees, statusPanel } = props;
  const [activeTab, setActiveTab] = useState(props.activeTab || 'personal-data');
  const tabs: TabItem[] = [
    ...createStudentPersonalTabs(props),
    ...createStudentSupportTabs({ student, permissions, caseStudies, paees }),
    ...createStudentDocumentTabs({ student, permissions }),
    ...createStudentAttendanceTabs(props),
  ];

  return (
    <StudentPage
      title="Prontuário do Aluno"
      current={student.person.name}
      subtitle="Visualize o ecossistema completo e histórico detalhado do aluno."
    >
      <StudentPersonalRecord {...props} />
      <StudentStatusPanel panel={statusPanel} onOpenTab={setActiveTab} />
      <div className="studentsPage__recordTabs">
        <Tabs
          items={tabs}
          initialActiveId={activeTab}
          onChange={setActiveTab}
          variant="vertical"
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
            href={studentUrl(student.id, 'editar')}
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

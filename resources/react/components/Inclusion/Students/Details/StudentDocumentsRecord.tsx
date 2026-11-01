import FormSection from '@/components/Forms/FormSection/FormSection';
import { peiUrls } from '@/components/Inclusion/Peis/Peis.routes';
import {
    studentDocumentFileUrls,
    studentDocumentUrls,
} from '@/components/Inclusion/StudentDocuments/StudentDocuments.routes';
import type { TabItem } from '@/components/Navigation/Tabs/Tabs';
import {
    TableListCreateButton,
    TableListRowActions,
    type TableListColumn,
} from '@/components/Tables/TableList/TableList';
import Button from '@/components/UI/Button/Button';
import TableLabel from '@/components/UI/TableLabel/TableLabel';
import { dateLabel, dateTimeLabel, fileSizeLabel } from '@/utils/formatters';
import DeleteStudentRecord from '../DeleteStudentRecord';
import StudentRecordTable from '../StudentRecordTable';
import type { Permissions, StudentRecord } from '../Students.types';
import './StudentDetails.css';

type StudentPei = NonNullable<StudentRecord['peis']>[number];
type StudentDocument = NonNullable<StudentRecord['documents']>[number];

interface StudentDocumentsRecordProps {
    student: StudentRecord;
    permissions: Permissions;
}


function peiColumns(permissions: Permissions): TableListColumn<StudentPei>[] {
    return [
        {
            id: 'semester',
            label: 'Semestre',
            width: '21%',
            fixed: 'start',
            render: (pei) => (
                <>
                    <strong>{pei.semester_label ?? 'Não informado'}</strong>
                    <small className="studentDetails__secondary">
                        Criado em {dateLabel(pei.created_at)}
                    </small>
                </>
            ),
        },
        {
            id: 'course',
            label: 'Curso',
            width: '22%',
            render: (pei) => pei.course?.name ?? 'Não informado',
        },
        {
            id: 'status',
            label: 'Status',
            width: '15%',
            render: (pei) => (
                <TableLabel tone={pei.is_finished ? 'success' : 'warning'}>
                    {pei.is_finished ? 'Finalizado' : 'Em aberto'}
                </TableLabel>
            ),
        },
        {
            id: 'current',
            label: 'Atual',
            width: '12%',
            render: (pei) => (pei.is_current ? 'Sim' : 'Não'),
        },
        { id: 'version', label: 'Versão', width: '10%', render: (pei) => `V${pei.version}` },
        {
            id: 'actions',
            label: 'Ações',
            width: '20%',
            fixed: 'end',
            render: (pei) => (
                <TableListRowActions
                    view={
                        permissions['pei.view'] && {
                            href: peiUrls.show(pei.id),
                            label: `Visualizar PEI versão ${pei.version}`,
                        }
                    }
                >
                    {permissions['pei.delete'] ? (
                        <DeleteStudentRecord
                            action={peiUrls.destroy(pei.id)}
                            title="Excluir PEI"
                            message={`Excluir o PEI versão ${pei.version}?`}
                            ariaLabel={`Excluir PEI versão ${pei.version}`}
                        />
                    ) : null}
                </TableListRowActions>
            ),
        },
    ];
}

/** Visualizar e baixar abrem em outra aba; a ordem das ações segue a do prontuário original. */
function DocumentActions({
    document,
    permissions,
}: {
    document: StudentDocument;
    permissions: Permissions;
}): React.JSX.Element {
    const canView = permissions['student-document.view'];
    const canUpdate = permissions['student-document.update'];
    const canDelete = permissions['student-document.delete'];

    if (!canView && !canUpdate && !canDelete) {
        return <TableListRowActions />;
    }

    return (
        <TableListRowActions>
            {canView ? (
                <>
                    <Button
                        href={studentDocumentFileUrls.show(document.id)}
                        target="_blank"
                        rel="noopener noreferrer"
                        size="sm"
                        tone="dark-blue"
                        iconOnly
                        leftIconClass="fa fa-eye"
                        aria-label={`Visualizar documento ${document.title}`}
                    />
                    <Button
                        href={studentDocumentFileUrls.download(document.id)}
                        target="_blank"
                        rel="noopener noreferrer"
                        size="sm"
                        tone="cancel"
                        iconOnly
                        leftIconClass="fa fa-download"
                        aria-label={`Baixar documento ${document.title}`}
                    />
                </>
            ) : null}
            {canUpdate ? (
                <Button
                    href={studentDocumentFileUrls.edit(document.id)}
                    size="sm"
                    tone="warning"
                    iconOnly
                    leftIconClass="fa fa-pencil"
                    aria-label={`Editar documento ${document.title}`}
                />
            ) : null}
            {canDelete ? (
                <DeleteStudentRecord
                    action={studentDocumentFileUrls.destroy(document.id)}
                    title="Excluir documento"
                    message={
                        <>
                            Excluir permanentemente o documento <strong>{document.title}</strong>?
                        </>
                    }
                    ariaLabel={`Excluir documento ${document.title}`}
                />
            ) : null}
        </TableListRowActions>
    );
}

function documentColumns(permissions: Permissions): TableListColumn<StudentDocument>[] {
    return [
        {
            id: 'title',
            label: 'Título',
            width: '25%',
            fixed: 'start',
            render: (document) => (
                <>
                    <strong>{document.title}</strong>
                    <small className="studentDetails__secondary">{document.original_name}</small>
                </>
            ),
        },
        { id: 'type', label: 'Tipo', width: '13%', render: (document) => document.type_label },
        {
            id: 'semester',
            label: 'Semestre',
            width: '13%',
            render: (document) => document.semester_label ?? 'Não informado',
        },
        {
            id: 'size',
            label: 'Tamanho',
            width: '11%',
            render: (document) => fileSizeLabel(document.file_size),
        },
        {
            id: 'upload',
            label: 'Upload',
            width: '16%',
            render: (document) => dateTimeLabel(document.created_at),
        },
        {
            id: 'actions',
            label: 'Ações',
            width: '22%',
            fixed: 'end',
            render: (document) => <DocumentActions document={document} permissions={permissions} />,
        },
    ];
}

function StudentPeis({ student, permissions }: StudentDocumentsRecordProps): React.JSX.Element {
    const createAction = permissions['pei.create'] ? (
        <TableListCreateButton
            href={peiUrls.create(student.id)}
            ariaLabel="Cadastrar PEI do aluno"
        />
    ) : undefined;

    return (
        <FormSection
            id="peis"
            title="PEIs (Plano Educacional Individualizado)"
            iconClass="fa fa-map-o"
            variant="inline"
        >
            <StudentRecordTable
                ariaLabel="Planos Educacionais Individualizados do aluno"
                columns={peiColumns(permissions)}
                rows={student.peis ?? []}
                rowKey={(pei) => pei.id}
                emptyMessage="Nenhum PEI do aluno encontrado."
                actions={createAction}
            />
        </FormSection>
    );
}

function StudentDocuments({
    student,
    permissions,
}: StudentDocumentsRecordProps): React.JSX.Element {
    const createAction = permissions['student-document.create'] ? (
        <TableListCreateButton
            href={studentDocumentUrls(student.id).create}
            ariaLabel="Cadastrar documento do aluno"
        />
    ) : undefined;

    return (
        <FormSection
            id="documents"
            title="Documentos do Aluno"
            iconClass="fa fa-folder-open-o"
            variant="inline"
        >
            <StudentRecordTable
                ariaLabel="Documentos do aluno"
                columns={documentColumns(permissions)}
                rows={student.documents ?? []}
                rowKey={(document) => document.id}
                emptyMessage="Nenhum documento do aluno encontrado."
                actions={createAction}
            />
        </FormSection>
    );
}

/** Abas de PEIs e documentos do aluno, conforme as permissões. */
export function createStudentDocumentTabs({
    student,
    permissions,
}: StudentDocumentsRecordProps): TabItem[] {
    const items: TabItem[] = [];

    if (permissions['pei.view']) {
        items.push({
            id: 'peis',
            label: 'PEIs',
            accessibleLabel: 'Planos Educacionais Individualizados',
            icon: 'fa fa-map-o',
            content: <StudentPeis student={student} permissions={permissions} />,
        });
    }

    if (permissions['student-document.view']) {
        items.push({
            id: 'documents',
            label: 'Documentos',
            icon: 'fa fa-folder-open-o',
            content: <StudentDocuments student={student} permissions={permissions} />,
        });
    }

    return items;
}

import { peiUrls } from '@/components/Peis/Peis.routes';
import {
    studentDocumentFileUrls,
    studentDocumentUrls,
} from '@/components/StudentDocuments/StudentDocuments.routes';
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
import type { Permissions, StudentRecord, StudentRecordTabId } from '../Students.types';
import StudentRecordFilters, {
    matchesStudentRecordFilter,
    useStudentRecordFilters,
} from './StudentRecordFilters';
import '@styles/components/Students/Details/StudentDetails.css';

type StudentPei = NonNullable<StudentRecord['peis']>[number];
type StudentDocument = NonNullable<StudentRecord['documents']>[number];

interface StudentDocumentsRecordProps {
    student: StudentRecord;
    permissions: Permissions;
    loadingTab?: StudentRecordTabId | null;
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
                        title="Visualizar"
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
                        title="Baixar"
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
                    title="Editar"
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

function StudentPeis({
    student,
    permissions,
    loadingTab,
}: StudentDocumentsRecordProps): React.JSX.Element {
    const peis = student.peis ?? [];
    const filters = useStudentRecordFilters(['semester', 'course', 'status'] as const);
    const filteredPeis = peis.filter(
        (pei) =>
            matchesStudentRecordFilter(pei.semester_label, filters.values.semester) &&
            matchesStudentRecordFilter(pei.course?.name, filters.values.course) &&
            (!filters.values.status ||
                filters.values.status === (pei.is_finished ? 'finished' : 'open')),
    );
    const createAction = permissions['pei.create'] ? (
        <TableListCreateButton
            href={peiUrls.create(student.id)}
            ariaLabel="Cadastrar PEI do aluno"
        />
    ) : undefined;

    return (
        <div id="peis">
            <StudentRecordTable
                ariaLabel="Planos Educacionais Individualizados do aluno"
                columns={peiColumns(permissions)}
                rows={filteredPeis}
                rowKey={(pei) => pei.id}
                emptyMessage="Nenhum PEI do aluno encontrado."
                actions={createAction}
                loading={loadingTab === 'peis'}
                filters={
                    <StudentRecordFilters
                        idPrefix="student-pei-filter"
                        label="Filtrar Planos Educacionais Individualizados"
                        fields={[
                            { name: 'semester', label: 'Semestre' },
                            { name: 'course', label: 'Curso' },
                            {
                                name: 'status',
                                label: 'Status',
                                options: [
                                    { value: 'open', label: 'Em aberto' },
                                    { value: 'finished', label: 'Finalizado' },
                                ],
                            },
                        ]}
                        values={filters.values}
                        onChange={filters.update}
                        onClear={filters.clear}
                    />
                }
            />
        </div>
    );
}

function StudentDocuments({
    student,
    permissions,
    loadingTab,
}: StudentDocumentsRecordProps): React.JSX.Element {
    const documents = student.documents ?? [];
    const filters = useStudentRecordFilters(['document', 'type', 'semester'] as const);
    const filteredDocuments = documents.filter(
        (document) =>
            matchesStudentRecordFilter(
                `${document.title} ${document.original_name}`,
                filters.values.document,
            ) &&
            (!filters.values.type || document.type_label === filters.values.type) &&
            matchesStudentRecordFilter(document.semester_label, filters.values.semester),
    );
    const typeOptions = Array.from(new Set(documents.map((document) => document.type_label))).map(
        (label) => ({ value: label, label }),
    );
    const createAction = permissions['student-document.create'] ? (
        <TableListCreateButton
            href={studentDocumentUrls(student.id).create}
            ariaLabel="Cadastrar documento do aluno"
        />
    ) : undefined;

    return (
        <div id="documents">
            <StudentRecordTable
                ariaLabel="Documentos do aluno"
                columns={documentColumns(permissions)}
                rows={filteredDocuments}
                rowKey={(document) => document.id}
                emptyMessage="Nenhum documento do aluno encontrado."
                actions={createAction}
                loading={loadingTab === 'documents'}
                filters={
                    <StudentRecordFilters
                        idPrefix="student-document-filter"
                        label="Filtrar documentos do aluno"
                        fields={[
                            { name: 'document', label: 'Título ou arquivo' },
                            { name: 'type', label: 'Tipo', options: typeOptions },
                            { name: 'semester', label: 'Semestre' },
                        ]}
                        values={filters.values}
                        onChange={filters.update}
                        onClear={filters.clear}
                    />
                }
            />
        </div>
    );
}

/** Abas de PEIs e documentos do aluno, conforme as permissões. */
export function createStudentDocumentTabs({
    student,
    permissions,
    loadingTab,
}: StudentDocumentsRecordProps): TabItem[] {
    const items: TabItem[] = [];

    if (permissions['pei.view']) {
        items.push({
            id: 'peis',
            label: 'PEIs',
            accessibleLabel: 'Planos Educacionais Individualizados',
            icon: 'fa fa-map-o',
            content: (
                <StudentPeis
                    student={student}
                    permissions={permissions}
                    loadingTab={loadingTab}
                />
            ),
        });
    }

    if (permissions['student-document.view']) {
        items.push({
            id: 'documents',
            label: 'Documentos',
            icon: 'fa fa-folder-open-o',
            content: (
                <StudentDocuments
                    student={student}
                    permissions={permissions}
                    loadingTab={loadingTab}
                />
            ),
        });
    }

    return items;
}

import FormSection from '@/components/Forms/FormSection/FormSection';
import {
    TableListCard,
    TableListRowActions,
    TableListScroll,
    TableListSummary,
    TableListTable,
    type TableListColumn,
} from '@/components/Tables/TableList/TableList';
import { teacherPortalUrls } from '../TeacherPortal.routes';
import type { TeacherPortalDocument } from '../TeacherPortal.types';

const listLabel = 'Laudo e documentos do aluno';

const documentColumns: TableListColumn<TeacherPortalDocument>[] = [
    {
        id: 'type',
        label: 'Tipo',
        width: '24%',
        minWidth: 100,
        fixed: 'start',
        render: (document) => document.type_label ?? 'Não informado',
    },
    {
        id: 'title',
        label: 'Título',
        width: '40%',
        minWidth: 130,
        render: (document) => document.title ?? 'Sem título',
    },
    {
        id: 'created_at',
        label: 'Enviado em',
        width: '20%',
        minWidth: 90,
        render: (document) => document.created_at ?? '---',
    },
    {
        id: 'actions',
        label: 'Ações',
        width: '16%',
        minWidth: 90,
        fixed: 'end',
        render: (document) => (
            <TableListRowActions
                view={{
                    href: teacherPortalUrls.document(document.id),
                    label: `Ver documento ${document.title ?? ''}`.trim(),
                    newTab: true,
                }}
            />
        ),
    },
];

/** Aba "Laudo e Documentos": todos os anexos do aluno, abertos em outra aba. */
export default function TeacherPortalDocuments({
    documents,
}: {
    documents: TeacherPortalDocument[];
}): React.JSX.Element {
    const summary = `${documents.length} ${documents.length === 1 ? 'registro' : 'registros'}`;

    return (
        <FormSection
            id="laudo-documentos"
            title="Laudo e Documentos"
            iconClass="fa fa-file-text-o"
            variant="inline"
        >
            <TableListCard aria-label={listLabel}>
                <TableListScroll aria-label={listLabel}>
                    <TableListTable
                        columns={documentColumns}
                        summary={summary}
                        rows={documents}
                        rowKey={(document) => document.id}
                        emptyMessage="Nenhum documento anexado para este aluno."
                    />
                </TableListScroll>
                <TableListSummary>{summary}</TableListSummary>
            </TableListCard>
        </FormSection>
    );
}

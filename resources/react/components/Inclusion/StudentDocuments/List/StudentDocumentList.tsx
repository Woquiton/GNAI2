import { useMemo } from 'react';
import {
    TableListFooter,
    TableListRowActions,
    TableListScroll,
    TableListTable,
    type TableListColumn,
} from '@/components/Tables/TableList/TableList';
import Button from '@/components/UI/Button/Button';
import { studentDocumentFileUrls } from '../StudentDocuments.routes';
import type {
    StudentDocumentListPermissions,
    StudentDocumentListRecord,
    StudentDocumentPaginator,
} from '../StudentDocuments.types';
import { studentDocumentColumns } from './studentDocumentColumns';
import './StudentDocumentList.css';

interface StudentDocumentListProps {
    documents: StudentDocumentPaginator;
    permissions: StudentDocumentListPermissions;
    loading: boolean;
    processing: boolean;
    onDelete: (document: StudentDocumentListRecord) => void;
    onPageSelect: (page: number) => void;
}

/** Ações da linha: visualizar (outra aba), baixar e editar antes da exclusão. */
function StudentDocumentRowActions({
    document,
    permissions,
    processing,
    onDelete,
}: {
    document: StudentDocumentListRecord;
    permissions: StudentDocumentListPermissions;
    processing: boolean;
    onDelete: (document: StudentDocumentListRecord) => void;
}): React.JSX.Element {
    const fileActions =
        permissions.view || permissions.update ? (
            <>
                {permissions.view ? (
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
                            download
                            size="sm"
                            tone="cancel"
                            iconOnly
                            leftIconClass="fa fa-download"
                            aria-label={`Baixar documento ${document.title}`}
                        />
                    </>
                ) : null}
                {permissions.update ? (
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
            </>
        ) : null;

    return (
        <TableListRowActions
            remove={
                permissions.delete && {
                    label: `Excluir documento ${document.title}`,
                    disabled: processing,
                    onClick: () => onDelete(document),
                }
            }
        >
            {fileActions}
        </TableListRowActions>
    );
}

export default function StudentDocumentList({
    documents,
    permissions,
    loading,
    processing,
    onDelete,
    onPageSelect,
}: StudentDocumentListProps): React.JSX.Element {
    const columns = useMemo<TableListColumn<StudentDocumentListRecord>[]>(
        () => [
            ...studentDocumentColumns,
            {
                id: 'actions',
                label: 'Ações',
                width: '22%',
                fixed: 'end',
                render: (document) => (
                    <StudentDocumentRowActions
                        document={document}
                        permissions={permissions}
                        processing={processing}
                        onDelete={onDelete}
                    />
                ),
            },
        ],
        [permissions, processing, onDelete],
    );

    return (
        <>
            <TableListScroll aria-label="Tabela de documentos do aluno">
                <TableListTable
                    columns={columns}
                    rows={documents.data}
                    rowKey={(document) => document.id}
                    page={documents}
                    emptyMessage="Nenhum documento do aluno encontrado."
                />
            </TableListScroll>
            <TableListFooter
                page={documents}
                disabled={loading}
                paginationLabel="Paginação de documentos"
                onSelect={onPageSelect}
            />
        </>
    );
}

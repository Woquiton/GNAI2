import type { TableListColumn } from '@/components/Tables/TableList/TableList';
import { dateTimeLabel, fileSizeLabel } from '@/utils/formatters';
import type { StudentDocumentListRecord } from '../StudentDocuments.types';

const NOT_INFORMED = 'Não informado';

/** Colunas da listagem; o nome original do arquivo começa oculto no seletor de colunas. */
export const studentDocumentColumns: TableListColumn<StudentDocumentListRecord>[] = [
    {
        id: 'title',
        label: 'Título',
        width: '25%',
        fixed: 'start',
        render: (document) => (
            <div className="studentDocumentList__title">
                <strong>{document.title}</strong>
                <small>{document.original_name}</small>
            </div>
        ),
    },
    { id: 'type', label: 'Tipo', width: '13%', render: (document) => document.type_label },
    {
        id: 'semester',
        label: 'Semestre',
        width: '13%',
        render: (document) => document.semester_label ?? NOT_INFORMED,
    },
    {
        id: 'size',
        label: 'Tamanho',
        width: '11%',
        render: (document) => fileSizeLabel(document.file_size),
    },
    {
        id: 'upload',
        label: 'Data de upload',
        width: '16%',
        render: (document) => dateTimeLabel(document.created_at),
    },
    {
        id: 'originalName',
        label: 'Nome original do arquivo',
        width: '16%',
        defaultVisible: false,
        render: (document) => document.original_name || NOT_INFORMED,
    },
];

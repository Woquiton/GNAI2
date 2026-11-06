import FileDropzone from '@/components/Forms/FileDropzone/FileDropzone';
import FormField from '@/components/Forms/FormField/FormField';
import { fieldDescribedBy } from '@/components/Forms/FormField/fieldDescription';
import FormSection from '@/components/Forms/FormSection/FormSection';
import { studentDocumentAcceptedFiles } from '../StudentDocuments.constants';
import type { StudentDocumentRecord } from '../StudentDocuments.types';
import { STUDENT_DOCUMENT_TOUR_TARGETS } from '../studentDocumentTours';
import type { StudentDocumentFormSectionProps } from './StudentDocumentForm.types';

interface StudentDocumentFileFieldsProps extends StudentDocumentFormSectionProps {
    studentDocument?: StudentDocumentRecord;
    onSelect: (file: File | undefined) => void;
    onReject: (message: string) => void;
    onClear: () => void;
}

/** Arquivo atual (na edição), seleção do novo arquivo e remoção da seleção. */
export default function StudentDocumentFileFields({
    form,
    errors,
    disabled,
    editing,
    studentDocument,
    onSelect,
    onReject,
    onClear,
}: StudentDocumentFileFieldsProps): React.JSX.Element {
    const fileId = 'student-document-file';
    const selectedFile = form.data.file;
    const fileHint = editing
        ? 'Deixe em branco para manter o arquivo atual. Formatos: PDF, DOC, DOCX, Imagens (Máx: 10MB).'
        : 'Formatos aceitos: PDF, DOC, DOCX, JPG ou PNG. Tamanho máximo: 10MB.';
    const dropMessage = editing
        ? 'Arraste o novo arquivo aqui ou clique para selecionar'
        : 'Arraste o arquivo aqui ou clique para selecionar';

    return (
        <FormSection
            id="student-document-file-section"
            title="Arquivo"
            variant="inline"
            iconClass="fa fa-paperclip"
            tourTarget={STUDENT_DOCUMENT_TOUR_TARGETS.file}
        >
            {studentDocument ? (
                <div className="studentDocumentForm__current">
                    <i className="fa fa-file-text-o" aria-hidden="true" />
                    <p>
                        <strong>Arquivo Atual:</strong> {studentDocument.original_name}
                    </p>
                </div>
            ) : null}
            <FormField
                id={fileId}
                label={editing ? 'Substituir Arquivo' : 'Selecionar Arquivo'}
                hint={fileHint}
                hintLabel="Formatos e tamanho do arquivo"
                error={errors.file}
                requiredIndicator={!editing}
            >
                <FileDropzone
                    compact
                    message={dropMessage}
                    acceptedFiles={studentDocumentAcceptedFiles}
                    onFilesChange={(files) => {
                        // Um arquivo por documento: o último escolhido substitui o anterior.
                        if (files.length) onSelect(files[files.length - 1]);
                        else onClear();
                    }}
                    onError={(_file, message) => onReject(message)}
                    onLoadError={() =>
                        onReject(
                            'Não foi possível carregar o seletor de arquivos. Atualize a página e tente novamente.',
                        )
                    }
                    selection={{
                        id: fileId,
                        name: 'file',
                        disabled,
                        invalid: Boolean(errors.file),
                        describedBy: fieldDescribedBy(fileId, { error: errors.file }),
                        files: selectedFile ? [selectedFile] : [],
                    }}
                />
            </FormField>
        </FormSection>
    );
}

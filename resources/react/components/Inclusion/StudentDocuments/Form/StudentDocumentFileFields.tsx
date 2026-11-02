import FileUploadButton from '@/components/Forms/FileUploadButton/FileUploadButton';
import FormField from '@/components/Forms/FormField/FormField';
import { fieldDescribedBy } from '@/components/Forms/FormField/fieldDescription';
import FormSection from '@/components/Forms/FormSection/FormSection';
import Button from '@/components/UI/Button/Button';
import { studentDocumentAcceptedFiles } from '../StudentDocuments.constants';
import type { StudentDocumentRecord } from '../StudentDocuments.types';
import type { StudentDocumentFormSectionProps } from './StudentDocumentForm.types';

interface StudentDocumentFileFieldsProps extends StudentDocumentFormSectionProps {
    studentDocument?: StudentDocumentRecord;
    fileInputKey: number;
    onSelect: (file: File | undefined) => void;
    onClear: () => void;
}

/** Arquivo atual (na edição), seleção do novo arquivo e remoção da seleção. */
export default function StudentDocumentFileFields({
    form,
    errors,
    disabled,
    editing,
    studentDocument,
    fileInputKey,
    onSelect,
    onClear,
}: StudentDocumentFileFieldsProps): React.JSX.Element {
    const fileId = 'student-document-file';
    const selectedFile = form.data.file;
    const fileHint = editing
        ? 'Deixe em branco para manter o arquivo atual. Formatos: PDF, DOC, DOCX, Imagens (Máx: 10MB).'
        : 'Formatos aceitos: PDF, DOC, DOCX, JPG ou PNG. Tamanho máximo: 10MB.';

    return (
        <FormSection
            id="student-document-file-section"
            title="Arquivo"
            variant="inline"
            iconClass="fa fa-paperclip"
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
                error={errors.file}
                requiredIndicator={!editing}
            >
                <div className="studentDocumentForm__file">
                    <FileUploadButton
                        key={fileInputKey}
                        id={fileId}
                        name="file"
                        label={selectedFile ? 'Trocar arquivo' : 'Selecionar arquivo'}
                        accept={studentDocumentAcceptedFiles}
                        required={!editing}
                        disabled={disabled}
                        aria-invalid={Boolean(errors.file)}
                        aria-describedby={fieldDescribedBy(fileId, {
                            error: errors.file,
                            hint: true,
                        })}
                        onChange={(event) => onSelect(event.currentTarget.files?.[0])}
                    />
                    {selectedFile ? (
                        <>
                            <span className="studentDocumentForm__fileName">
                                <i className="fa fa-file-o" aria-hidden="true" />
                                {selectedFile.name}
                            </span>
                            <Button
                                tone="cancel"
                                size="sm"
                                label="Remover"
                                title={`Remover ${selectedFile.name}`}
                                aria-label={`Remover arquivo selecionado ${selectedFile.name}`}
                                disabled={disabled}
                                onClick={onClear}
                            />
                        </>
                    ) : null}
                </div>
            </FormField>
        </FormSection>
    );
}

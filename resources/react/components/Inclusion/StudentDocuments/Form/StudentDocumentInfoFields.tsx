import { optionsFromRecord } from '@/components/Forms/FormFields/fieldOptions';
import { SelectInputField, TextInputField } from '@/components/Forms/FormFields/FormFields';
import FormField from '@/components/Forms/FormField/FormField';
import FormGrid, { FormGridWide } from '@/components/Forms/FormGrid/FormGrid';
import FormSection from '@/components/Forms/FormSection/FormSection';
import TextInput from '@/components/Forms/TextInput/TextInput';
import type { StudentDocumentFormOptions } from '../StudentDocuments.types';
import type { StudentDocumentFormSectionProps } from './StudentDocumentForm.types';

interface StudentDocumentInfoFieldsProps extends StudentDocumentFormSectionProps {
    types: StudentDocumentFormOptions['types'];
    semester: StudentDocumentFormOptions['semester'];
}

/** Título, tipo e semestre atual (definido pelo servidor, somente leitura). */
export default function StudentDocumentInfoFields({
    form,
    errors,
    disabled,
    editing,
    types,
    semester,
}: StudentDocumentInfoFieldsProps): React.JSX.Element {
    return (
        <FormSection
            id="student-document-information"
            title={editing ? 'Informações Gerais' : 'Informações do Documento'}
            variant="inline"
            iconClass="fa fa-file-text-o"
        >
            <FormGrid columns={2}>
                <FormGridWide>
                    <TextInputField
                        id="student-document-title"
                        name="title"
                        label="Título do Documento"
                        required
                        maxLength={255}
                        placeholder={editing ? undefined : 'Ex: Laudo Médico Psicológico 2024'}
                        value={form.data.title}
                        error={errors.title}
                        onChange={(value) => form.setData('title', value)}
                    />
                </FormGridWide>
                <SelectInputField
                    id="student-document-type"
                    name="type"
                    label="Tipo de Documento"
                    required
                    disabled={disabled}
                    options={optionsFromRecord(types)}
                    value={form.data.type}
                    error={errors.type}
                    onChange={(value) => form.setData('type', value)}
                />
                {/* Somente leitura: o semestre é definido pelo servidor e não é enviado. */}
                <FormField id="student-document-semester" label="Semestre Atual">
                    <TextInput
                        id="student-document-semester"
                        value={semester?.label ?? 'Definido automaticamente'}
                        readOnly
                    />
                </FormField>
            </FormGrid>
        </FormSection>
    );
}

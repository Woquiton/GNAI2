import FieldError from '@/components/Forms/FormField/FieldError';
import { fieldErrorId } from '@/components/Forms/FormField/fieldDescription';
import ToggleControl from '@/components/Forms/ToggleControl/ToggleControl';
import { optionsFromRecord } from '@/components/Forms/FormFields/fieldOptions';
import { SelectInputField, TextInputField } from '@/components/Forms/FormFields/FormFields';
import FormField from '@/components/Forms/FormField/FormField';
import FormGrid, { FormGridWide } from '@/components/Forms/FormGrid/FormGrid';
import FormSection from '@/components/Forms/FormSection/FormSection';
import TextInput from '@/components/Forms/TextInput/TextInput';
import type { StudentDocumentFormOptions } from '../StudentDocuments.types';
import { STUDENT_DOCUMENT_TOUR_TARGETS } from '../studentDocumentTours';
import type { StudentDocumentFormSectionProps } from './StudentDocumentForm.types';

interface StudentDocumentInfoFieldsProps extends StudentDocumentFormSectionProps {
    types: StudentDocumentFormOptions['types'];
    customTypes: string[];
    semester: StudentDocumentFormOptions['semester'];
}

/** Título, tipo e semestre atual (definido pelo servidor, somente leitura). */
export default function StudentDocumentInfoFields({
    form,
    errors,
    disabled,
    editing,
    types,
    customTypes,
    semester,
}: StudentDocumentInfoFieldsProps): React.JSX.Element {
    const customPrefix = 'custom:';
    const isLaudo = form.data.type === 'technical report';
    const visibilityId = 'student-document-teacher-portal';
    const visibilityDescription = isLaudo
        ? 'Laudos são sempre mostrados no portal do professor. Essa opção não pode ser desativada.'
        : 'Ative para permitir que os professores vinculados ao aluno vejam este documento no portal.';
    const selectedType =
        form.data.type === 'other' && form.data.custom_type
            ? `${customPrefix}${form.data.custom_type}`
            : form.data.type;
    const availableCustomTypes = Array.from(
        new Set([...customTypes, form.data.custom_type].filter(Boolean)),
    );
    const typeOptions = [
        ...optionsFromRecord(types),
        ...availableCustomTypes.map((name) => ({ value: `${customPrefix}${name}`, label: name })),
    ];

    function selectType(value: string): void {
        const custom = value.startsWith(customPrefix);
        form.setData((data) => ({
            ...data,
            type: custom ? 'other' : value,
            custom_type: custom ? value.slice(customPrefix.length) : '',
            show_in_teacher_portal:
                value === 'technical report' ||
                (data.type !== 'technical report' && data.show_in_teacher_portal),
        }));
    }

    function createType(name: string): void {
        const normalizedName = name.trim().replace(/\s+/g, ' ');
        const existing = typeOptions.find(
            (option) =>
                option.label.toLocaleLowerCase('pt-BR') ===
                normalizedName.toLocaleLowerCase('pt-BR'),
        );
        selectType(existing?.value ?? `${customPrefix}${normalizedName}`);
    }

    return (
        <FormSection
            id="student-document-information"
            title={editing ? 'Informações Gerais' : 'Informações do Documento'}
            variant="inline"
            iconClass="fa fa-file-text-o"
            tourTarget={STUDENT_DOCUMENT_TOUR_TARGETS.information}
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
                    options={typeOptions}
                    value={selectedType}
                    error={errors.type}
                    hint="Selecione um tipo ou digite um novo nome na busca e pressione Enter. O nome fica disponível depois de salvar o documento."
                    onChange={selectType}
                    onCreateOption={createType}
                />
                {form.data.type === 'other' ? (
                    <TextInputField
                        id="student-document-custom-type"
                        name="custom_type"
                        label="Nome do tipo de documento"
                        maxLength={100}
                        disabled={disabled}
                        value={form.data.custom_type}
                        error={errors.custom_type}
                        hint="Informe um nome para reutilizá-lo em outros documentos. Deixe em branco para usar Outro."
                        onChange={(value) => form.setData('custom_type', value)}
                    />
                ) : null}
                <FormGridWide>
                    <div data-tour={STUDENT_DOCUMENT_TOUR_TARGETS.visibility}>
                        <ToggleControl
                            id={visibilityId}
                            name="show_in_teacher_portal"
                            label="Mostrar no portal do professor"
                            description={visibilityDescription}
                            checked={isLaudo || form.data.show_in_teacher_portal}
                            disabled={disabled || isLaudo}
                            invalid={Boolean(errors.show_in_teacher_portal)}
                            describedBy={
                                errors.show_in_teacher_portal ? fieldErrorId(visibilityId) : undefined
                            }
                            onChange={(checked) => form.setData('show_in_teacher_portal', checked)}
                        />
                        <FieldError id={visibilityId} error={errors.show_in_teacher_portal} />
                    </div>
                </FormGridWide>
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

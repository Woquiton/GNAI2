import FormActions from '@/components/Forms/FormActions/FormActions';
import { RichTextField, TextInputField } from '@/components/Forms/FormFields/FormFields';
import FormGrid, { FormGridWide } from '@/components/Forms/FormGrid/FormGrid';
import FormLayout from '@/components/Forms/FormLayout/FormLayout';
import FormSection from '@/components/Forms/FormSection/FormSection';
import ToggleControl from '@/components/Forms/ToggleControl/ToggleControl';
import Button from '@/components/UI/Button/Button';
import CardBox from '@/components/UI/CardBox/CardBox';
import { positionUrls } from '../Positions.routes';
import type { GroupedPositionPermissions, PositionRecord } from '../Positions.types';
import PositionPermissionsFields from './PositionPermissionsFields';
import { usePositionForm } from './usePositionForm';

interface PositionFormProps {
    permissions: GroupedPositionPermissions;
    position?: PositionRecord;
}

function submissionStatus(processing: boolean, editing: boolean): string | undefined {
    if (!processing) {
        return undefined;
    }

    return editing ? 'Salvando alterações do cargo...' : 'Cadastrando cargo...';
}

/** Cadastro e edição de cargos: informações e permissões vinculadas. */
export default function PositionForm({
    permissions,
    position,
}: PositionFormProps): React.JSX.Element {
    const {
        form,
        errors,
        permissionsError,
        formRef,
        editorFailed,
        reportEditorFailure,
        togglePermissions,
        save,
    } = usePositionForm(position);
    const editing = Boolean(position);

    return (
        <FormLayout
            ref={formRef}
            aria-label={editing ? 'Editar cargo' : 'Cadastrar cargo'}
            aria-busy={form.processing}
            onSubmit={(event) => {
                event.preventDefault();
                save();
            }}
        >
            <CardBox>
                <fieldset disabled={form.processing}>
                    <FormSection
                        id="position-information"
                        title="Identificação"
                        variant="inline"
                        iconClass="fa fa-briefcase"
                    >
                        <FormGrid columns={2}>
                            <TextInputField
                                id="position-name"
                                name="name"
                                label="Nome do Cargo"
                                required
                                maxLength={255}
                                placeholder="Ex: Professor AEE, Psicólogo..."
                                value={form.data.name}
                                error={errors.name}
                                onChange={(value) => form.setData('name', value)}
                            />
                            <FormGridWide>
                                <RichTextField
                                    id="position-description"
                                    label="Descrição"
                                    defaultValue={form.data.description}
                                    height={120}
                                    disabled={form.processing}
                                    error={errors.description}
                                    onLoadError={() =>
                                        reportEditorFailure('description', 'descrição')
                                    }
                                    onChange={(html) => form.setData('description', html)}
                                />
                            </FormGridWide>
                            <ToggleControl
                                id="position-active"
                                name="is_active"
                                size="small"
                                label="Cargo Ativo"
                                checked={form.data.is_active}
                                disabled={form.processing}
                                onChange={(checked) => form.setData('is_active', checked)}
                            />
                        </FormGrid>
                    </FormSection>
                    <PositionPermissionsFields
                        permissions={permissions}
                        selected={form.data.permissions}
                        error={permissionsError}
                        disabled={form.processing}
                        onToggle={togglePermissions}
                    />
                </fieldset>
            </CardBox>
            <FormActions status={submissionStatus(form.processing, editing)}>
                <Button
                    href={position ? positionUrls.show(position.id) : positionUrls.index}
                    tone="cancel"
                    label="Cancelar"
                    title="Cancelar e voltar"
                    aria-label="Cancelar e voltar"
                    disabled={form.processing}
                />
                <Button
                    type="submit"
                    tone="save"
                    leftIconClass="fa fa-check"
                    label="Salvar"
                    title="Salvar cargo"
                    aria-label={form.processing ? 'Salvando cargo' : 'Salvar cargo'}
                    disabled={form.processing || editorFailed}
                />
            </FormActions>
        </FormLayout>
    );
}

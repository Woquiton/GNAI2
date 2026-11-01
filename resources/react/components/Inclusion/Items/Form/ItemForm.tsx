import FormActions from '@/components/Forms/FormActions/FormActions';
import FormLayout from '@/components/Forms/FormLayout/FormLayout';
import Button from '@/components/UI/Button/Button';
import CardBox from '@/components/UI/CardBox/CardBox';
import { itemUrls } from '../Items.routes';
import type { ItemFormOptions, ItemRecord } from '../Items.types';
import ItemIdentificationFields from './ItemIdentificationFields';
import ItemInspectionFields from './ItemInspectionFields';
import ItemManagementFields from './ItemManagementFields';
import type { ItemFormMode } from './ItemForm.types';
import { useItemForm } from './useItemForm';

interface ItemFormProps {
    mode: ItemFormMode;
    options: ItemFormOptions;
    item?: ItemRecord;
    cloneSource?: ItemRecord | null;
    activeLoans?: number;
}

function submissionStatus(processing: boolean, percentage: number | undefined): string {
    if (!processing) {
        return '';
    }

    return percentage !== undefined ? `Enviando arquivos: ${percentage}%` : 'Salvando item...';
}

/** Cadastro, clonagem e edição de itens com vistoria e evidências. */
export default function ItemForm({
    mode,
    options,
    item,
    cloneSource,
    activeLoans = 0,
}: ItemFormProps): React.JSX.Element {
    const { form, errors, formRef, editorFailed, reportEditorFailure, save } = useItemForm({
        mode,
        options,
        item,
        cloneSource,
    });
    const sectionProps = { form, errors, disabled: form.processing };
    const submitLabel = form.processing
        ? 'Salvando item'
        : mode === 'create'
          ? 'Cadastrar item'
          : 'Salvar item';

    return (
        <FormLayout
            ref={formRef}
            aria-label={mode === 'create' ? 'Cadastrar item' : 'Editar item'}
            aria-busy={form.processing}
            encType="multipart/form-data"
            onSubmit={(event) => {
                event.preventDefault();
                save();
            }}
        >
            <CardBox>
                <fieldset disabled={form.processing}>
                    <ItemIdentificationFields
                        {...sectionProps}
                        options={options}
                        onEditorFailure={(message) => reportEditorFailure('notes', message)}
                    />
                    <ItemManagementFields
                        {...sectionProps}
                        resourceStatuses={options.resourceStatuses}
                        activeLoans={activeLoans}
                        showLoanWarning={mode === 'edit' && activeLoans > 0}
                    />
                    <ItemInspectionFields
                        {...sectionProps}
                        mode={mode}
                        options={options}
                        onEditorFailure={(message) =>
                            reportEditorFailure('inspection.description', message)
                        }
                    />
                </fieldset>
            </CardBox>
            <FormActions status={submissionStatus(form.processing, form.progress?.percentage)}>
                <Button
                    href={item ? itemUrls.show(item.id) : itemUrls.index}
                    tone="cancel"
                    label="Cancelar"
                    aria-label="Cancelar e voltar"
                    disabled={form.processing}
                />
                {options.can.submit ? (
                    <Button
                        type="submit"
                        tone="save"
                        leftIconClass="fa fa-check"
                        label="Salvar"
                        title="Salvar item"
                        aria-label={submitLabel}
                        disabled={form.processing || editorFailed}
                    />
                ) : null}
            </FormActions>
        </FormLayout>
    );
}

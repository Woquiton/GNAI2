import FormActions from '@/components/Forms/FormActions/FormActions';
import Button from '@/components/UI/Button/Button';
import { barrierCategoryUrls } from '../BarrierCategories.routes';
import type { BarrierCategoryDetailsPermissions } from '../BarrierCategories.types';

interface BarrierCategoryDetailsActionsProps {
    categoryId: number;
    permissions: BarrierCategoryDetailsPermissions;
    deleting: boolean;
    onDelete: () => void;
}

/** Rodapé fixo da visualização: voltar, editar e excluir. */
export default function BarrierCategoryDetailsActions({
    categoryId,
    permissions,
    deleting,
    onDelete,
}: BarrierCategoryDetailsActionsProps): React.JSX.Element {
    return (
        <FormActions>
            <Button
                href={barrierCategoryUrls.index}
                tone="cancel"
                label="Voltar"
                aria-label="Voltar para categorias de barreiras"
                disabled={deleting}
            />
            {permissions.edit ? (
                <Button
                    href={barrierCategoryUrls.edit(categoryId)}
                    tone="warning"
                    leftIconClass="fa fa-pencil"
                    label="Editar"
                    aria-label="Editar categoria de barreira"
                    disabled={deleting}
                />
            ) : null}
            {permissions.destroy ? (
                <Button
                    tone="dark-red"
                    leftIconClass="fa fa-trash-o"
                    label="Excluir"
                    aria-label="Excluir categoria de barreira"
                    disabled={deleting}
                    onClick={onDelete}
                />
            ) : null}
        </FormActions>
    );
}

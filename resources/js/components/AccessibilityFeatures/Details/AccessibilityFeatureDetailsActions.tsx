import FormActions from '@/components/Forms/FormActions/FormActions';
import Button from '@/components/UI/Button/Button';
import { accessibilityFeatureUrls } from '../AccessibilityFeatures.routes';
import type { AccessibilityFeatureDetailsPermissions } from '../AccessibilityFeatures.types';
import { ACCESSIBILITY_FEATURE_TOUR_TARGETS } from '../accessibilityFeatureTours';

interface AccessibilityFeatureDetailsActionsProps {
    featureId: number;
    permissions: AccessibilityFeatureDetailsPermissions;
    deleting: boolean;
    onDelete: () => void;
}

/** Rodapé fixo da visualização: voltar, editar e excluir. */
export default function AccessibilityFeatureDetailsActions({
    featureId,
    permissions,
    deleting,
    onDelete,
}: AccessibilityFeatureDetailsActionsProps): React.JSX.Element {
    return (
        <FormActions tourTarget={ACCESSIBILITY_FEATURE_TOUR_TARGETS.detailsActions}>
            <Button
                href={accessibilityFeatureUrls.index}
                tone="cancel"
                label="Voltar"
                aria-label="Voltar para recursos de acessibilidade"
                disabled={deleting}
            />
            {permissions.edit ? (
                <Button
                    href={accessibilityFeatureUrls.edit(featureId)}
                    tone="warning"
                    leftIconClass="fa fa-pencil"
                    label="Editar"
                    aria-label="Editar recurso de acessibilidade"
                    disabled={deleting}
                />
            ) : null}
            {permissions.destroy ? (
                <Button
                    tone="dark-red"
                    leftIconClass="fa fa-trash-o"
                    label="Excluir"
                    aria-label="Excluir recurso de acessibilidade"
                    disabled={deleting}
                    onClick={onDelete}
                />
            ) : null}
        </FormActions>
    );
}

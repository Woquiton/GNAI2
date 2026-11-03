import FormActions from '@/components/Forms/FormActions/FormActions';
import Button from '@/components/UI/Button/Button';
import { institutionUrls } from '../Institutions.routes';
import type { InstitutionDetailsPermissions } from '../Institutions.types';
import { INSTITUTION_TOUR_TARGETS } from '../institutionTours';

interface InstitutionDetailsActionsProps {
    institutionId: number;
    permissions: InstitutionDetailsPermissions;
    deleting: boolean;
    onDelete: () => void;
}

/** Rodapé fixo da visualização: voltar, editar e excluir. */
export default function InstitutionDetailsActions({
    institutionId,
    permissions,
    deleting,
    onDelete,
}: InstitutionDetailsActionsProps): React.JSX.Element {
    return (
        <FormActions tourTarget={INSTITUTION_TOUR_TARGETS.detailsActions}>
            <Button href={institutionUrls.index} tone="cancel" label="Voltar" disabled={deleting} />
            {permissions.edit ? (
                <Button
                    href={institutionUrls.edit(institutionId)}
                    tone="warning"
                    leftIconClass="fa fa-pencil"
                    label="Editar"
                    disabled={deleting}
                />
            ) : null}
            {permissions.destroy ? (
                <Button
                    tone="dark-red"
                    leftIconClass="fa fa-trash-o"
                    label="Excluir"
                    disabled={deleting}
                    onClick={onDelete}
                />
            ) : null}
        </FormActions>
    );
}

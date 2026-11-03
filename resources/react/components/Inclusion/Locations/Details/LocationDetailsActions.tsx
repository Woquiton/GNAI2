import FormActions from '@/components/Forms/FormActions/FormActions';
import Button from '@/components/UI/Button/Button';
import { locationUrls } from '../Locations.routes';
import type { LocationDetailsPermissions } from '../Locations.types';
import { LOCATION_TOUR_TARGETS } from '../locationTours';

interface LocationDetailsActionsProps {
    locationId: number;
    permissions: LocationDetailsPermissions;
    deleting: boolean;
    onDelete: () => void;
}

/** Rodapé fixo da visualização: voltar, editar e excluir. */
export default function LocationDetailsActions({
    locationId,
    permissions,
    deleting,
    onDelete,
}: LocationDetailsActionsProps): React.JSX.Element {
    return (
        <FormActions tourTarget={LOCATION_TOUR_TARGETS.detailsActions}>
            <Button href={locationUrls.index} tone="cancel" label="Voltar" disabled={deleting} />
            {permissions.edit ? (
                <Button
                    href={locationUrls.edit(locationId)}
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

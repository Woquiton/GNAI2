import ChoiceControl from '@/components/Forms/ChoiceControl/ChoiceControl';
import FormSection from '@/components/Forms/FormSection/FormSection';
import GeoMap, { type GeoPoint } from '@/components/Inclusion/GeoMap/GeoMap';
import { notify } from '@/components/UI/NotificationToast/notify';
import { DEFAULT_BARRIER_ZOOM } from '../Barriers.constants';
import type { BarrierCategory, BarrierInstitution } from '../Barriers.types';
import './BarrierMapField.css';

interface BarrierMapFieldProps {
    point: GeoPoint;
    institution: BarrierInstitution | null;
    category: BarrierCategory | undefined;
    mapBlocked: boolean;
    showLocations: boolean;
    disabled: boolean;
    error?: string;
    onShowLocationsChange: (show: boolean) => void;
    onChange: (point: GeoPoint) => void;
}

function lockedMessage(
    institution: BarrierInstitution | null,
    category: BarrierCategory | undefined,
    mapBlocked: boolean,
): React.ReactNode {
    if (mapBlocked) {
        return (
            <>
                Mapa não se aplica à categoria
                <br />
                {category?.name}
            </>
        );
    }

    return institution ? undefined : 'Selecione um campus ou unidade para localizar a barreira.';
}

/**
 * Mapa da barreira enquadrado pelo campus, com os pontos de referência em cinza. Sem campus ou
 * com categoria que não se aplica ao mapa, a marcação fica bloqueada e explicada sobre o mapa.
 */
export default function BarrierMapField({
    point,
    institution,
    category,
    mapBlocked,
    showLocations,
    disabled,
    error,
    onShowLocationsChange,
    onChange,
}: BarrierMapFieldProps): React.JSX.Element {
    function warnBlocked(): void {
        notify({
            tone: 'warning',
            title: mapBlocked ? 'Mapa não aplicável' : 'Selecione a instituição',
            text: mapBlocked
                ? `O mapa não se aplica à categoria ${category?.name ?? 'selecionada'}.`
                : 'Escolha uma instituição antes de marcar a localização.',
        });
    }

    return (
        <FormSection
            id="barrier-map"
            title="Localização no Mapa"
            variant="inline"
            iconClass="fa fa-map-marker"
        >
            <ChoiceControl
                id="barrier-show-locations"
                type="checkbox"
                tone="purple"
                label="Exibir Locais (Cinza)"
                checked={showLocations}
                disabled={disabled}
                className="barrierMapField__toggle"
                onChange={onShowLocationsChange}
            />
            <GeoMap
                title="Localização da Barreira"
                value={point}
                zoom={institution?.default_zoom ?? DEFAULT_BARRIER_ZOOM}
                editable
                interactionEnabled={Boolean(institution) && !mapBlocked && !disabled}
                markerLabel="Barreira selecionada"
                reference={institution}
                showReferenceMarkers={showLocations}
                error={error}
                lockedMessage={lockedMessage(institution, category, mapBlocked)}
                onChange={onChange}
                onBlockedInteraction={warnBlocked}
            />
        </FormSection>
    );
}

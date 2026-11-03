import FormSection from '@/components/Forms/FormSection/FormSection';
import GeoMap, { type GeoMapReference } from '@/components/Inclusion/GeoMap/GeoMap';
import { formatCoordinate } from '@/components/Inclusion/GeoMap/GeoMap.utils';
import MapSplit, { MapSplitAside, MapSplitMain } from '@/components/Inclusion/MapSplit/MapSplit';
import CardBox from '@/components/UI/CardBox/CardBox';
import DetailField from '@/components/UI/DetailField/DetailField';
import DetailGrid from '@/components/UI/DetailGrid/DetailGrid';
import RichTextContent from '@/components/UI/RichTextContent/RichTextContent';
import TableLabel from '@/components/UI/TableLabel/TableLabel';
import { DEFAULT_LOCATION_ZOOM } from '../Locations.constants';
import type { LocationRecord, LocationShowProps } from '../Locations.types';
import { LOCATION_TOUR_TARGETS } from '../locationTours';

/** A instituição vinculada enquadra o mapa e aparece como sede. */
function institutionReference(location: LocationRecord): GeoMapReference | null {
    const { institution } = location;

    if (!institution) {
        return null;
    }

    return {
        id: institution.id,
        name: institution.name,
        latitude: Number(institution.latitude),
        longitude: Number(institution.longitude),
        default_zoom: institution.default_zoom,
    };
}

/** Identificação, configuração e posição do ponto no mapa da instituição. */
export default function LocationDetails({
    location,
    display,
}: Omit<LocationShowProps, 'can'>): React.JSX.Element {
    const point = { latitude: Number(location.latitude), longitude: Number(location.longitude) };

    return (
        <CardBox>
            <MapSplit wideAside>
                <MapSplitMain>
                    <FormSection
                        id="location-show-information"
                        tourTarget={LOCATION_TOUR_TARGETS.detailsIdentification}
                        title="Identificação"
                        variant="inline"
                        iconClass="fa fa-map-marker"
                    >
                        <DetailGrid>
                            <DetailField label="Instituição Base">
                                {location.institution?.name ?? 'Não informada'}
                            </DetailField>
                            <DetailField label="Nome do Local">{location.name}</DetailField>
                            <DetailField label="Tipo de Local">
                                {location.type || 'Não informado'}
                            </DetailField>
                            <DetailField label="Descrição/Observações" wide>
                                <RichTextContent html={display.descriptionHtml} />
                            </DetailField>
                        </DetailGrid>
                    </FormSection>
                    <FormSection
                        id="location-show-map-section"
                        tourTarget={LOCATION_TOUR_TARGETS.detailsSettings}
                        title="Configuração"
                        variant="inline"
                        iconClass="fa fa-globe"
                    >
                        <DetailGrid>
                            <DetailField label="Ativo no Sistema">
                                <TableLabel tone={location.is_active ? 'success' : 'inverse'}>
                                    {location.is_active ? 'Sim' : 'Não'}
                                </TableLabel>
                            </DetailField>
                            <DetailField label="Latitude">
                                {formatCoordinate(location.latitude)}
                            </DetailField>
                            <DetailField label="Longitude">
                                {formatCoordinate(location.longitude)}
                            </DetailField>
                        </DetailGrid>
                    </FormSection>
                </MapSplitMain>
                <MapSplitAside>
                    <FormSection
                        id="location-show-map"
                        tourTarget={LOCATION_TOUR_TARGETS.detailsMap}
                        title="Localização no Mapa"
                        variant="inline"
                        iconClass="fa fa-map-marker"
                    >
                        <GeoMap
                            title="Localização do Ponto"
                            value={point}
                            zoom={location.institution?.default_zoom ?? DEFAULT_LOCATION_ZOOM}
                            reference={institutionReference(location)}
                            markerLabel={location.name}
                        />
                    </FormSection>
                </MapSplitAside>
            </MapSplit>
        </CardBox>
    );
}

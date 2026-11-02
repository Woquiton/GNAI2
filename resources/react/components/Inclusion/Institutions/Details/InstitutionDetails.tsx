import FormSection from '@/components/Forms/FormSection/FormSection';
import GeoMap from '@/components/Inclusion/GeoMap/GeoMap';
import { formatCoordinate } from '@/components/Inclusion/GeoMap/GeoMap.utils';
import MapSplit, { MapSplitAside, MapSplitMain } from '@/components/Inclusion/MapSplit/MapSplit';
import CardBox from '@/components/UI/CardBox/CardBox';
import DetailField from '@/components/UI/DetailField/DetailField';
import DetailGrid from '@/components/UI/DetailGrid/DetailGrid';
import TableLabel from '@/components/UI/TableLabel/TableLabel';
import type { InstitutionRecord } from '../Institutions.types';

/** Identificação, configuração e sede no mapa. */
export default function InstitutionDetails({
    institution,
}: {
    institution: InstitutionRecord;
}): React.JSX.Element {
    const headquarters = {
        latitude: Number(institution.latitude),
        longitude: Number(institution.longitude),
    };

    return (
        <CardBox>
            <MapSplit wideAside>
                <MapSplitMain>
                    <FormSection
                        id="institution-show-information"
                        title="Identificação"
                        variant="inline"
                        iconClass="fa fa-university"
                    >
                        <DetailGrid>
                            <DetailField label="Nome da Instituição">
                                {institution.name}
                            </DetailField>
                            <DetailField label="Sigla / Nome Curto">
                                {institution.short_name || 'Não informada'}
                            </DetailField>
                            <DetailField label="Cidade">{institution.city}</DetailField>
                            <DetailField label="Estado">{institution.state}</DetailField>
                            <DetailField label="Bairro / Distrito">
                                {institution.district || 'Não informado'}
                            </DetailField>
                            <DetailField label="Rua / Logradouro">
                                {institution.address || 'Não informado'}
                            </DetailField>
                        </DetailGrid>
                    </FormSection>
                    <FormSection
                        id="institution-show-settings"
                        title="Configuração"
                        variant="inline"
                        iconClass="fa fa-globe"
                    >
                        <DetailGrid>
                            <DetailField label="Instituição Ativa">
                                <TableLabel tone={institution.is_active ? 'success' : 'inverse'}>
                                    {institution.is_active ? 'Sim' : 'Não'}
                                </TableLabel>
                            </DetailField>
                            <DetailField label="Zoom Padrão">
                                {institution.default_zoom}
                            </DetailField>
                            <DetailField label="Latitude Sede">
                                {formatCoordinate(institution.latitude)}
                            </DetailField>
                            <DetailField label="Longitude Sede">
                                {formatCoordinate(institution.longitude)}
                            </DetailField>
                        </DetailGrid>
                    </FormSection>
                </MapSplitMain>
                <MapSplitAside>
                    <FormSection
                        id="institution-show-map"
                        title="Localização no Mapa"
                        variant="inline"
                        iconClass="fa fa-map-marker"
                    >
                        <GeoMap
                            title="Localização da Instituição"
                            value={headquarters}
                            zoom={institution.default_zoom}
                            markerLabel={institution.name}
                        />
                    </FormSection>
                </MapSplitAside>
            </MapSplit>
        </CardBox>
    );
}

import FormSection from '@/components/Forms/FormSection/FormSection';
import GeoMap, { type GeoMapReference } from '@/components/Inclusion/GeoMap/GeoMap';
import {
    formatCoordinate,
    GEO_MAP_DEFAULT_CENTER,
    pointFromRecord,
} from '@/components/Inclusion/GeoMap/GeoMap.utils';
import InspectionHistoryTable from '@/components/Inclusion/Inspections/InspectionHistoryTable/InspectionHistoryTable';
import MapSplit, { MapSplitAside, MapSplitMain } from '@/components/Inclusion/MapSplit/MapSplit';
import CardBox from '@/components/UI/CardBox/CardBox';
import DetailField from '@/components/UI/DetailField/DetailField';
import DetailGrid from '@/components/UI/DetailGrid/DetailGrid';
import ExpandableContent from '@/components/UI/ExpandableContent/ExpandableContent';
import RichTextContent from '@/components/UI/RichTextContent/RichTextContent';
import TableLabel from '@/components/UI/TableLabel/TableLabel';
import TagList from '@/components/UI/TagList/TagList';
import { dateLabel } from '@/utils/formatters';
import {
    barrierPriorityLabels,
    barrierPriorityTone,
    DEFAULT_BARRIER_ZOOM,
} from '../Barriers.constants';
import { barrierUrls } from '../Barriers.routes';
import type { BarrierRecord, BarrierShowProps } from '../Barriers.types';
import BarrierAffectedPeople from './BarrierAffectedPeople';
import './BarrierDetails.css';

type BarrierDetailsProps = Omit<BarrierShowProps, 'can'> & { showInspections: boolean };

/** A instituição vinculada enquadra o mapa e aparece como sede. */
function institutionReference(barrier: BarrierRecord): GeoMapReference | null {
    const { institution } = barrier;

    if (!institution) {
        return null;
    }

    return {
        id: institution.id,
        name: institution.name,
        latitude: Number(institution.latitude),
        longitude: Number(institution.longitude),
        default_zoom: institution.default_zoom,
        locations: [],
    };
}

function reporter(barrier: BarrierRecord): string {
    if (barrier.is_anonymous) {
        return 'Contribuidor Anônimo';
    }

    return barrier.registered_by?.name ?? 'Usuário não identificado';
}

/** Identificação, pessoas impactadas, mapa e histórico de vistorias de uma barreira. */
export default function BarrierDetails({
    barrier,
    display,
    showInspections,
}: BarrierDetailsProps): React.JSX.Element {
    const reference = institutionReference(barrier);
    const coordinates = pointFromRecord(barrier.latitude, barrier.longitude);
    const mapPoint = coordinates ?? reference ?? GEO_MAP_DEFAULT_CENTER;
    const blocksMap = Boolean(barrier.category?.blocks_map);
    const lockedMessage = blocksMap ? (
        <>
            Mapa não se aplica à categoria
            <br />
            {barrier.category?.name}.
        </>
    ) : undefined;

    return (
        <CardBox>
            <MapSplit>
                <MapSplitMain>
                    <FormSection
                        id="barrier-show-identification"
                        title="Identificação"
                        variant="inline"
                        iconClass="fa fa-exclamation-triangle"
                    >
                        <DetailGrid>
                            <DetailField label="Título do Relato">{barrier.name}</DetailField>
                            <DetailField label="Data">
                                {barrier.identified_at
                                    ? dateLabel(barrier.identified_at)
                                    : 'Não informada'}
                            </DetailField>
                            <DetailField label="Prioridade">
                                <TableLabel tone={barrierPriorityTone(barrier.priority)}>
                                    {barrierPriorityLabels[barrier.priority] ?? barrier.priority}
                                </TableLabel>
                            </DetailField>
                            <DetailField label="Categoria">
                                {barrier.category?.name ?? 'Não categorizada'}
                            </DetailField>
                            <DetailField label="Campus / Unidade">
                                {barrier.institution?.name ?? 'Não informado'}
                            </DetailField>
                            <DetailField label="Local / Ponto de Referência">
                                {barrier.location?.name ?? 'Não informado'}
                            </DetailField>
                            <DetailField label="Relator">{reporter(barrier)}</DetailField>
                            <DetailField label="Status no Sistema">
                                <TableLabel tone={barrier.is_active ? 'success' : 'inverse'}>
                                    {barrier.is_active ? 'Ativo' : 'Inativo'}
                                </TableLabel>
                            </DetailField>
                            {display.locationDetailsHtml ? (
                                <DetailField label="Complemento" wide>
                                    <RichTextContent html={display.locationDetailsHtml} />
                                </DetailField>
                            ) : null}
                            <DetailField label="Descrição Detalhada" wide>
                                <ExpandableContent>
                                    <RichTextContent html={display.descriptionHtml} />
                                </ExpandableContent>
                            </DetailField>
                            <DetailField label="Público Alvo" wide>
                                <TagList
                                    items={barrier.deficiencies ?? []}
                                    emptyMessage="Não informado"
                                />
                            </DetailField>
                            <DetailField label="Pessoa(s) Impactada(s)" wide>
                                <BarrierAffectedPeople barrier={barrier} />
                            </DetailField>
                        </DetailGrid>
                    </FormSection>
                </MapSplitMain>
                <MapSplitAside>
                    <FormSection
                        id="barrier-show-map"
                        title="Localização no Mapa"
                        variant="inline"
                        iconClass="fa fa-map-marker"
                    >
                        {!blocksMap ? (
                            <DetailGrid className="barrierDetails__coordinates">
                                <DetailField label="Latitude">
                                    {coordinates
                                        ? formatCoordinate(coordinates.latitude)
                                        : 'Não informado'}
                                </DetailField>
                                <DetailField label="Longitude">
                                    {coordinates
                                        ? formatCoordinate(coordinates.longitude)
                                        : 'Não informado'}
                                </DetailField>
                            </DetailGrid>
                        ) : null}
                        <GeoMap
                            title="Localização da Barreira"
                            value={mapPoint}
                            zoom={reference?.default_zoom ?? DEFAULT_BARRIER_ZOOM}
                            markerLabel="Barreira"
                            reference={reference}
                            lockedMessage={lockedMessage}
                        />
                    </FormSection>
                </MapSplitAside>
            </MapSplit>
            {showInspections ? (
                <InspectionHistoryTable
                    id="barrier-show-inspections"
                    baseUrl={barrierUrls.show(barrier.id)}
                    inspections={display.inspectionDetails}
                    stateLabel="Status da Barreira"
                />
            ) : null}
        </CardBox>
    );
}

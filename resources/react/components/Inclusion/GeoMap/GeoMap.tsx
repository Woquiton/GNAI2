import { useEffect, useRef, useState } from 'react';
import { joinClassNames } from '@/utils/joinClassNames';
import { loadExternalScript } from '@/utils/loadExternalScript';
import type {
    GeoMapProps,
    GeoPoint,
    LeafletLayer,
    LeafletLayerGroup,
    LeafletMap,
    LeafletRuntime,
} from './GeoMap.types';
import {
    escapeTooltipText,
    formatCoordinate,
    GEO_MAP_DEFAULT_CENTER,
    isValidGeoPoint,
} from './GeoMap.utils';
import '/public/assets/react/plugins/leaflet/leaflet.css';
import './GeoMap.css';

export type { GeoMapMarker, GeoMapProps, GeoMapReference, GeoPoint } from './GeoMap.types';

const LEAFLET_SCRIPT = '/assets/react/plugins/leaflet/leaflet.js';

/* Cores do Leaflet (SVG): os tooltips correspondentes ficam em GeoMap.css. */
const institutionMarkerStyle = {
    radius: 9,
    color: '#c0392b',
    fillColor: '#e74c3c',
    fillOpacity: 0.9,
};
const locationMarkerStyle = {
    radius: 6,
    color: '#68737d',
    fillColor: '#98a6ad',
    fillOpacity: 0.9,
};

function leafletRuntime(): LeafletRuntime | undefined {
    return (window as Window & { L?: LeafletRuntime }).L;
}

function coordinateText(value: number, valid: boolean): string {
    return valid ? formatCoordinate(value) : 'Não informado';
}

/**
 * Mapa Leaflet das telas de inclusão. A instituição em `reference` define o enquadramento
 * (coordenadas e `default_zoom`) e os marcadores de apoio; `value` é a posição real do marcador.
 */
export default function GeoMap({
    title,
    value,
    zoom,
    editable = false,
    interactionEnabled = true,
    height = 550,
    markerLabel,
    reference,
    excludedLocationId,
    showReferenceMarkers = true,
    error,
    lockedMessage,
    onChange,
    onBlockedInteraction,
    onZoomChange,
}: GeoMapProps): React.JSX.Element {
    const containerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<LeafletMap | null>(null);
    const selectedMarkerRef = useRef<LeafletLayer | null>(null);
    const referenceMarkersRef = useRef<LeafletLayerGroup | null>(null);
    const previousReferenceIdRef = useRef(reference?.id);
    const previousViewportCenterRef = useRef<GeoPoint | null>(null);
    const onChangeRef = useRef(onChange);
    const onBlockedInteractionRef = useRef(onBlockedInteraction);
    const interactionEnabledRef = useRef(interactionEnabled);
    const onZoomChangeRef = useRef(onZoomChange);
    const [loadError, setLoadError] = useState(false);
    const [ready, setReady] = useState(false);
    onChangeRef.current = onChange;
    onBlockedInteractionRef.current = onBlockedInteraction;
    interactionEnabledRef.current = interactionEnabled;
    onZoomChangeRef.current = onZoomChange;

    const { latitude, longitude } = value;
    const validValue = isValidGeoPoint(value);
    const hasReference = Boolean(reference);
    const referenceId = reference?.id;
    // A sede define o enquadramento; value mantém a posição real do marcador.
    const viewportCenter =
        reference && isValidGeoPoint(reference)
            ? reference
            : validValue
              ? value
              : GEO_MAP_DEFAULT_CENTER;
    const { latitude: centerLatitude, longitude: centerLongitude } = viewportCenter;
    const viewportZoom = reference?.default_zoom ?? zoom;
    const hint = interactionEnabled
        ? 'Clique no mapa ou arraste o marcador para definir o ponto.'
        : 'Selecione uma instituição base para posicionar o local.';

    useEffect(() => {
        let disposed = false;
        let resizeObserver: ResizeObserver | undefined;
        let resizeTimer: number | undefined;

        void loadExternalScript(LEAFLET_SCRIPT)
            .then(() => {
                if (disposed || !containerRef.current) return;
                const leaflet = leafletRuntime();
                if (!leaflet) throw new Error('Leaflet não foi carregado.');

                const point = validValue ? value : GEO_MAP_DEFAULT_CENTER;
                const map = leaflet.map(containerRef.current, {
                    center: [centerLatitude, centerLongitude],
                    zoom: viewportZoom,
                    scrollWheelZoom: true,
                });
                const streets = leaflet
                    .tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                        attribution: '© OpenStreetMap',
                        maxZoom: 19,
                    })
                    .addTo(map);
                const satellite = leaflet.tileLayer(
                    'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
                    { attribution: '© Google Maps', maxZoom: 21 },
                );
                leaflet.control
                    .layers({ 'Mapa de ruas (OSM)': streets, 'Satélite (Google)': satellite })
                    .addTo(map);
                const referenceMarkers = leaflet.layerGroup().addTo(map);
                const selectedMarker = leaflet
                    .marker([point.latitude, point.longitude], {
                        draggable: editable && interactionEnabled,
                    })
                    .addTo(map)
                    .bindTooltip(escapeTooltipText(markerLabel), {
                        permanent: true,
                        direction: 'top',
                        offset: [-15, -30],
                        className: 'geoMap__selectedTooltip',
                    });

                if (editable) {
                    map.on('click', (event) => {
                        if (!interactionEnabledRef.current) {
                            onBlockedInteractionRef.current?.();
                            return;
                        }
                        if (event.latlng) {
                            onChangeRef.current?.({
                                latitude: event.latlng.lat,
                                longitude: event.latlng.lng,
                            });
                        }
                    });
                    selectedMarker.on('dragend', (event) => {
                        if (!interactionEnabledRef.current) return;
                        const coordinates = event.target?.getLatLng();
                        if (coordinates) {
                            onChangeRef.current?.({
                                latitude: coordinates.lat,
                                longitude: coordinates.lng,
                            });
                        }
                    });
                }
                map.on('zoomend', (event) => {
                    const nextZoom = event.target?.getZoom?.();
                    if (nextZoom !== undefined) onZoomChangeRef.current?.(nextZoom);
                });

                mapRef.current = map;
                selectedMarkerRef.current = selectedMarker;
                referenceMarkersRef.current = referenceMarkers;
                setReady(true);
                resizeObserver = new ResizeObserver(() => map.invalidateSize());
                resizeObserver.observe(containerRef.current);
                resizeTimer = window.setTimeout(() => map.invalidateSize(), 100);
            })
            .catch(() => {
                if (!disposed) setLoadError(true);
            });

        return () => {
            disposed = true;
            resizeObserver?.disconnect();
            if (resizeTimer !== undefined) window.clearTimeout(resizeTimer);
            mapRef.current?.remove();
            mapRef.current = null;
            selectedMarkerRef.current = null;
            referenceMarkersRef.current = null;
        };
        // O mapa é criado uma única vez; os valores controlados são sincronizados abaixo.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const dragging = selectedMarkerRef.current?.dragging;
        if (!editable || !dragging) return;
        if (interactionEnabled) dragging.enable();
        else dragging.disable();
    }, [editable, interactionEnabled, ready]);

    useEffect(() => {
        if (!isValidGeoPoint({ latitude, longitude })) return;
        selectedMarkerRef.current?.setLatLng([latitude, longitude]);
    }, [latitude, longitude, ready]);

    useEffect(() => {
        const map = mapRef.current;
        if (!map || !ready || !Number.isFinite(viewportZoom) || viewportZoom < 0) return;
        const point: [number, number] = [centerLatitude, centerLongitude];
        const changedInstitution = previousReferenceIdRef.current !== referenceId;
        const changedCenter =
            previousViewportCenterRef.current?.latitude !== centerLatitude ||
            previousViewportCenterRef.current?.longitude !== centerLongitude;
        previousReferenceIdRef.current = referenceId;
        previousViewportCenterRef.current = {
            latitude: centerLatitude,
            longitude: centerLongitude,
        };
        // Com o contêiner sem tamanho, o flyTo do Leaflet calcula NaN e lança erro.
        const size = map.getSize();
        if (changedInstitution && hasReference && size.x > 0 && size.y > 0) {
            map.flyTo(point, viewportZoom, { animate: true, duration: 0.8 });
        } else if (changedInstitution && hasReference) {
            map.setView(point, viewportZoom);
        } else if (changedCenter || map.getZoom() !== viewportZoom) {
            map.setView(point, viewportZoom);
        }
    }, [centerLatitude, centerLongitude, viewportZoom, referenceId, hasReference, ready]);

    useEffect(() => {
        const leaflet = leafletRuntime();
        const group = referenceMarkersRef.current;
        if (!leaflet || !mapRef.current || !group) return;
        group.clearLayers();

        if (!reference || !isValidGeoPoint(reference)) return;
        leaflet
            .circleMarker([reference.latitude, reference.longitude], institutionMarkerStyle)
            .addTo(group)
            .bindTooltip(escapeTooltipText(`Sede: ${reference.name}`), {
                className: 'geoMap__institutionTooltip',
            });
        for (const location of reference.locations ?? []) {
            if (location.id === excludedLocationId || !isValidGeoPoint(location)) continue;
            leaflet
                .circleMarker([location.latitude, location.longitude], locationMarkerStyle)
                .addTo(group)
                .bindTooltip(escapeTooltipText(location.label), {
                    className: 'geoMap__locationTooltip',
                });
        }
    }, [reference, excludedLocationId, loadError, ready]);

    useEffect(() => {
        const map = mapRef.current;
        const markers = referenceMarkersRef.current;
        if (!map || !markers) return;
        if (showReferenceMarkers) map.addLayer(markers);
        else map.removeLayer(markers);
    }, [showReferenceMarkers, ready]);

    return (
        <div className={joinClassNames('geoMap', lockedMessage ? 'geoMap--locked' : undefined)}>
            <div className="geoMap__heading">
                <h3>{title}</h3>
                {editable ? <span>{hint}</span> : null}
            </div>
            <div
                ref={containerRef}
                className="geoMap__canvas"
                style={{ height }}
                role="region"
                aria-label={title}
                aria-busy={!loadError && !ready}
            />
            {loadError ? (
                <p className="geoMap__message" role="status">
                    Não foi possível carregar o mapa. Confira sua conexão e tente novamente.
                </p>
            ) : null}
            <dl className="geoMap__coordinates">
                <div>
                    <dt>Latitude</dt>
                    <dd>{coordinateText(latitude, validValue)}</dd>
                </div>
                <div>
                    <dt>Longitude</dt>
                    <dd>{coordinateText(longitude, validValue)}</dd>
                </div>
            </dl>
            {error ? (
                <p className="geoMap__message" role="alert">
                    {error}
                </p>
            ) : null}
            {lockedMessage ? (
                <div className="geoMap__lock">
                    <span>{lockedMessage}</span>
                </div>
            ) : null}
        </div>
    );
}

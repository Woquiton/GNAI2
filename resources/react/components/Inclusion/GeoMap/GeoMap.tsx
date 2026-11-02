import { useEffect, useRef, useState } from 'react';
import { describeMapMarker, mapMarkerIcon } from '@/components/UI/MapMarker/mapMarker';
import SweetAlertWarningIcon from '@/components/UI/SweetAlertWarningIcon/SweetAlertWarningIcon';
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

/** Duração da saída do aviso sobre o mapa, igual à animação do ícone e da folha. */
const LOCK_LEAVE_MS = 500;

/* Cores dos pontos; os tooltips correspondentes ficam em GeoMap.css. */
const SELECTED_MARKER_COLOR = 'var(--ui-color-gnai-primary)';
const INSTITUTION_MARKER_COLOR = '#e74c3c';
const LOCATION_MARKER_COLOR = '#98a6ad';

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
    lockedTitle = 'Atenção',
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
    const markerLabelRef = useRef(markerLabel);
    const [loadError, setLoadError] = useState(false);
    const [ready, setReady] = useState(false);
    // O aviso continua na tela durante a saída; o mapa já fica liberado por baixo.
    const [lock, setLock] = useState<{
        title: string;
        message: React.ReactNode;
        leaving: boolean;
    } | null>(() =>
        lockedMessage ? { title: lockedTitle, message: lockedMessage, leaving: false } : null,
    );
    const locked = Boolean(lockedMessage);
    onChangeRef.current = onChange;
    onBlockedInteractionRef.current = onBlockedInteraction;
    interactionEnabledRef.current = interactionEnabled;
    onZoomChangeRef.current = onZoomChange;
    markerLabelRef.current = markerLabel;

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
                        keyboard: true,
                        icon: mapMarkerIcon(leaflet, { color: SELECTED_MARKER_COLOR, pulse: true }),
                    })
                    .bindTooltip(escapeTooltipText(markerLabel), {
                        permanent: true,
                        direction: 'top',
                        className: 'geoMap__selectedTooltip',
                    });
                // O Leaflet recria o elemento a cada vez que o marcador entra no mapa.
                selectedMarker.on('add', () =>
                    describeMapMarker(selectedMarker.getElement(), markerLabelRef.current),
                );

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

    // O ponto do registro só aparece quando há coordenada e o mapa não está bloqueado por um aviso.
    useEffect(() => {
        if (lockedMessage) {
            setLock({ title: lockedTitle, message: lockedMessage, leaving: false });
            return undefined;
        }
        setLock((current) => (current ? { ...current, leaving: true } : null));
        const timer = window.setTimeout(() => setLock(null), LOCK_LEAVE_MS);
        return () => window.clearTimeout(timer);
    }, [lockedMessage, lockedTitle]);

    const showSelectedMarker = validValue && !locked;
    useEffect(() => {
        const map = mapRef.current;
        const marker = selectedMarkerRef.current;
        if (!map || !marker) return;
        if (showSelectedMarker) map.addLayer(marker);
        else map.removeLayer(marker);
    }, [showSelectedMarker, ready]);

    useEffect(() => {
        const dragging = selectedMarkerRef.current?.dragging;
        if (!editable || !dragging) return;
        if (interactionEnabled) dragging.enable();
        else dragging.disable();
    }, [editable, interactionEnabled, ready, showSelectedMarker]);

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
        // Pontos de apoio focáveis por Tab; o Leaflet mostra o tooltip também no foco do teclado.
        const institutionLabel = `Sede: ${reference.name}`;
        const institution = leaflet
            .marker([reference.latitude, reference.longitude], {
                keyboard: true,
                // Como os círculos anteriores, o clique chega ao mapa e posiciona o ponto ao editar.
                bubblingMouseEvents: true,
                icon: mapMarkerIcon(leaflet, { color: INSTITUTION_MARKER_COLOR }),
            })
            .addTo(group)
            .bindTooltip(escapeTooltipText(institutionLabel), {
                direction: 'top',
                className: 'geoMap__institutionTooltip',
            });
        describeMapMarker(institution.getElement(), institutionLabel);
        for (const location of reference.locations ?? []) {
            if (location.id === excludedLocationId || !isValidGeoPoint(location)) continue;
            const marker = leaflet
                .marker([location.latitude, location.longitude], {
                    keyboard: true,
                    bubblingMouseEvents: true,
                    icon: mapMarkerIcon(leaflet, { color: LOCATION_MARKER_COLOR, size: 'sm' }),
                })
                .addTo(group)
                .bindTooltip(escapeTooltipText(location.label), {
                    direction: 'top',
                    className: 'geoMap__locationTooltip',
                });
            describeMapMarker(marker.getElement(), location.label);
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
        <div className={joinClassNames('geoMap', lock ? 'geoMap--locked' : undefined)}>
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
                inert={locked}
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
            {lock ? (
                <div
                    className={joinClassNames(
                        'geoMap__lock',
                        lock.leaving ? 'geoMap__lock--leaving' : undefined,
                    )}
                    role="status"
                    aria-hidden={lock.leaving || undefined}
                >
                    <SweetAlertWarningIcon leaving={lock.leaving} />
                    <p className="geoMap__lockTitle">{lock.title}</p>
                    <p className="geoMap__lockText">{lock.message}</p>
                </div>
            ) : null}
        </div>
    );
}

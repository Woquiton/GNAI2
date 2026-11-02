import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import ChoiceControl from '@/components/Forms/ChoiceControl/ChoiceControl';
import ChoiceGroup from '@/components/Forms/ChoiceGroup/ChoiceGroup';
import FormField from '@/components/Forms/FormField/FormField';
import CardBox from '@/components/UI/CardBox/CardBox';
import SweetAlertErrorIcon from '@/components/UI/SweetAlertErrorIcon/SweetAlertErrorIcon';
import { describeMapMarker, mapMarkerIcon } from '@/components/UI/MapMarker/mapMarker';
import { joinClassNames } from '@/utils/joinClassNames';
import { loadExternalScript } from '@/utils/loadExternalScript';
import BarrierPopup from './BarrierPopup';
import { STATUS_TONE_COLORS } from './Overview.constants';
import type { Barrier } from './Overview.types';
import '/public/assets/react/plugins/leaflet/leaflet.css';
import './Overview.css';

/** Duração da saída da folha sobre o mapa, igual à animação do ícone. */
const SHEET_LEAVE_MS = 500;

const statuses = [
    ['identified', 'Identificada'],
    ['under_analysis', 'Em análise'],
    ['in_progress', 'Em tratamento'],
    ['resolved', 'Resolvida'],
    ['not_applicable', 'Não aplicável'],
];
interface MapInstance {
    remove(): void;
    invalidateSize(): void;
    getSize(): { x: number; y: number };
    fitBounds(points: number[][], options: object): void;
}
interface MapLayer {
    addTo(map: MapInstance): MapLayer;
    bindPopup(content: HTMLElement, options?: object): MapLayer;
}
interface MarkerLayer extends MapLayer {
    getElement(): HTMLElement | undefined;
    openPopup(): MarkerLayer;
}
interface MarkerGroup {
    addTo(map: MapInstance): MarkerGroup;
    addLayer(layer: MapLayer): void;
    clearLayers(): void;
}
interface Leaflet {
    layerGroup(): MarkerGroup;
    map(element: HTMLElement, options: object): MapInstance;
    tileLayer(url: string, options: object): MapLayer;
    marker(point: number[], options: object): MarkerLayer;
    divIcon(options: Record<string, unknown>): unknown;
    control: { layers(layers: Record<string, MapLayer>): { addTo(map: MapInstance): void } };
}
export default function BarrierMap({ barriers }: { barriers: Barrier[] }): React.JSX.Element {
    const ref = useRef<HTMLDivElement>(null);
    const [selected, setSelected] = useState(statuses.map(([value]) => value));
    const [error, setError] = useState(false);
    const [runtime, setRuntime] = useState<{
        L: Leaflet;
        map: MapInstance;
        markers: MarkerGroup;
    } | null>(null);
    const fitted = useRef(false);
    const [popups, setPopups] = useState<{ element: HTMLElement; barrier: Barrier }[]>([]);
    const visible = useMemo(
        () => barriers.filter((barrier) => selected.includes(barrier.status)),
        [barriers, selected],
    );
    const mapped = useMemo(
        () =>
            visible.filter(
                (barrier) =>
                    !barrier.blocks_map &&
                    barrier.lat !== null &&
                    barrier.lng !== null &&
                    Number.isFinite(barrier.lat) &&
                    Number.isFinite(barrier.lng) &&
                    Math.abs(barrier.lat) <= 90 &&
                    Math.abs(barrier.lng) <= 180,
            ),
        [visible],
    );
    const message = !visible.length
        ? 'Nenhuma barreira com os status selecionados.'
        : visible.every((barrier) => barrier.blocks_map)
          ? 'As barreiras selecionadas não se aplicam ao mapa.'
          : !mapped.length
            ? 'As barreiras selecionadas não possuem coordenadas válidas.'
            : '';
    const notice = error
        ? {
              title: 'Mapa indisponível',
              text: 'Não foi possível carregar o mapa. Recarregue a página para tentar novamente.',
          }
        : { title: 'Nada para mostrar', text: message };
    const blocked = error || message !== '';
    // A folha sai com a animação inversa; os marcadores aparecem enquanto ela esmaece.
    const [sheet, setSheet] = useState<{ title: string; text: string; leaving: boolean } | null>(
        () => (blocked ? { ...notice, leaving: false } : null),
    );
    useEffect(() => {
        if (blocked) {
            setSheet({ title: notice.title, text: notice.text, leaving: false });
            return undefined;
        }
        setSheet((current) => (current ? { ...current, leaving: true } : null));
        const timer = window.setTimeout(() => setSheet(null), SHEET_LEAVE_MS);
        return () => window.clearTimeout(timer);
    }, [blocked, notice.title, notice.text]);
    useEffect(() => {
        let disposed = false;
        let map: MapInstance | undefined;
        let observer: ResizeObserver | undefined;
        setError(false);
        void loadExternalScript('/assets/react/plugins/leaflet/leaflet.js')
            .then(() => {
                if (disposed || !ref.current) return;
                const L = (window as unknown as { L: Leaflet }).L;
                map = L.map(ref.current, {
                    center: [-14.235, -42.769],
                    zoom: 15,
                    scrollWheelZoom: false,
                });
                const streets = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '© OpenStreetMap',
                    maxZoom: 19,
                }).addTo(map);
                const satellite = L.tileLayer(
                    'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
                    { attribution: '© Google Maps', maxZoom: 21 },
                );
                L.control.layers({ 'Mapa de ruas': streets, Satélite: satellite }).addTo(map);
                const markers = L.layerGroup().addTo(map);
                fitted.current = false;
                setRuntime({ L, map, markers });
                observer = new ResizeObserver(() => map?.invalidateSize());
                observer.observe(ref.current);
            })
            .catch(() => {
                if (!disposed) setError(true);
            });
        return () => {
            disposed = true;
            observer?.disconnect();
            map?.remove();
        };
    }, []);

    useEffect(() => {
        if (!runtime) return;
        const { L, map, markers } = runtime;
        markers.clearLayers();
        const nextPopups: { element: HTMLElement; barrier: Barrier }[] = [];
        const points: number[][] = [];
        for (const barrier of mapped) {
            const point = [barrier.lat!, barrier.lng!];
            const popup = document.createElement('div');
            nextPopups.push({ element: popup, barrier });
            // Marcador com `keyboard`: o Leaflet o torna focável por Tab, como botão, e abre o popup com Enter.
            const marker = L.marker(point, {
                keyboard: true,
                riseOnHover: true,
                icon: mapMarkerIcon(L, {
                    color: STATUS_TONE_COLORS[barrier.color] ?? STATUS_TONE_COLORS.primary,
                    pulse: true,
                }),
            }).bindPopup(popup, { className: 'barrierPopup', minWidth: 240, maxWidth: 240 });
            markers.addLayer(marker);
            describeMapMarker(
                marker.getElement(),
                `Barreira ${barrier.name}: ${barrier.status_label}`,
                () => marker.openPopup(),
            );
            points.push(point);
        }
        // O padding maior que o mapa gera zoom NaN no Leaflet; ajusta quando houver espaço.
        const size = map.getSize();
        if (!fitted.current && points.length && size.x > 70 && size.y > 70) {
            map.fitBounds(points, { padding: [35, 35], maxZoom: 16 });
            fitted.current = true;
        }
        setPopups(nextPopups);
    }, [runtime, mapped]);
    return (
        <CardBox className="gnaiDashboard__chart">
            {popups.map(({ element, barrier }) =>
                createPortal(<BarrierPopup barrier={barrier} />, element, String(barrier.id)),
            )}
            <h2 className="header-title">Mapa de barreiras</h2>
            {/* Sem o que mostrar, uma folha translúcida bloqueia o mapa e explica o motivo. */}
            <div className="gnaiDashboard__mapFrame">
                <div
                    ref={ref}
                    className="gnaiDashboard__map"
                    role="region"
                    aria-label="Localização das barreiras"
                    inert={blocked}
                />
                <div className="gnaiDashboard__mapNotice" role="status">
                    {sheet ? (
                        <div
                            className={joinClassNames(
                                'gnaiDashboard__mapSheet',
                                sheet.leaving && 'gnaiDashboard__mapSheet--leaving',
                            )}
                            key={sheet.text}
                            aria-hidden={sheet.leaving || undefined}
                        >
                            <SweetAlertErrorIcon leaving={sheet.leaving} />
                            <p className="gnaiDashboard__mapNoticeTitle">{sheet.title}</p>
                            <p className="gnaiDashboard__mapNoticeText">{sheet.text}</p>
                        </div>
                    ) : null}
                </div>
            </div>
            <FormField
                id="dashboard-barriers-filter"
                label="Visualizar no mapa"
                className="gnaiDashboard__filters"
            >
                <ChoiceGroup id="dashboard-barriers-filter" label="Visualizar no mapa">
                    <ChoiceControl
                        type="checkbox"
                        id="dashboard-barriers-all"
                        label="Todas"
                        tone="purple"
                        checked={selected.length === statuses.length}
                        onChange={(checked) =>
                            setSelected(checked ? statuses.map(([value]) => value) : [])
                        }
                    />
                    {statuses.map(([value, label]) => (
                        <ChoiceControl
                            key={value}
                            type="checkbox"
                            id={`dashboard-barriers-${value}`}
                            label={label}
                            tone="purple"
                            checked={selected.includes(value)}
                            onChange={(checked) =>
                                setSelected((current) =>
                                    checked
                                        ? [...current, value]
                                        : current.filter((item) => item !== value),
                                )
                            }
                        />
                    ))}
                </ChoiceGroup>
            </FormField>
        </CardBox>
    );
}

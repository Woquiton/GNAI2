import FormActions from '@/components/Forms/FormActions/FormActions';
import FormLayout from '@/components/Forms/FormLayout/FormLayout';
import FormSection from '@/components/Forms/FormSection/FormSection';
import GeoMap from '@/components/Inclusion/GeoMap/GeoMap';
import MapSplit, { MapSplitAside, MapSplitMain } from '@/components/Inclusion/MapSplit/MapSplit';
import Button from '@/components/UI/Button/Button';
import CardBox from '@/components/UI/CardBox/CardBox';
import { institutionUrls } from '../Institutions.routes';
import type { InstitutionRecord } from '../Institutions.types';
import InstitutionIdentificationFields from './InstitutionIdentificationFields';
import InstitutionSettingsFields from './InstitutionSettingsFields';
import { useInstitutionForm } from './useInstitutionForm';

interface InstitutionFormProps {
    institution?: InstitutionRecord;
    canSubmit: boolean;
}

function submissionStatus(processing: boolean, editing: boolean): string | undefined {
    if (!processing) {
        return undefined;
    }

    return editing ? 'Salvando alterações…' : 'Cadastrando instituição…';
}

/** Cadastro e edição da sede: dados à esquerda e mapa para posicionar a sede à direita. */
export default function InstitutionForm({
    institution,
    canSubmit,
}: InstitutionFormProps): React.JSX.Element {
    const { form, errors, formRef, mapPoint, zoom, updateFromMap, updateZoom, save } =
        useInstitutionForm({ institution, canSubmit });
    const editing = Boolean(institution);
    const sectionProps = { form, errors, disabled: form.processing };

    function changeZoomFromMap(nextZoom: number): void {
        if (!form.processing) {
            updateZoom(nextZoom);
        }
    }

    return (
        <FormLayout
            ref={formRef}
            aria-busy={form.processing}
            onSubmit={(event) => {
                event.preventDefault();
                save();
            }}
        >
            <CardBox>
                <MapSplit wideAside>
                    <MapSplitMain>
                        <InstitutionIdentificationFields {...sectionProps} />
                        <InstitutionSettingsFields
                            {...sectionProps}
                            zoom={zoom}
                            onZoomChange={updateZoom}
                        />
                    </MapSplitMain>
                    <MapSplitAside>
                        <FormSection
                            id="institution-map"
                            title="Localização no Mapa"
                            variant="inline"
                            iconClass="fa fa-map-marker"
                        >
                            <GeoMap
                                title={
                                    editing ? 'Ajuste a Sede no Mapa' : 'Localize a Sede no Mapa'
                                }
                                value={mapPoint}
                                zoom={zoom}
                                editable
                                interactionEnabled={!form.processing}
                                markerLabel="Sede da instituição"
                                onChange={updateFromMap}
                                onZoomChange={changeZoomFromMap}
                            />
                        </FormSection>
                    </MapSplitAside>
                </MapSplit>
            </CardBox>
            <FormActions status={submissionStatus(form.processing, editing)}>
                <Button
                    href={
                        institution ? institutionUrls.show(institution.id) : institutionUrls.index
                    }
                    tone="cancel"
                    label="Cancelar"
                    disabled={form.processing}
                />
                {canSubmit ? (
                    <Button
                        type="submit"
                        tone="save"
                        label={editing ? 'Salvar' : 'Cadastrar'}
                        disabled={form.processing}
                    />
                ) : null}
            </FormActions>
        </FormLayout>
    );
}

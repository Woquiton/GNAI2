import FormActions from '@/components/Forms/FormActions/FormActions';
import FormLayout from '@/components/Forms/FormLayout/FormLayout';
import FormSection from '@/components/Forms/FormSection/FormSection';
import GeoMap from '@/components/Inclusion/GeoMap/GeoMap';
import MapSplit, { MapSplitAside, MapSplitMain } from '@/components/Inclusion/MapSplit/MapSplit';
import Button from '@/components/UI/Button/Button';
import CardBox from '@/components/UI/CardBox/CardBox';
import { DEFAULT_LOCATION_ZOOM } from '../Locations.constants';
import { locationUrls } from '../Locations.routes';
import type { LocationFormOptions, LocationRecord } from '../Locations.types';
import { LOCATION_TOUR_TARGETS } from '../locationTours';
import LocationIdentificationFields from './LocationIdentificationFields';
import LocationSettingsFields from './LocationSettingsFields';
import { useLocationForm, warnInstitutionRequired } from './useLocationForm';

interface LocationFormProps {
    options: LocationFormOptions;
    location?: LocationRecord;
}

function submissionStatus(processing: boolean, editing: boolean): string | undefined {
    if (!processing) {
        return undefined;
    }

    return editing ? 'Salvando alterações…' : 'Cadastrando ponto…';
}

/**
 * Cadastro e edição de pontos de referência. O mapa é enquadrado pela instituição base e só
 * aceita marcação depois que ela é escolhida.
 */
export default function LocationForm({ options, location }: LocationFormProps): React.JSX.Element {
    const {
        form,
        errors,
        formRef,
        editorFailed,
        selectedInstitution,
        mapPoint,
        changeInstitution,
        updatePoint,
        reportEditorFailure,
        save,
    } = useLocationForm({ options, location });
    const editing = Boolean(location);
    const sectionProps = { form, errors, disabled: form.processing };

    function warnBlockedMap(): void {
        if (!form.processing) {
            warnInstitutionRequired();
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
                        <LocationIdentificationFields
                            {...sectionProps}
                            institutions={options.institutions}
                            onInstitutionChange={changeInstitution}
                            onEditorFailure={reportEditorFailure}
                        />
                        <LocationSettingsFields {...sectionProps} />
                    </MapSplitMain>
                    <MapSplitAside>
                        <FormSection
                            id="location-map"
                            tourTarget={LOCATION_TOUR_TARGETS.map}
                            title="Localização no Mapa"
                            variant="inline"
                            iconClass="fa fa-map-marker"
                        >
                            <GeoMap
                                title="Localização no Campus"
                                value={mapPoint}
                                zoom={selectedInstitution?.default_zoom ?? DEFAULT_LOCATION_ZOOM}
                                editable
                                interactionEnabled={
                                    Boolean(form.data.institution_id) && !form.processing
                                }
                                markerLabel="Localização selecionada"
                                reference={selectedInstitution}
                                excludedLocationId={location?.id}
                                onChange={updatePoint}
                                onBlockedInteraction={warnBlockedMap}
                            />
                        </FormSection>
                    </MapSplitAside>
                </MapSplit>
            </CardBox>
            <FormActions
                status={submissionStatus(form.processing, editing)}
                tourTarget={LOCATION_TOUR_TARGETS.formActions}
            >
                <Button
                    href={location ? locationUrls.show(location.id) : locationUrls.index}
                    tone="cancel"
                    label="Cancelar"
                    disabled={form.processing}
                />
                {options.canSubmit ? (
                    <Button
                        type="submit"
                        tone="save"
                        label={editing ? 'Salvar' : 'Cadastrar'}
                        disabled={form.processing || editorFailed}
                    />
                ) : null}
            </FormActions>
        </FormLayout>
    );
}

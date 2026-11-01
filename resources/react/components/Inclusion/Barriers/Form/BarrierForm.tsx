import FormActions from '@/components/Forms/FormActions/FormActions';
import FormLayout from '@/components/Forms/FormLayout/FormLayout';
import MapSplit, { MapSplitAside, MapSplitMain } from '@/components/Inclusion/MapSplit/MapSplit';
import Button from '@/components/UI/Button/Button';
import CardBox from '@/components/UI/CardBox/CardBox';
import { barrierUrls } from '../Barriers.routes';
import type { BarrierFormOptions, BarrierRecord } from '../Barriers.types';
import BarrierIdentificationFields from './BarrierIdentificationFields';
import BarrierInspectionFields from './BarrierInspectionFields';
import BarrierMapField from './BarrierMapField';
import { useBarrierForm } from './useBarrierForm';

interface BarrierFormProps {
    options: BarrierFormOptions;
    barrier?: BarrierRecord;
}

function submissionStatus(processing: boolean, editing: boolean): string | undefined {
    if (!processing) {
        return undefined;
    }

    return editing ? 'Salvando alterações…' : 'Registrando barreira…';
}

/** Relato e edição de barreiras: identificação à esquerda; mapa e vistoria à direita. */
export default function BarrierForm({ options, barrier }: BarrierFormProps): React.JSX.Element {
    const {
        form,
        errors,
        formRef,
        editorFailed,
        institution,
        category,
        mapBlocked,
        mapPoint,
        showLocations,
        setShowLocations,
        changeInstitution,
        changeLocation,
        updatePoint,
        reportEditorFailure,
        save,
    } = useBarrierForm({ options, barrier });
    const editing = Boolean(barrier);
    const sectionProps = { form, errors, disabled: form.processing };

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
                <MapSplit>
                    <MapSplitMain>
                        <BarrierIdentificationFields
                            {...sectionProps}
                            options={options}
                            institution={institution}
                            onInstitutionChange={changeInstitution}
                            onLocationChange={changeLocation}
                            onEditorFailure={reportEditorFailure}
                        />
                    </MapSplitMain>
                    <MapSplitAside>
                        <BarrierMapField
                            point={mapPoint}
                            institution={institution}
                            category={category}
                            mapBlocked={mapBlocked}
                            showLocations={showLocations}
                            disabled={form.processing}
                            error={errors.latitude ?? errors.longitude}
                            onShowLocationsChange={setShowLocations}
                            onChange={updatePoint}
                        />
                        <BarrierInspectionFields
                            {...sectionProps}
                            editing={editing}
                            barrierStatuses={options.barrierStatuses}
                            onEditorFailure={reportEditorFailure}
                        />
                    </MapSplitAside>
                </MapSplit>
            </CardBox>
            <FormActions status={submissionStatus(form.processing, editing)}>
                <Button
                    href={barrier ? barrierUrls.show(barrier.id) : barrierUrls.index}
                    tone="cancel"
                    label="Cancelar"
                    disabled={form.processing}
                />
                {options.canSubmit ? (
                    <Button
                        type="submit"
                        tone="save"
                        label="Salvar"
                        disabled={form.processing || editorFailed}
                    />
                ) : null}
            </FormActions>
        </FormLayout>
    );
}

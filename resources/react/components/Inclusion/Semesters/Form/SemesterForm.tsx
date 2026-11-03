import FormActions from '@/components/Forms/FormActions/FormActions';
import FieldError from '@/components/Forms/FormField/FieldError';
import { fieldErrorId } from '@/components/Forms/FormField/fieldDescription';
import { DateInputField, TextInputField } from '@/components/Forms/FormFields/FormFields';
import FormGrid, { FormGridWide } from '@/components/Forms/FormGrid/FormGrid';
import FormLayout from '@/components/Forms/FormLayout/FormLayout';
import FormSection from '@/components/Forms/FormSection/FormSection';
import ToggleControl from '@/components/Forms/ToggleControl/ToggleControl';
import Button from '@/components/UI/Button/Button';
import CardBox from '@/components/UI/CardBox/CardBox';
import { SEMESTER_TOUR_TARGETS } from '../semesterTours';
import { semesterUrls } from '../Semesters.routes';
import type { SemesterRecord } from '../Semesters.types';
import { useSemesterForm } from './useSemesterForm';

function submissionStatus(processing: boolean, editing: boolean): string | undefined {
    if (!processing) {
        return undefined;
    }

    return editing ? 'Salvando alterações…' : 'Cadastrando semestre…';
}

/** Cadastro e edição de semestres: identificação do período, vigência e semestre atual. */
export default function SemesterForm({
    semester,
}: {
    semester?: SemesterRecord;
}): React.JSX.Element {
    const { form, errors, formRef, save } = useSemesterForm(semester);
    const editing = Boolean(semester);
    const currentLabel = editing
        ? 'Este é o semestre atual'
        : 'Definir este como o semestre atual do sistema';

    return (
        <FormLayout
            ref={formRef}
            aria-label={editing ? 'Editar semestre' : 'Cadastrar semestre'}
            aria-busy={form.processing}
            onSubmit={(event) => {
                event.preventDefault();
                save();
            }}
        >
            <CardBox>
                <fieldset disabled={form.processing}>
                    <FormSection
                        id="semester-identification"
                        title="Identificação"
                        tourTarget={SEMESTER_TOUR_TARGETS.identification}
                        variant="inline"
                        iconClass="fa fa-calendar"
                    >
                        <FormGrid columns={2}>
                            <TextInputField
                                id="semester-year"
                                name="year"
                                label="Ano Letivo"
                                type="number"
                                inputMode="numeric"
                                required
                                min={1901}
                                max={2155}
                                value={form.data.year}
                                error={errors.year}
                                onChange={(value) => form.setData('year', value)}
                            />
                            <TextInputField
                                id="semester-term"
                                name="term"
                                label={editing ? 'Período' : 'Período (Ex: 1 ou 2)'}
                                type="number"
                                inputMode="numeric"
                                required
                                min={1}
                                max={2}
                                value={form.data.term}
                                error={errors.term}
                                onChange={(value) => form.setData('term', value)}
                            />
                            <DateInputField
                                id="semester-start-date"
                                name="start_date"
                                label="Data de Início"
                                value={form.data.start_date}
                                disabled={form.processing}
                                error={errors.start_date}
                                onChange={(date) => form.setData('start_date', date)}
                            />
                            <DateInputField
                                id="semester-end-date"
                                name="end_date"
                                label="Data de Término"
                                value={form.data.end_date}
                                disabled={form.processing}
                                error={errors.end_date}
                                onChange={(date) => form.setData('end_date', date)}
                            />
                            <FormGridWide>
                                <div data-tour={SEMESTER_TOUR_TARGETS.current}>
                                    <ToggleControl
                                        size="small"
                                        id="semester-is-current"
                                        name="is_current"
                                        label={currentLabel}
                                        checked={form.data.is_current}
                                        disabled={form.processing}
                                        invalid={Boolean(errors.is_current)}
                                        describedBy={
                                            errors.is_current
                                                ? fieldErrorId('semester-is-current')
                                                : undefined
                                        }
                                        onChange={(checked) => form.setData('is_current', checked)}
                                    />
                                    <FieldError
                                        id="semester-is-current"
                                        error={errors.is_current}
                                    />
                                </div>
                            </FormGridWide>
                        </FormGrid>
                    </FormSection>
                </fieldset>
            </CardBox>
            <FormActions
                status={submissionStatus(form.processing, editing)}
                tourTarget={SEMESTER_TOUR_TARGETS.formActions}
            >
                <Button
                    href={semester ? semesterUrls.show(semester.id) : semesterUrls.index}
                    tone="cancel"
                    label="Cancelar"
                    aria-label="Cancelar e voltar"
                    disabled={form.processing}
                />
                <Button type="submit" tone="save" label="Salvar" disabled={form.processing} />
            </FormActions>
        </FormLayout>
    );
}

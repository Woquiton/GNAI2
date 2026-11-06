import { useForm } from '@inertiajs/react';
import { TextAreaField } from '@/components/Forms/FormFields/FormFields';
import FormLayout from '@/components/Forms/FormLayout/FormLayout';
import { useFormSubmission } from '@/components/Forms/FormLayout/useFormSubmission';
import FormSection from '@/components/Forms/FormSection/FormSection';
import Button from '@/components/UI/Button/Button';
import DetailField from '@/components/UI/DetailField/DetailField';
import DetailGrid from '@/components/UI/DetailGrid/DetailGrid';
import { PEI_OTHER_INFO_FAILURE_TEXT } from '../Peis.constants';
import PeiSectionActions from './PeiSectionActions';
import EmptyText from '@/components/UI/EmptyText/EmptyText';
import { PEI_TOUR_TARGETS } from '../peiTours';

const FIELD_LABEL = 'Outras informações relevantes';

interface PeiOtherInfoProps {
    /** Rota `pei.other-info.update` (PATCH). */
    action: string;
    value: string | null;
    canUpdate: boolean;
}

function OtherInfoForm({ action, value }: Omit<PeiOtherInfoProps, 'canUpdate'>): React.JSX.Element {
    const form = useForm({ other_relevant_info: value ?? '' });
    const submission = useFormSubmission(form);
    const submitLabel = form.processing ? 'Salvando...' : 'Salvar';

    function submit(event: React.FormEvent<HTMLFormElement>): void {
        event.preventDefault();
        submission.submit({
            url: action,
            method: 'patch',
            failureText: PEI_OTHER_INFO_FAILURE_TEXT,
        });
    }

    return (
        <FormLayout
            ref={submission.formRef}
            aria-label="Outras informações relevantes do PEI"
            aria-busy={form.processing}
            onSubmit={submit}
        >
            <TextAreaField
                id="pei-other-relevant-info"
                name="other_relevant_info"
                label={FIELD_LABEL}
                rows={3}
                value={form.data.other_relevant_info}
                error={form.errors.other_relevant_info}
                disabled={form.processing}
                onChange={(next) => form.setData('other_relevant_info', next)}
            />
            <PeiSectionActions>
                <Button
                    type="submit"
                    tone="save"
                    label={submitLabel}
                    title="Salvar outras informações relevantes"
                    aria-label="Salvar outras informações relevantes"
                    disabled={form.processing}
                />
            </PeiSectionActions>
        </FormLayout>
    );
}

/** Outras informações relevantes do PEI (Apêndice 4, item 16). */
export default function PeiOtherInfo({
    action,
    value,
    canUpdate,
}: PeiOtherInfoProps): React.JSX.Element {
    const readOnlyContent = value ? (
        <DetailGrid>
            <DetailField label={FIELD_LABEL} wide preserveLineBreaks>
                {value}
            </DetailField>
        </DetailGrid>
    ) : (
        <EmptyText>Nenhuma informação adicional registrada.</EmptyText>
    );

    return (
        <FormSection
            id="pei-other-info"
            tourTarget={PEI_TOUR_TARGETS.otherInfo}
            title="Outras Informações Relevantes"
            iconClass="fa fa-info-circle"
            variant="inline"
        >
            {canUpdate ? <OtherInfoForm action={action} value={value} /> : readOnlyContent}
        </FormSection>
    );
}

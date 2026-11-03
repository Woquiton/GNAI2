import FormSection from '@/components/Forms/FormSection/FormSection';
import CardBox from '@/components/UI/CardBox/CardBox';
import DetailField from '@/components/UI/DetailField/DetailField';
import DetailGrid from '@/components/UI/DetailGrid/DetailGrid';
import RichTextContent from '@/components/UI/RichTextContent/RichTextContent';
import TableLabel from '@/components/UI/TableLabel/TableLabel';
import WaitlistResourceDetails from '../WaitlistResourceDetails';
import type { WaitlistShowProps } from '../Waitlists.types';
import { WAITLIST_TOUR_TARGETS } from '../waitlistTours';

const NOT_INFORMED = 'Não informado';

type WaitlistDetailsProps = Pick<WaitlistShowProps, 'waitlist' | 'statusLabel' | 'statusColor'>;

/** Recurso, beneficiário, responsável, status e observações de uma solicitação. */
export default function WaitlistDetails({
    waitlist,
    statusLabel,
    statusColor,
}: WaitlistDetailsProps): React.JSX.Element {
    const observation = waitlist.observation_html ? (
        <RichTextContent html={waitlist.observation_html} />
    ) : (
        'Nenhuma observação registrada.'
    );

    return (
        <CardBox>
            <FormSection
                id="waitlist-show-identification"
                title="Identificação"
                variant="inline"
                iconClass="fa fa-list-alt"
                tourTarget={WAITLIST_TOUR_TARGETS.details}
            >
                <DetailGrid>
                    <WaitlistResourceDetails {...waitlist} />
                    <DetailField label="Estudante (Beneficiário)">
                        {waitlist.student?.name ?? NOT_INFORMED}
                    </DetailField>
                    <DetailField label="Profissional (Beneficiário)">
                        {waitlist.professional?.name ?? NOT_INFORMED}
                    </DetailField>
                    <DetailField label="Usuário Responsável">
                        {waitlist.user || NOT_INFORMED}
                    </DetailField>
                    <DetailField label="Data da Solicitação">
                        {waitlist.requested_at_label}
                    </DetailField>
                    <DetailField label="Status da Solicitação">
                        <TableLabel tone={statusColor}>{statusLabel}</TableLabel>
                    </DetailField>
                    <DetailField label="Observações" wide>
                        {observation}
                    </DetailField>
                </DetailGrid>
            </FormSection>
        </CardBox>
    );
}

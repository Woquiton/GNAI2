import FormSection from '@/components/Forms/FormSection/FormSection';
import CardBox from '@/components/UI/CardBox/CardBox';
import DetailField from '@/components/UI/DetailField/DetailField';
import DetailGrid from '@/components/UI/DetailGrid/DetailGrid';
import RichTextContent from '@/components/UI/RichTextContent/RichTextContent';
import TableLabel from '@/components/UI/TableLabel/TableLabel';
import { dateLabel } from '@/utils/formatters';
import { PROFESSIONAL_TOUR_TARGETS } from '../professionalTours';
import type { ProfessionalShowProps } from '../Professionals.types';
import './ProfessionalDetails.css';

type ProfessionalDetailsProps = Pick<ProfessionalShowProps, 'professional' | 'display'> & {
    /** Somente administradores veem se o profissional é administrador do sistema. */
    showAdministrator: boolean;
};

/** Identificação pessoal e vínculo profissional. */
export default function ProfessionalDetails({
    professional,
    display,
    showAdministrator,
}: ProfessionalDetailsProps): React.JSX.Element {
    const { person } = professional;
    const status = display.statusLabel ? (
        <TableLabel tone={display.statusColor ?? 'inverse'}>{display.statusLabel}</TableLabel>
    ) : (
        '---'
    );
    const administrator = professional.user?.is_admin ? (
        <TableLabel tone="success">
            <i className="fa fa-shield" aria-hidden="true" /> Sim
        </TableLabel>
    ) : (
        <TableLabel tone="inverse">Não</TableLabel>
    );

    return (
        <CardBox>
            <FormSection
                id="professional-identification"
                title="Identificação Pessoal"
                variant="inline"
                iconClass="fa fa-user"
                tourTarget={PROFESSIONAL_TOUR_TARGETS.identification}
            >
                <div className="professionalDetails__profile">
                    <img
                        src={person.photo_url ?? '/images/default-user.jpg'}
                        alt={`Foto de ${person.name}`}
                        className="professionalDetails__photo"
                    />
                    <p className="professionalDetails__name">{person.name}</p>
                </div>
                <DetailGrid columns={3}>
                    <DetailField label="Nome Completo">
                        <strong>{person.name}</strong>
                    </DetailField>
                    <DetailField label="CPF">{person.document || '---'}</DetailField>
                    <DetailField label="Data de Nascimento">
                        {dateLabel(person.birth_date)}
                    </DetailField>
                    <DetailField label="E-mail">{person.email || '---'}</DetailField>
                    <DetailField label="Telefone">{person.phone || '---'}</DetailField>
                    <DetailField label="Endereço" wide>
                        {display.addressHtml ? (
                            <RichTextContent html={display.addressHtml} />
                        ) : (
                            '---'
                        )}
                    </DetailField>
                </DetailGrid>
            </FormSection>
            <FormSection
                id="professional-employment"
                title="Vínculo Profissional"
                variant="inline"
                iconClass="fa fa-briefcase"
                tourTarget={PROFESSIONAL_TOUR_TARGETS.employment}
            >
                <DetailGrid columns={3}>
                    <DetailField label="Cargo / Função">
                        <strong>{professional.position?.name ?? 'Não definido'}</strong>
                    </DetailField>
                    <DetailField label="Matrícula">
                        {professional.registration || '---'}
                    </DetailField>
                    <DetailField label="Status">{status}</DetailField>
                    <DetailField label="Aparece no site">
                        {professional.show_on_website ? 'Sim' : 'Não'}
                    </DetailField>
                    <DetailField label="Data de Admissão">
                        {dateLabel(professional.entry_date)}
                    </DetailField>
                    <DetailField label="Tempo de Instituição">
                        {display.serviceTime || '---'}
                    </DetailField>
                    {showAdministrator ? (
                        <DetailField label="Administrador do Sistema">{administrator}</DetailField>
                    ) : null}
                </DetailGrid>
            </FormSection>
        </CardBox>
    );
}

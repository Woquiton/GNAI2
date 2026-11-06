import FormSection from '@/components/Forms/FormSection/FormSection';
import CardBox from '@/components/UI/CardBox/CardBox';
import DetailField from '@/components/UI/DetailField/DetailField';
import DetailGrid from '@/components/UI/DetailGrid/DetailGrid';
import RichTextContent from '@/components/UI/RichTextContent/RichTextContent';
import TableLabel from '@/components/UI/TableLabel/TableLabel';
import { dateLabel } from '@/utils/formatters';
import type { GuardianShowProps } from '../Guardians.types';
import { GUARDIAN_TOUR_TARGETS } from '../guardianTours';
import '@styles/components/Guardians/Details/GuardianDetails.css';

const NOT_INFORMED = 'Não informado';

type GuardianDetailsProps = Omit<GuardianShowProps, 'can'>;

/** Vínculo familiar, informações pessoais e canais de contato do responsável. */
export default function GuardianDetails({
    guardian,
    student,
    display,
}: GuardianDetailsProps): React.JSX.Element {
    const person = guardian.person;
    const relationship = display.relationshipLabel || '---';
    const birthDate = person.birth_date ? dateLabel(person.birth_date) : NOT_INFORMED;
    const age = display.age != null ? `${display.age} anos` : NOT_INFORMED;

    return (
        <CardBox>
            <FormSection
                id="guardian-relationship"
                title="Vínculo Familiar"
                variant="inline"
                iconClass="fa fa-users"
                tourTarget={GUARDIAN_TOUR_TARGETS.detailsRelationship}
            >
                <div className="guardianDetails__profile">
                    <img
                        src={person.photo_url ?? '/images/default-user.jpg'}
                        alt={`Foto de ${person.name}`}
                        className="guardianDetails__photo"
                    />
                    <p className="guardianDetails__name">{person.name}</p>
                    <TableLabel tone="inverse">{relationship}</TableLabel>
                </div>
                <DetailGrid>
                    <DetailField label="Parentesco / Relação">{relationship}</DetailField>
                    <DetailField label="Estudante Vinculado">{student.person.name}</DetailField>
                </DetailGrid>
            </FormSection>
            <FormSection
                id="guardian-personal"
                title="Informações Pessoais"
                variant="inline"
                iconClass="fa fa-user"
                tourTarget={GUARDIAN_TOUR_TARGETS.detailsPersonal}
            >
                <DetailGrid columns={3}>
                    <DetailField label="Nome Completo">{person.name}</DetailField>
                    <DetailField label="Gênero">{display.genderLabel || NOT_INFORMED}</DetailField>
                    <DetailField label="CPF / Documento">
                        {person.document || NOT_INFORMED}
                    </DetailField>
                    <DetailField label="Data de Nascimento">{birthDate}</DetailField>
                    <DetailField label="Idade">{age}</DetailField>
                </DetailGrid>
            </FormSection>
            <FormSection
                id="guardian-contact"
                title="Canais de Contato"
                variant="inline"
                iconClass="fa fa-address-book"
                tourTarget={GUARDIAN_TOUR_TARGETS.detailsContact}
            >
                <DetailGrid>
                    <DetailField label="Telefone / WhatsApp">
                        {person.phone || NOT_INFORMED}
                    </DetailField>
                    <DetailField label="E-mail">{person.email || NOT_INFORMED}</DetailField>
                    <DetailField label="Endereço Residencial" wide>
                        {display.addressHtml ? (
                            <RichTextContent html={display.addressHtml} />
                        ) : (
                            'Endereço não cadastrado.'
                        )}
                    </DetailField>
                </DetailGrid>
            </FormSection>
        </CardBox>
    );
}

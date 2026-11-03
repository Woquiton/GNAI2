import FormSection from '@/components/Forms/FormSection/FormSection';
import CardBox from '@/components/UI/CardBox/CardBox';
import DetailField from '@/components/UI/DetailField/DetailField';
import DetailGrid from '@/components/UI/DetailGrid/DetailGrid';
import RichTextContent from '@/components/UI/RichTextContent/RichTextContent';
import { dateLabel } from '@/utils/formatters';
import { TEACHER_TOUR_TARGETS } from '../teacherTours';
import type { TeacherShowProps } from '../Teachers.types';
import TeacherAssignments from './TeacherAssignments';
import './TeacherDetails.css';

type TeacherDetailsProps = Pick<TeacherShowProps, 'teacher' | 'display'>;

/** Identificação pessoal e vínculo docente, com as disciplinas atribuídas por curso. */
export default function TeacherDetails({
    teacher,
    display,
}: TeacherDetailsProps): React.JSX.Element {
    const { person } = teacher;

    return (
        <CardBox>
            <FormSection
                id="teacher-identification"
                title="Identificação Pessoal"
                variant="inline"
                iconClass="fa fa-user"
                tourTarget={TEACHER_TOUR_TARGETS.detailsIdentification}
            >
                <div className="teacherDetails__profile">
                    <img
                        src={person.photo_url ?? '/images/default-user.jpg'}
                        alt={`Foto de ${person.name}`}
                        className="teacherDetails__photo"
                    />
                    <p className="teacherDetails__name">{person.name}</p>
                    <p className="teacherDetails__role">Professor(a) / Docente</p>
                </div>
                <DetailGrid columns={3}>
                    <DetailField label="Nome Completo">{person.name}</DetailField>
                    <DetailField label="CPF / Documento">{person.document || '---'}</DetailField>
                    <DetailField label="Data de Nascimento">
                        {dateLabel(person.birth_date)}
                    </DetailField>
                    <DetailField label="E-mail de Contato">{person.email || '---'}</DetailField>
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
                id="teacher-assignment"
                title="Vínculo Docente"
                variant="inline"
                iconClass="fa fa-graduation-cap"
                tourTarget={TEACHER_TOUR_TARGETS.detailsAssignment}
            >
                <DetailGrid columns={3}>
                    <DetailField label="Matrícula">{teacher.registration}</DetailField>
                    <DetailField label="Data de Cadastro">{display.createdAt || '---'}</DetailField>
                </DetailGrid>
                <h3 className="teacherDetails__subheading">Disciplinas atribuídas</h3>
                <TeacherAssignments assignments={teacher.course_disciplines ?? []} />
            </FormSection>
        </CardBox>
    );
}

import FormSection from '@/components/Forms/FormSection/FormSection';
import CardBox from '@/components/UI/CardBox/CardBox';
import DetailField from '@/components/UI/DetailField/DetailField';
import DetailGrid from '@/components/UI/DetailGrid/DetailGrid';
import EmptyText from '@/components/UI/EmptyText/EmptyText';
import ExpandableContent from '@/components/UI/ExpandableContent/ExpandableContent';
import TagList from '@/components/UI/TagList/TagList';
import TableLabel from '@/components/UI/TableLabel/TableLabel';
import { supportRequestStatusTones } from '../SupportRequests.constants';
import type { SupportRequestRecord } from '../SupportRequests.types';

export default function SupportRequestDetails({
    record,
}: {
    record: SupportRequestRecord;
}): React.JSX.Element {
    return (
        <CardBox>
            <FormSection
                id="support-request-details-identification"
                title="Identificação"
                variant="inline"
                iconClass="fa fa-user"
            >
                <DetailGrid columns={3}>
                    <DetailField label="Protocolo">#{record.id}</DetailField>
                    <DetailField label="Aluno">{record.student_name}</DetailField>
                    <DetailField label="Matrícula">{record.registration}</DetailField>
                    <DetailField label="Situação do aluno">
                        <TableLabel tone={record.student_status_tone}>
                            {record.student_status_label}
                        </TableLabel>
                    </DetailField>
                    <DetailField label="Curso">{record.course_name || 'Não informado'}</DetailField>
                    <DetailField label="Cursos do cadastro">
                        <TagList
                            items={record.courses.map((name) => ({ id: name, name }))}
                            emptyMessage="Não informado"
                        />
                    </DetailField>
                    <DetailField label="Contato do aluno">
                        {record.student_contact || 'Não informado'}
                    </DetailField>
                    <DetailField label="Data da solicitação">
                        {record.request_date_label}
                    </DetailField>
                    <DetailField label="Solicitante">{record.requester_name}</DetailField>
                    <DetailField label="Vínculo com o aluno">
                        {record.requester_other || record.requester_role_label}
                    </DetailField>
                    <DetailField label="Contato do solicitante">
                        {record.requester_contact || 'Não informado'}
                    </DetailField>
                </DetailGrid>
            </FormSection>
            <FormSection
                id="support-request-details-demand"
                title="Solicitação"
                variant="inline"
                iconClass="fa fa-file-text-o"
            >
                <DetailGrid columns={2}>
                    <DetailField label="Motivo da solicitação" wide>
                        {record.reason_type_label}
                    </DetailField>
                    {record.reason_type === 'profile' ? (
                        <DetailField label="Perfis de atendimento" wide>
                            <TagList items={record.reason_profiles} emptyMessage="Não informado" />
                        </DetailField>
                    ) : null}
                    <DetailField label="Descrição do motivo" preserveLineBreaks>
                        <ExpandableContent>{record.reason || 'Não informado'}</ExpandableContent>
                    </DetailField>
                    <DetailField label="Dificuldades escolares" preserveLineBreaks>
                        <ExpandableContent>
                            {record.school_difficulties || 'Não informado'}
                        </ExpandableContent>
                    </DetailField>
                    <DetailField label="Situação diagnóstica informada">
                        {record.diagnosis_status_label}
                    </DetailField>
                    <DetailField label="Observações" preserveLineBreaks>
                        {record.diagnosis_notes || 'Não informado'}
                    </DetailField>
                    <DetailField label="Apoios solicitados">
                        <TagList
                            items={record.requested_support_labels.map((name) => ({
                                id: name,
                                name,
                            }))}
                            emptyMessage="Não informado"
                        />
                    </DetailField>
                    {record.other_support ? (
                        <DetailField label="Outro apoio" wide preserveLineBreaks>
                            {record.other_support}
                        </DetailField>
                    ) : null}
                </DetailGrid>
            </FormSection>
            <FormSection
                id="support-request-details-review"
                title="Análise e encaminhamentos"
                variant="inline"
                iconClass="fa fa-clipboard"
            >
                <DetailGrid columns={3}>
                    <DetailField label="Situação da solicitação">
                        <TableLabel tone={supportRequestStatusTones[record.status]}>
                            {record.status_label}
                        </TableLabel>
                    </DetailField>
                    <DetailField label="Registrada por">{record.created_by_name}</DetailField>
                    <DetailField label="Registrada em">{record.created_at_label}</DetailField>
                    <DetailField label="Última atualização">{record.updated_at_label}</DetailField>
                    <DetailField label="Análise inicial" wide preserveLineBreaks>
                        <ExpandableContent>
                            {record.analysis_notes || 'Nenhuma análise registrada.'}
                        </ExpandableContent>
                    </DetailField>
                    <DetailField label="Providências e encaminhamentos" wide preserveLineBreaks>
                        <ExpandableContent>
                            {record.referrals || 'Nenhum encaminhamento registrado.'}
                        </ExpandableContent>
                    </DetailField>
                </DetailGrid>
            </FormSection>
            <FormSection
                id="support-request-details-files"
                title="Documentos"
                variant="inline"
                iconClass="fa fa-paperclip"
            >
                {record.attachments.length ? (
                    <ul>
                        {record.attachments.map((file) => (
                            <li key={file.id}>
                                <a href={file.url}>{file.name}</a>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <EmptyText>Nenhum documento anexado.</EmptyText>
                )}
            </FormSection>
        </CardBox>
    );
}

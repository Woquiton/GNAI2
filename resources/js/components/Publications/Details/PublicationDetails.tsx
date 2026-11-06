import FormSection from '@/components/Forms/FormSection/FormSection';
import CardBox from '@/components/UI/CardBox/CardBox';
import DetailGrid from '@/components/UI/DetailGrid/DetailGrid';
import DetailField from '@/components/UI/DetailField/DetailField';
import ExpandableContent from '@/components/UI/ExpandableContent/ExpandableContent';
import RichTextContent from '@/components/UI/RichTextContent/RichTextContent';
import TableLabel from '@/components/UI/TableLabel/TableLabel';
import { scheduleStatusLabels } from '../Publications.constants';
import type { PublicationRecord } from '../Publications.types';
import { PUBLICATION_TOUR_TARGETS } from '../publicationTours';
import '@styles/components/Publications/Details/PublicationDetails.css';
export default function PublicationDetails({
    publication,
}: {
    publication: PublicationRecord;
}): React.JSX.Element {
    const statusLabel = publication.schedule_status
        ? scheduleStatusLabels[publication.schedule_status]
        : null;
    return (
        <CardBox className="publicationShow__card">
            <FormSection
                id="publication-show-main"
                tourTarget={PUBLICATION_TOUR_TARGETS.showContent}
                title="Conteúdo"
                variant="inline"
                iconClass="fa fa-file-text-o"
            >
                <DetailGrid columns={3}>
                    <DetailField label="Título">{publication.title}</DetailField>
                    <DetailField label="Resumo">
                        {publication.summary || 'Nenhum resumo informado.'}
                    </DetailField>
                    <DetailField label="Tipo">{publication.type_label}</DetailField>
                    <DetailField label="Etiquetas">
                        {publication.tags.map((tag) => tag.name).join(', ') || 'Não informado'}
                    </DetailField>
                    <DetailField label="Autor">
                        {publication.author_name || 'Não informado'}
                    </DetailField>
                    <DetailField label="Link">
                        {publication.link_url ? (
                            <a
                                href={publication.link_url}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {publication.link_label || publication.link_url}
                            </a>
                        ) : (
                            'Não informado'
                        )}
                    </DetailField>
                    <DetailField label="Texto da publicação" wide>
                        {publication.description_html ? (
                            <div data-tour={PUBLICATION_TOUR_TARGETS.showDescription}>
                                <ExpandableContent>
                                    <RichTextContent
                                        html={publication.description_html}
                                        className="publicationShow__richText"
                                    />
                                </ExpandableContent>
                            </div>
                        ) : (
                            'Nenhum texto fornecido.'
                        )}
                    </DetailField>
                </DetailGrid>
            </FormSection>
            <FormSection
                id="publication-show-details"
                tourTarget={PUBLICATION_TOUR_TARGETS.showSchedule}
                title="Datas e local"
                variant="inline"
                iconClass="fa fa-calendar"
            >
                <DetailGrid columns={4}>
                    {publication.has_schedule ? (
                        <>
                            <DetailField label="Data de Início">
                                {publication.start_date_label}
                            </DetailField>
                            <DetailField label="Horário de Início">
                                {publication.start_time || 'Não informado'}
                            </DetailField>
                            <DetailField label="Data de Término">
                                {publication.end_date_label}
                            </DetailField>
                            <DetailField label="Horário de Término">
                                {publication.end_time || 'Não informado'}
                            </DetailField>
                            <DetailField label="Andamento">
                                {statusLabel || 'Não informado'}
                            </DetailField>
                        </>
                    ) : (
                        <DetailField label="Datas" wide>
                            Publicação sem data de início e término.
                        </DetailField>
                    )}
                    <DetailField label="Local">
                        {publication.location || 'Não informado'}
                    </DetailField>
                    <DetailField label="Organizador">
                        {publication.organizer || 'Não informado'}
                    </DetailField>
                    <DetailField label="Público">
                        {publication.audience || 'Não informado'}
                    </DetailField>
                    <DetailField label="Participantes" wide={Boolean(publication.speakers?.length)}>
                        {publication.speakers?.length ? (
                            <ul className="publicationShow__people">
                                {publication.speakers.map((speaker) => (
                                    <li key={speaker.id}>
                                        <img
                                            src={speaker.photo_url ?? '/images/default-user.jpg'}
                                            alt=""
                                        />
                                        <span>
                                            {speaker.name}
                                            {speaker.participation || speaker.role ? (
                                                <small>
                                                    {[speaker.participation, speaker.role]
                                                        .filter(Boolean)
                                                        .join(' · ')}
                                                </small>
                                            ) : null}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            'Nenhum participante vinculado.'
                        )}
                    </DetailField>
                </DetailGrid>
            </FormSection>
            <FormSection
                id="publication-show-media"
                tourTarget={PUBLICATION_TOUR_TARGETS.showMedia}
                title="Mídia"
                variant="inline"
                iconClass="fa fa-picture-o"
            >
                <DetailGrid>
                    <DetailField label="Capa">
                        {publication.cover_url ? (
                            <figure className="publicationShow__cover">
                                <img
                                    src={publication.cover_url}
                                    alt={publication.cover_alt ?? ''}
                                />
                                <figcaption>
                                    Texto alternativo: {publication.cover_alt || 'não informado'}
                                </figcaption>
                            </figure>
                        ) : (
                            'Nenhuma capa enviada.'
                        )}
                    </DetailField>
                    <DetailField label="Galeria">
                        {publication.gallery?.length ? (
                            <ul className="publicationShow__gallery">
                                {publication.gallery.map((image) => (
                                    <li key={image.id}>
                                        <img src={image.url} alt={image.alt} />
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            'Nenhuma foto na galeria.'
                        )}
                    </DetailField>
                </DetailGrid>
            </FormSection>
            <FormSection
                id="publication-show-visibility"
                tourTarget={PUBLICATION_TOUR_TARGETS.showVisibility}
                title="Publicação no site"
                variant="inline"
                iconClass="fa fa-bullhorn"
            >
                <DetailGrid columns={3}>
                    <DetailField label="Situação">
                        <TableLabel tone={publication.is_active ? 'success' : 'inverse'}>
                            {publication.is_active ? 'Publicado' : 'Rascunho'}
                        </TableLabel>
                    </DetailField>
                    <DetailField label="Data de publicação">
                        {publication.published_at_label}
                    </DetailField>
                    <DetailField label="Destaque">
                        {publication.is_featured ? 'Sim' : 'Não'}
                    </DetailField>
                    <DetailField label="Endereço da página">
                        {publication.slug
                            ? `/site/publicacoes/${publication.slug}`
                            : 'Não informado'}
                    </DetailField>
                    <DetailField label="Título para buscadores">
                        {publication.seo_title || 'Usa o título da publicação'}
                    </DetailField>
                    <DetailField label="Descrição para buscadores">
                        {publication.seo_description || 'Usa o resumo'}
                    </DetailField>
                </DetailGrid>
            </FormSection>
        </CardBox>
    );
}

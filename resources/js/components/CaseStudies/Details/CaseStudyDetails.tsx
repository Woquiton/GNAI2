import { usePage } from '@inertiajs/react';
import type { ReactNode } from 'react';
import CardBox from '@/components/UI/CardBox/CardBox';
import ChatConversation, {
    type ChatConversationMessage,
} from '@/components/UI/ChatConversation/ChatConversation';
import DetailField from '@/components/UI/DetailField/DetailField';
import DetailGrid from '@/components/UI/DetailGrid/DetailGrid';
import ExpandableContent from '@/components/UI/ExpandableContent/ExpandableContent';
import ImageDisplay from '@/components/UI/ImageDisplay/ImageDisplay';
import RichTextContent from '@/components/UI/RichTextContent/RichTextContent';
import TableLabel from '@/components/UI/TableLabel/TableLabel';
import { dateLabel, dateTimeLabel } from '@/utils/formatters';
import { joinClassNames } from '@/utils/joinClassNames';
import type { CaseStudyDetail, CaseStudyShowProps } from '../CaseStudies.types';
import { CASE_STUDY_TOUR_TARGETS } from '../caseStudyTours';
import CaseStudyContributionForm from './CaseStudyContributionForm';
import CaseStudyEntryList, { CaseStudyEntryMeta, CaseStudyEntryText } from './CaseStudyEntryList';
import '@styles/components/CaseStudies/Details/CaseStudyDetails.css';

type CaseStudyBarrier = CaseStudyDetail['barriers'][number];
type CaseStudyStrategy = CaseStudyDetail['strategies'][number];

/** Texto simples longo (textarea), recolhível com "Ver mais" como os textos ricos. */
function longText(text: string): React.JSX.Element {
    return (
        <ExpandableContent>
            <CaseStudyEntryText>{text}</CaseStudyEntryText>
        </ExpandableContent>
    );
}

/** Texto rico sanitizado pelo servidor, recolhível quando extenso. */
function richText(html: string | null): React.JSX.Element {
    return (
        <ExpandableContent>
            <RichTextContent html={html || 'Não informado'} />
        </ExpandableContent>
    );
}

function renderBarrier(barrier: CaseStudyBarrier): React.JSX.Element {
    return (
        <>
            <strong>{barrier.type_label}</strong>
            {longText(barrier.observed_situation)}
            <CaseStudyEntryMeta>Implicação: {barrier.participation_implication}</CaseStudyEntryMeta>
        </>
    );
}

function renderStrategy(strategy: CaseStudyStrategy): React.JSX.Element {
    return (
        <>
            {longText(strategy.description)}
            {strategy.linked_barrier_label ? (
                <CaseStudyEntryMeta>
                    Relacionada à barreira: {strategy.linked_barrier_label}
                </CaseStudyEntryMeta>
            ) : null}
        </>
    );
}

/** Bloco da ficha com o título em caixa alta do perfil Ubold, separado só pelo espaçamento. */
function ProfileSection({
    title,
    iconClass,
    className,
    tourTarget,
    children,
}: {
    title: string;
    iconClass: string;
    className?: string;
    /** Valor de `data-tour` do bloco no tutorial ao vivo. */
    tourTarget?: string;
    children: ReactNode;
}): React.JSX.Element {
    return (
        <section
            className={joinClassNames('caseStudyProfile__section', className)}
            data-tour={tourTarget}
        >
            <h2 className="caseStudyProfile__heading">
                <i className={iconClass} aria-hidden="true" />
                {title}
            </h2>
            {children}
        </section>
    );
}

/** Dados empilhados da coluna lateral, como as informações pessoais do perfil. */
function AboutList({ children }: { children: ReactNode }): React.JSX.Element {
    return <DetailGrid className="caseStudyProfile__about">{children}</DetailGrid>;
}

/**
 * Visualização do Estudo de Caso, tudo em uma tela: cabeçalho do aluno; à esquerda a ficha curta
 * (demanda, aceite e apoios) e à direita os textos longos (escuta, potencialidades, barreiras e
 * estratégias); por fim, na largura do card, as contribuições no chat do Ubold com o envio ao lado.
 */
export default function CaseStudyDetails({
    student,
    caseStudy,
    can,
}: CaseStudyShowProps): React.JSX.Element {
    const currentUserId = usePage<{ auth: { user: { id: number } | null } }>().props.auth.user?.id;
    const messages: ChatConversationMessage[] = caseStudy.contributions.map((contribution) => ({
        id: contribution.id,
        author: contribution.author_name || 'Usuário removido',
        meta: contribution.role,
        text: contribution.content,
        time: dateTimeLabel(contribution.created_at),
        avatarUrl: contribution.author_photo_url,
        own: currentUserId !== undefined && contribution.author_id === currentUserId,
    }));

    return (
        <CardBox className="caseStudyProfile">
            <header
                className="caseStudyProfile__banner"
                data-tour={CASE_STUDY_TOUR_TARGETS.detailsBanner}
            >
                <ImageDisplay
                    src={student.photo_url || '/images/default-user.jpg'}
                    alt={`Foto de ${student.name}`}
                    shape="thumbnail"
                    size="lg"
                    className="caseStudyProfile__photo"
                />
                <h2 className="caseStudyProfile__name">{student.name}</h2>
                <p className="caseStudyProfile__meta">
                    <i className="fa fa-id-card-o" aria-hidden="true" /> Matrícula:{' '}
                    {student.registration || 'Não informado'}
                </p>
                <p className="caseStudyProfile__tags">
                    <TableLabel tone={caseStudy.status_tone}>{caseStudy.status_label}</TableLabel>
                    <span>
                        Versão <strong>v{caseStudy.version}</strong>
                    </span>
                    <span>Semestre: {caseStudy.semester_label || 'Não informado'}</span>
                </p>
            </header>
            <div className="caseStudyProfile__columns">
                <div
                    className="caseStudyProfile__summary"
                    data-tour={CASE_STUDY_TOUR_TARGETS.detailsSummary}
                >
                    <ProfileSection title="Identificação da Demanda" iconClass="fa fa-bullhorn">
                        <AboutList>
                            <DetailField label="Origem da demanda">
                                {caseStudy.demand_origin_label}
                            </DetailField>
                            <DetailField label="Data do Estudo de Caso">
                                {dateLabel(caseStudy.study_date)}
                            </DetailField>
                            <DetailField label="Criador">
                                {caseStudy.creator_name || 'Não informado'}
                            </DetailField>
                            <DetailField label="Participantes (resumo)">
                                {richText(caseStudy.participants_summary)}
                            </DetailField>
                        </AboutList>
                    </ProfileSection>
                    <ProfileSection
                        title="Aceite da Família/Estudante"
                        iconClass="fa fa-thumbs-o-up"
                    >
                        <AboutList>
                            <DetailField label="Status de aceite">
                                {caseStudy.acceptance_status_label}
                            </DetailField>
                            <DetailField label="Data do aceite">
                                {dateLabel(caseStudy.acceptance_date)}
                            </DetailField>
                            {caseStudy.completed_at ? (
                                <DetailField label="Concluído em">
                                    {dateTimeLabel(caseStudy.completed_at)}
                                </DetailField>
                            ) : null}
                        </AboutList>
                    </ProfileSection>
                    <ProfileSection title="Apoios" iconClass="fa fa-life-ring">
                        <AboutList>
                            <DetailField label="Apoios necessários">
                                {caseStudy.needed_supports_label || 'Não informado'}
                            </DetailField>
                            <DetailField label="Justificativa dos apoios necessários">
                                {richText(caseStudy.needed_supports_justification)}
                            </DetailField>
                        </AboutList>
                    </ProfileSection>
                </div>
                <div className="caseStudyProfile__content">
                    <ProfileSection
                        title="Escuta e Observação"
                        iconClass="fa fa-comments-o"
                        tourTarget={CASE_STUDY_TOUR_TARGETS.detailsListening}
                    >
                        <DetailGrid>
                            <DetailField label="Observação do estudante" wide>
                                {richText(caseStudy.student_observation)}
                            </DetailField>
                            <DetailField label="Escuta do estudante/família" wide>
                                {richText(caseStudy.student_family_listening)}
                            </DetailField>
                            <DetailField label="Escuta dos professores" wide>
                                {richText(caseStudy.teachers_listening)}
                            </DetailField>
                            <DetailField label="Outras informações">
                                {richText(caseStudy.other_info)}
                            </DetailField>
                            <DetailField label="Observações da rede de cuidado">
                                {richText(caseStudy.care_network_notes)}
                            </DetailField>
                        </DetailGrid>
                    </ProfileSection>
                    <ProfileSection
                        title="Potencialidades"
                        iconClass="fa fa-star-o"
                        tourTarget={CASE_STUDY_TOUR_TARGETS.detailsPotentials}
                    >
                        <DetailGrid>
                            <DetailField label="Aspectos favoráveis">
                                {richText(caseStudy.favorable_aspects)}
                            </DetailField>
                            <DetailField label="Potenciais e interesses">
                                {richText(caseStudy.potentials_interests)}
                            </DetailField>
                        </DetailGrid>
                    </ProfileSection>
                    <div
                        className="caseStudyProfile__pair"
                        data-tour={CASE_STUDY_TOUR_TARGETS.detailsBarriers}
                    >
                        <ProfileSection title="Barreiras" iconClass="fa fa-ban">
                            <CaseStudyEntryList
                                items={caseStudy.barriers}
                                itemKey={(barrier) => barrier.id}
                                renderItem={renderBarrier}
                                emptyMessage="Nenhuma barreira registrada."
                            />
                        </ProfileSection>
                        <ProfileSection title="Estratégias" iconClass="fa fa-lightbulb-o">
                            <CaseStudyEntryList
                                items={caseStudy.strategies}
                                itemKey={(strategy) => strategy.id}
                                renderItem={renderStrategy}
                                emptyMessage="Nenhuma estratégia registrada."
                            />
                        </ProfileSection>
                    </div>
                </div>
            </div>
            <ProfileSection
                title="Contribuições"
                iconClass="fa fa-users"
                className="caseStudyProfile__contributions"
                tourTarget={CASE_STUDY_TOUR_TARGETS.detailsContributions}
            >
                <ChatConversation
                    label="Contribuições do Estudo de Caso"
                    messages={messages}
                    emptyMessage="Nenhuma contribuição registrada."
                    composer={
                        can.contribute ? (
                            <CaseStudyContributionForm caseStudyId={caseStudy.id} />
                        ) : undefined
                    }
                />
            </ProfileSection>
        </CardBox>
    );
}

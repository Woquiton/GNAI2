import FormSection from '@/components/Forms/FormSection/FormSection';
import DetailField from '@/components/UI/DetailField/DetailField';
import DetailGrid from '@/components/UI/DetailGrid/DetailGrid';
import ExpandableContent from '@/components/UI/ExpandableContent/ExpandableContent';
import RichTextContent from '@/components/UI/RichTextContent/RichTextContent';
import { dateLabel } from '@/utils/formatters';
import { PAEE_NOT_INFORMED } from '../Paees.constants';
import type { PaeeShowRecord } from '../Paees.types';
import { PAEE_TOUR_TARGETS } from '../paeeTours';
import PaeeEntryList from './PaeeEntryList';
import PaeeReviewForm from './PaeeReviewForm';

type PaeeReview = PaeeShowRecord['reviews'][number];

interface PaeeReviewsProps {
    paeeId: number;
    reviews: PaeeShowRecord['reviews'];
    /** Permissão de edição do PAEE: libera o registro de novas revisões. */
    canReview: boolean;
}

function renderReview(review: PaeeReview): React.JSX.Element {
    const heading = `${dateLabel(review.reviewed_at)}, ${review.reviewer_name || PAEE_NOT_INFORMED}`;

    return (
        <>
            <strong>{heading}</strong>
            <DetailGrid>
                <DetailField label="O que mudou">
                    <ExpandableContent>
                        <RichTextContent html={review.what_changed || PAEE_NOT_INFORMED} />
                    </ExpandableContent>
                </DetailField>
                <DetailField label="Por quê">
                    <ExpandableContent>
                        <RichTextContent html={review.why || PAEE_NOT_INFORMED} />
                    </ExpandableContent>
                </DetailField>
            </DetailGrid>
        </>
    );
}

/** Histórico de revisões manuais e, com permissão, o formulário de nova revisão. */
export default function PaeeReviews({
    paeeId,
    reviews,
    canReview,
}: PaeeReviewsProps): React.JSX.Element {
    return (
        <FormSection
            id="paee-reviews"
            tourTarget={PAEE_TOUR_TARGETS.reviews}
            title="Revisões"
            variant="inline"
            iconClass="fa fa-history"
        >
            <PaeeEntryList
                items={reviews}
                itemKey={(review) => review.id}
                emptyMessage="Nenhuma revisão registrada."
                renderItem={renderReview}
            />
            {canReview ? <PaeeReviewForm paeeId={paeeId} /> : null}
        </FormSection>
    );
}

import { useMemo } from 'react';
import Button from '@/components/UI/Button/Button';
import ImageLightbox from '@/components/UI/ImageLightbox/ImageLightbox';
import OwlCarousel from '@/components/UI/OwlCarousel/OwlCarousel';
import type { OwlCarouselOptions } from '@/components/UI/OwlCarousel/OwlCarousel.types';
import type {
    InspectionEvidence,
    InspectionFavoriteOptions,
} from './InspectionEvidenceCarousel.types';
import { INSPECTION_TOUR_TARGETS } from '../inspectionTours';
import './InspectionEvidenceCarousel.css';

const evidenceIconClasses: Record<string, string> = {
    'fa-file-pdf': 'fa fa-file-pdf-o',
    'fa-file-word': 'fa fa-file-word-o',
    'fa-file-powerpoint': 'fa fa-file-powerpoint-o',
    'fa-file-excel': 'fa fa-file-excel-o',
};

export default function InspectionEvidenceCarousel({
    evidences,
    favorite,
}: {
    evidences: InspectionEvidence[];
    favorite?: InspectionFavoriteOptions;
}): React.JSX.Element {
    const hasMultipleEvidences = evidences.length > 1;
    const tabletItems = Math.min(evidences.length, 2);
    const desktopItems = Math.min(evidences.length, 3);
    const canFavorite = Boolean(favorite?.onSelect);
    const options = useMemo<OwlCarouselOptions>(
        () => ({
            loop: hasMultipleEvidences && !canFavorite,
            autoplay: hasMultipleEvidences && !canFavorite,
            autoplayTimeout: 5000,
            autoplayHoverPause: true,
            items: desktopItems,
            margin: 0,
            nav: false,
            dots: hasMultipleEvidences,
            responsive: {
                0: { items: 1 },
                600: { items: tabletItems },
                1000: { items: desktopItems },
            },
        }),
        [desktopItems, hasMultipleEvidences, tabletItems, canFavorite],
    );

    function handleAction(action: string, id: string): void {
        if (action !== 'favorite' || favorite?.disabled) return;
        const image = evidences.find((evidence) => evidence.id === Number(id) && evidence.isImage);
        if (image && image.id !== favorite?.selectedId) favorite?.onSelect?.(image);
    }

    return (
        <ImageLightbox className="inspectionEvidenceCarousel" deduplicateByHref>
            <OwlCarousel
                options={options}
                theme
                label="Evidências da vistoria"
                onAction={handleAction}
            >
                {evidences.map((evidence, index) => {
                    const selected = favorite?.selectedId === evidence.id;
                    const favoriteTitle = selected
                        ? 'Imagem favorita e capa'
                        : 'Favoritar como capa';
                    const favoriteLabel = selected
                        ? `Imagem favorita e capa: ${evidence.name}`
                        : `Favoritar ${evidence.name} como capa`;
                    return (
                        <div className="item" key={evidence.id}>
                            <a
                                className="inspectionEvidenceCarousel__slide"
                                href={evidence.url}
                                target={evidence.isImage ? undefined : '_blank'}
                                rel={evidence.isImage ? undefined : 'noopener noreferrer'}
                                data-lightbox={evidence.isImage ? 'evidence' : undefined}
                                title={evidence.isImage ? evidence.name : undefined}
                                aria-label={`Abrir evidência ${evidence.name}`}
                            >
                                {evidence.isImage ? (
                                    <img
                                        className="inspectionEvidenceCarousel__image"
                                        src={evidence.url}
                                        alt={`Evidência ${evidence.name}`}
                                        loading={index === 0 ? 'eager' : 'lazy'}
                                    />
                                ) : (
                                    <span className="inspectionEvidenceCarousel__document">
                                        <i
                                            className={
                                                evidenceIconClasses[evidence.iconClass] ??
                                                'fa fa-file-o'
                                            }
                                            aria-hidden="true"
                                        />
                                        <span>{evidence.name}</span>
                                    </span>
                                )}
                                <span className="inspectionEvidenceCarousel__caption">
                                    {evidence.name}
                                </span>
                            </a>
                            {evidence.isImage && (canFavorite || selected) ? (
                                <span
                                    className="inspectionEvidenceCarousel__favorite"
                                    data-carousel-action="favorite"
                                    data-carousel-id={evidence.id}
                                    data-tour={INSPECTION_TOUR_TARGETS.cover}
                                >
                                    <Button
                                        type="button"
                                        iconOnly
                                        waves={false}
                                        tone="list-action"
                                        leftIconClass={selected ? 'fa fa-star' : 'fa fa-star-o'}
                                        title={favoriteTitle}
                                        aria-label={favoriteLabel}
                                        aria-pressed={selected}
                                        disabled={!canFavorite || favorite?.disabled || selected}
                                    />
                                </span>
                            ) : null}
                        </div>
                    );
                })}
            </OwlCarousel>
        </ImageLightbox>
    );
}

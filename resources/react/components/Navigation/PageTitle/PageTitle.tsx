import { useId, type ReactNode } from 'react';
import { joinClassNames } from '@/utils/joinClassNames';
import { PAGE_ACTIONS_TOUR_TARGET, PAGE_TITLE_TOUR_TARGET } from './pageTitleTour';
import './PageTitle.css';

interface PageTitleProps {
    title: string;
    subtitle?: string;
    actions?: ReactNode;
    titleAs?: 'h1' | 'h2' | 'h3';
    className?: string;
}

export default function PageTitle({
    title,
    subtitle,
    actions,
    titleAs: Heading = 'h1',
    className,
}: PageTitleProps): React.JSX.Element {
    const titleId = useId();
    return (
        <header
            className={joinClassNames('pageTitle', className)}
            aria-labelledby={titleId}
            data-tour={PAGE_TITLE_TOUR_TARGET}
        >
            <div className="pageTitle__text">
                <Heading id={titleId} className="pageTitle__heading">
                    {title}
                </Heading>
                {subtitle ? <p className="pageTitle__subtitle">{subtitle}</p> : null}
            </div>
            {actions ? (
                <div className="pageTitle__actions" data-tour={PAGE_ACTIONS_TOUR_TARGET}>
                    {actions}
                </div>
            ) : null}
        </header>
    );
}

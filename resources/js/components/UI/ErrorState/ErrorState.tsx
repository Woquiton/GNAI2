import Button from '@/components/UI/Button/Button';
import { errorDescriptions, errorStateCopy as copy } from './ErrorState.data';
import type { ErrorCode, ErrorDescription } from './ErrorState.types';
import '@styles/components/UI/ErrorState/ErrorState.css';

export default function ErrorState({
    code,
    description = errorDescriptions[code],
    homeHref = 'index.html',
    homeLabel = copy.home,
}: {
    code: ErrorCode;
    description?: ErrorDescription;
    homeHref?: string;
    homeLabel?: string;
}): React.JSX.Element {
    return (
        <section className="errorState" aria-label={`${copy.label} ${code}`}>
            <div className="errorState__code" aria-hidden="true">
                <span className="errorState__primary">{code[0]}</span>
                {code[1] === '0' && code !== '400' ? (
                    <i className="ti-face-sad errorState__pink" aria-hidden="true" />
                ) : (
                    <span className="errorState__pink">{code[1]}</span>
                )}
                {code === '500' ? (
                    <i className="ti-face-sad errorState__info" aria-hidden="true" />
                ) : (
                    <span className="errorState__info">{code[2]}</span>
                )}
            </div>
            <h1>{description.title}</h1>
            <br />
            {description.paragraphs.map((text) => (
                <p key={text}>{text}</p>
            ))}
            <br />
            <Button
                href={homeHref}
                label={homeLabel}
                tone="list-action"
                className="errorState__home"
            />
        </section>
    );
}

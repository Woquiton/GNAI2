import Countdown from '@/components/UI/Countdown/Countdown';
import RotatingText from '@/components/UI/RotatingText/RotatingText';
import { comingSoonCopy as copy } from './StatusPage.data';
import './StatusPage.css';
export default function StatusPage({
    kind,
}: {
    kind: 'maintenance' | 'coming-soon';
}): React.JSX.Element {
    const maintenance = kind === 'maintenance';
    return (
        <main
            className={`statusPage${maintenance ? ' statusPage--maintenance' : ''}`}
            aria-label={maintenance ? 'Manutenção' : 'Em breve'}
        >
            <div className="statusPage__background" aria-hidden="true" />
            <div className="statusPage__container">
                <div className="statusPage__wrapper">
                    <div className="statusPage__icon" aria-hidden="true">
                        <i className={maintenance ? 'ti-settings' : 'md md-album'} />
                    </div>
                    <h1 className="statusPage__title">
                        {maintenance ? (
                            <>
                                <span>Gnai</span> <span>em</span> <span>manutenção</span>
                            </>
                        ) : (
                            <RotatingText texts={copy.titles} />
                        )}
                    </h1>
                    {maintenance ? (
                        <p className="statusPage__description">
                            Estamos melhorando o sistema. Voltaremos em breve.
                        </p>
                    ) : (
                        <>
                            <p>
                                {copy.description[0]}
                                <br />
                                {copy.description[1]}
                            </p>
                            <div className="statusPage__countdown">
                                <Countdown endTime={copy.endTime} />
                            </div>
                        </>
                    )}
                </div>
            </div>
        </main>
    );
}

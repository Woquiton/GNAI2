import { useId, useState } from 'react';
import { joinClassNames } from '@/utils/joinClassNames';
import type { GuidedTourStep } from './GuidedTour.types';

interface GuidedTourTrailProps {
    steps: GuidedTourStep[];
    currentIndex: number;
    onSelect: (index: number) => void;
}

interface TrailGroup {
    label: string | null;
    items: { step: GuidedTourStep; index: number }[];
}

/** Passos seguidos do mesmo grupo ficam juntos; passos sem grupo formam blocos sem título. */
function groupSteps(steps: GuidedTourStep[]): TrailGroup[] {
    return steps.reduce<TrailGroup[]>((groups, step, index) => {
        const label = step.group ?? null;
        const last = groups[groups.length - 1];

        if (last && last.label === label) {
            last.items.push({ step, index });
        } else {
            groups.push({ label, items: [{ step, index }] });
        }

        return groups;
    }, []);
}

/** Lista recolhível com todos os passos, para pular direto para qualquer parte da tela. */
export default function GuidedTourTrail({
    steps,
    currentIndex,
    onSelect,
}: GuidedTourTrailProps): React.JSX.Element {
    const [open, setOpen] = useState(false);
    const listId = useId();

    return (
        <div className="guidedTour__trail">
            <button
                type="button"
                className="guidedTour__trailToggle"
                aria-expanded={open}
                aria-controls={listId}
                onClick={() => setOpen((current) => !current)}
            >
                <i className={open ? 'fa fa-angle-up' : 'fa fa-angle-down'} aria-hidden="true" />
                {open ? 'Esconder os passos' : 'Ver todos os passos'}
            </button>
            <ol id={listId} className="guidedTour__trailList" role="list" hidden={!open}>
                {groupSteps(steps).map((group) => (
                    <li key={group.items[0].step.id} className="guidedTour__trailGroup">
                        {group.label ? (
                            <span className="guidedTour__trailGroupLabel">{group.label}</span>
                        ) : null}
                        <ol className="guidedTour__trailSteps" role="list">
                            {group.items.map(({ step, index }) => (
                                <li key={step.id}>
                                    <button
                                        type="button"
                                        className={joinClassNames(
                                            'guidedTour__trailStep',
                                            index === currentIndex && 'is-current',
                                            index < currentIndex && 'is-done',
                                        )}
                                        aria-current={index === currentIndex ? 'step' : undefined}
                                        onClick={() => onSelect(index)}
                                    >
                                        <span
                                            className="guidedTour__trailNumber"
                                            aria-hidden="true"
                                        >
                                            {index + 1}
                                        </span>
                                        {step.title}
                                    </button>
                                </li>
                            ))}
                        </ol>
                    </li>
                ))}
            </ol>
        </div>
    );
}

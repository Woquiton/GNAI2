import InlineAlert from '@/components/UI/InlineAlert/InlineAlert';
import { SEMESTER_TOUR_TARGETS } from '../semesterTours';
import '@styles/components/Semesters/List/SemesterList.css';

/** Explica o papel do semestre atual abaixo da listagem de semestres. */
export default function SemesterCurrentNotice(): React.JSX.Element {
    return (
        <div data-tour={SEMESTER_TOUR_TARGETS.currentNotice}>
            <InlineAlert variant="info" className="semesterList__info">
                <i className="fa fa-info-circle" aria-hidden="true" /> O{' '}
                <strong>Semestre Atual</strong> determina qual período será selecionado por padrão
                em novos registros do sistema.
            </InlineAlert>
        </div>
    );
}

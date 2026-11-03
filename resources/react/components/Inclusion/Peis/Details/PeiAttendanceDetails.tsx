import FormSection from '@/components/Forms/FormSection/FormSection';
import RichTextContent from '@/components/UI/RichTextContent/RichTextContent';
import type {
    PeiAttendanceActivity,
    PeiAttendanceMonitoring,
    PeiAttendanceReturn,
    PeiAttendanceSummary,
} from '../Peis.types';
import PeiTimeline from './PeiTimeline';
import { PEI_TOUR_TARGETS } from '../peiTours';

const NO_DATE = 'Sem data';

interface PeiAttendanceDetailsProps {
    summary: PeiAttendanceSummary;
}

function ActivityEntry({ activity }: { activity: PeiAttendanceActivity }): React.JSX.Element {
    return (
        <>
            <strong>{activity.date ?? NO_DATE}</strong>, {activity.professional ?? '—'}
            <RichTextContent html={activity.text_html} />
        </>
    );
}

function MonitoringEntry({ item }: { item: PeiAttendanceMonitoring }): React.JSX.Element {
    return (
        <>
            <strong>{item.date ?? NO_DATE}</strong> ({item.source})
            <RichTextContent html={item.text_html} />
            {item.indicators_html ? (
                <div>
                    <small>Indicadores:</small>
                    <RichTextContent html={item.indicators_html} />
                </div>
            ) : null}
            {item.adjustments_html ? (
                <div>
                    <small>Ajustes:</small>
                    <RichTextContent html={item.adjustments_html} />
                </div>
            ) : null}
        </>
    );
}

function ReturnEntry({ item }: { item: PeiAttendanceReturn }): React.JSX.Element {
    return (
        <>
            <strong>{item.date ?? NO_DATE}</strong>, {item.source}, {item.professional ?? '—'}
            <br />
            <small>Responsáveis presentes: {item.guardians ?? '—'}</small>
            <RichTextContent html={item.summary_html} />
        </>
    );
}

/**
 * Atividades, acompanhamento e devolutivas do semestre (Portaria 421/2026,
 * art. 11, I/III/IV), reunidos dos atendimentos AEE e pedagógicos do aluno.
 */
export default function PeiAttendanceDetails({
    summary,
}: PeiAttendanceDetailsProps): React.JSX.Element {
    return (
        <FormSection
            id="pei-attendance"
            tourTarget={PEI_TOUR_TARGETS.attendance}
            title="Atividades, Acompanhamento e Devolutivas do Semestre"
            description="Reunido automaticamente a partir dos atendimentos AEE e pedagógicos deste aluno dentro do semestre do PEI; não exige preenchimento aqui."
            iconClass="fa fa-calendar-check-o"
            variant="inline"
        >
            <PeiTimeline
                title="Atividades na SRM e em outros espaços do AEE"
                items={summary.activities}
                itemKey={(activity) => activity.id}
                renderItem={(activity) => <ActivityEntry activity={activity} />}
                emptyMessage="Nenhum atendimento AEE registrado neste semestre."
            />
            <PeiTimeline
                title="Acompanhamento e Monitoramento"
                items={summary.monitoring}
                itemKey={(item) => item.id}
                renderItem={(item) => <MonitoringEntry item={item} />}
                emptyMessage="Nenhum acompanhamento registrado neste semestre."
            />
            <PeiTimeline
                title="Devolutivas às Famílias"
                items={summary.returns}
                itemKey={(item) => item.id}
                renderItem={(item) => <ReturnEntry item={item} />}
                emptyMessage="Nenhuma devolutiva à família registrada neste semestre."
            />
        </FormSection>
    );
}

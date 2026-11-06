import FormSection from '@/components/Forms/FormSection/FormSection';
import CardBox from '@/components/UI/CardBox/CardBox';
import DetailField from '@/components/UI/DetailField/DetailField';
import DetailGrid from '@/components/UI/DetailGrid/DetailGrid';
import TableLabel from '@/components/UI/TableLabel/TableLabel';
import { dateLabel } from '@/utils/formatters';
import { SEMESTER_TOUR_TARGETS } from '../semesterTours';
import { semesterLabel } from '../Semesters.constants';
import type { SemesterRecord } from '../Semesters.types';

const DAY_IN_MILLISECONDS = 24 * 60 * 60 * 1000;

/** Lê a data de calendário serializada pelo Laravel ("Y-m-d" ou ISO) sem conversão de fuso. */
function calendarTime(value: string | null): number | null {
    const match = value?.match(/^(\d{4})-(\d{2})-(\d{2})/);

    return match ? Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])) : null;
}

function durationLabel(start: string | null, end: string | null): string {
    const startTime = calendarTime(start);
    const endTime = calendarTime(end);

    if (startTime === null || endTime === null) {
        return '---';
    }

    return `${Math.round((endTime - startTime) / DAY_IN_MILLISECONDS)} dias letivos aproximados`;
}

function semesterDate(value: string | null): string {
    return value ? dateLabel(value) : 'Não definida';
}

/** Identificação do período e duração de um semestre. */
export default function SemesterDetails({
    semester,
}: {
    semester: SemesterRecord;
}): React.JSX.Element {
    return (
        <CardBox>
            <FormSection
                id="semester-show-identification"
                title="Identificação"
                variant="inline"
                iconClass="fa fa-calendar"
                tourTarget={SEMESTER_TOUR_TARGETS.details}
            >
                <DetailGrid>
                    <DetailField label="Rótulo / Identificador">
                        {semesterLabel(semester)}
                    </DetailField>
                    <DetailField label="Ano Letivo">{semester.year}</DetailField>
                    <DetailField label="Etapa (Termo)">{semester.term}º Semestre</DetailField>
                    <DetailField label="Vigência Atual">
                        <TableLabel tone={semester.is_current ? 'success' : 'inverse'}>
                            {semester.is_current
                                ? 'Semestre ativo no sistema'
                                : 'Período encerrado / histórico'}
                        </TableLabel>
                    </DetailField>
                    <DetailField label="Data de Início">
                        {semesterDate(semester.start_date)}
                    </DetailField>
                    <DetailField label="Data de Término">
                        {semesterDate(semester.end_date)}
                    </DetailField>
                    <DetailField label="Duração Total">
                        {durationLabel(semester.start_date, semester.end_date)}
                    </DetailField>
                </DetailGrid>
            </FormSection>
        </CardBox>
    );
}

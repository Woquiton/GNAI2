import FormSection from '@/components/Forms/FormSection/FormSection';
import RecordTabs from '@/components/Navigation/RecordTabs/RecordTabs';
import CardBox from '@/components/UI/CardBox/CardBox';
import DetailField from '@/components/UI/DetailField/DetailField';
import RecordSummary from '@/components/UI/RecordSummary/RecordSummary';
import TableLabel from '@/components/UI/TableLabel/TableLabel';
import { NOT_INFORMED, peiRecordVersionLabel } from '../Peis.constants';
import type { PeiShowProps } from '../Peis.types';
import { createPeiRecordTabs, PEI_DEFAULT_TAB } from './peiRecordTabs';
import PeiStatusLabel from './PeiStatusLabel';
import { PEI_TOUR_TARGETS } from '../peiTours';

const DEFAULT_PHOTO = '/images/default-user.jpg';

/** Prontuário do PEI: identificação compacta do aluno e abas verticais com cada seção. */
export default function PeiDetails(props: PeiShowProps): React.JSX.Element {
    const { pei, student, activeTab } = props;
    const tabs = createPeiRecordTabs(props);
    const initialTab = tabs.some((tab) => tab.id === activeTab) ? activeTab : PEI_DEFAULT_TAB;

    return (
        <>
            <CardBox>
                <FormSection
                    id="pei-identification"
                    tourTarget={PEI_TOUR_TARGETS.identification}
                    title="Identificação do PEI"
                    iconClass="fa fa-id-card-o"
                    variant="inline"
                >
                    <RecordSummary
                        photo={{
                            src: student.photo_url || DEFAULT_PHOTO,
                            alt: `Foto de ${student.name}`,
                        }}
                        name={student.name}
                    >
                        <DetailField label="Matrícula">
                            {student.registration || NOT_INFORMED}
                        </DetailField>
                        <DetailField label="Situação do aluno">
                            <TableLabel tone={student.status_color ?? 'inverse'}>
                                {student.status_label || NOT_INFORMED}
                            </TableLabel>
                        </DetailField>
                        <DetailField label="Versão">
                            <strong>{peiRecordVersionLabel(pei)}</strong>
                        </DetailField>
                        <DetailField label="Status do PEI">
                            <PeiStatusLabel pei={pei} />
                        </DetailField>
                    </RecordSummary>
                </FormSection>
            </CardBox>
            <RecordTabs
                items={tabs}
                initialActiveId={initialTab}
                tourTarget={PEI_TOUR_TARGETS.recordTabs}
            />
        </>
    );
}

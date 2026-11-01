import FormSection from '@/components/Forms/FormSection/FormSection';
import CardBox from '@/components/UI/CardBox/CardBox';
import type { LoanRecord } from '../Loans.types';
import LoanDetails from './LoanDetails';

/** Card da visualização do empréstimo, com a seção de identificação. */
export default function LoanDetailsCard({
    loan,
    links,
}: {
    loan: LoanRecord;
    links?: { item: boolean; student: boolean };
}): React.JSX.Element {
    return (
        <CardBox>
            <FormSection
                id="loan-identification-details"
                title="Identificação"
                variant="inline"
                iconClass="fa fa-exchange"
            >
                <LoanDetails loan={loan} links={links} />
            </FormSection>
        </CardBox>
    );
}

import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';
import PersonForm from '@/components/People/Form/PersonForm';
import type { PersonFormProps } from '@/components/People/People.types';
import { personBreadcrumb } from '@/components/People/People.routes';
import { personFormTour } from '@/components/People/personTours';

export default function PeopleEditPage(props: PersonFormProps): React.JSX.Element {
    return (
        <BusinessPage
            title="Editar Pessoa"
            subtitle="Mantenha os dados pessoais e os papéis da pessoa em um único cadastro."
            breadcrumbItems={personBreadcrumb('Editar Pessoa')}
            tour={personFormTour}
        >
            <PersonForm key={props.person?.id ?? 'new'} {...props} />
        </BusinessPage>
    );
}

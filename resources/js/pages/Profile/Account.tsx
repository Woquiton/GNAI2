import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';
import AccountProfileForm from '@/components/Profile/Form/AccountProfileForm';
import { profileBreadcrumb } from '@/components/Profile/Profile.routes';
import { profileAccountTour } from '@/components/Profile/profileTours';
import type { ProfileAccountProps } from '@/components/Profile/Profile.types';

export default function ProfileAccountPage(props: ProfileAccountProps): React.JSX.Element {
    return (
        <BusinessPage
            title="Meu Perfil"
            subtitle="Gerencie sua foto, seus dados de acesso e a segurança da conta."
            breadcrumbItems={profileBreadcrumb()}
            tour={profileAccountTour}
        >
            <AccountProfileForm key={props.account.id} {...props} />
        </BusinessPage>
    );
}

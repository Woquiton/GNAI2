import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';
import ProfileForm from '@/components/Profile/Form/ProfileForm';
import { profileBreadcrumb } from '@/components/Profile/Profile.routes';
import { profileEditTour } from '@/components/Profile/profileTours';
import type { ProfileEditProps } from '@/components/Profile/Profile.types';

export default function ProfileEditPage(props: ProfileEditProps): React.JSX.Element {
    return (
        <BusinessPage
            title="Meu Perfil"
            subtitle="Gerencie suas informações pessoais e segurança da conta."
            breadcrumbItems={profileBreadcrumb()}
            tour={profileEditTour}
        >
            <ProfileForm key={props.person.id} {...props} />
        </BusinessPage>
    );
}

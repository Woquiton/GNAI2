import PersonPhotoUpload from '@/components/Forms/PersonPhotoUpload/PersonPhotoUpload';
import type { PersonPhotoUploadProps } from '@/components/Forms/PersonPhotoUpload/PersonPhotoUpload.types';
import Badge from '@/components/UI/Badge/Badge';
import { PROFILE_TOUR_TARGETS } from '../profileTours';
import '@styles/components/Profile/Profile.css';

type PhotoControl = Omit<PersonPhotoUploadProps, 'id' | 'name' | 'label' | 'current'>;

interface ProfileIdentityProps {
    id: string;
    /** URL da foto salva; ausente quando a pessoa ainda não tem foto. */
    currentPhoto?: string;
    photo: PhotoControl;
    name: string;
    position: string;
    bond: string;
}

/** Coluna de identificação do perfil: foto, nome, cargo e vínculo. */
export default function ProfileIdentity({
    id,
    currentPhoto,
    photo,
    name,
    position,
    bond,
}: ProfileIdentityProps): React.JSX.Element {
    return (
        <div className="profileForm__identity" data-tour={PROFILE_TOUR_TARGETS.identity}>
            <PersonPhotoUpload
                {...photo}
                id={id}
                name="photo"
                label="Alterar Foto"
                current={currentPhoto}
            />
            <p className="profileForm__name">{name}</p>
            <Badge variant="purple" className="profileForm__position">
                {position}
            </Badge>
            <dl className="profileForm__bond">
                <dt>Vínculo</dt>
                <dd>{bond}</dd>
            </dl>
        </div>
    );
}

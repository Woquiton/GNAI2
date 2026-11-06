import { profileUrls } from '../Profile.routes';
import type { ProfileEditProps } from '../Profile.types';
import { useProfileSubmission } from './useProfileSubmission';

export interface ProfileFormData {
    name: string;
    document: string;
    birth_date: string;
    gender: string;
    phone: string;
    email: string;
    registration: string;
    address: string;
    photo: File | null;
    remove_photo: boolean;
    password: string;
    password_confirmation: string;
}

/** Perfil de quem tem vínculo com a equipe (profissional ou professor). */
export function useProfileForm({ person, professional, teacher }: ProfileEditProps) {
    return useProfileSubmission<ProfileFormData>({
        url: profileUrls.update,
        initialData: {
            name: person.name ?? '',
            document: person.document ?? '',
            birth_date: person.birth_date?.slice(0, 10) ?? '',
            gender: person.gender ?? '',
            phone: person.phone ?? '',
            email: person.email ?? '',
            registration: professional?.registration ?? teacher?.registration ?? '',
            address: person.address ?? '',
            photo: null,
            remove_photo: false,
            password: '',
            password_confirmation: '',
        },
        clearedOnSuccess: {
            photo: null,
            remove_photo: false,
            password: '',
            password_confirmation: '',
        },
    });
}

export type ProfileFormState = ReturnType<typeof useProfileForm>;

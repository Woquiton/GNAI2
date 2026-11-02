import { profileUrls } from '../Profile.routes';
import type { AccountProfile } from '../Profile.types';
import { useProfileSubmission } from './useProfileSubmission';

export interface AccountProfileFormData {
    name: string;
    email: string;
    photo: File | null;
    remove_photo: boolean;
    current_password: string;
    password: string;
    password_confirmation: string;
}

/** Perfil das contas sem vínculo com a equipe (ex.: administrador superior). */
export function useAccountProfileForm(account: AccountProfile) {
    return useProfileSubmission<AccountProfileFormData>({
        url: profileUrls.updateAccount,
        initialData: {
            name: account.name ?? '',
            email: account.email ?? '',
            photo: null,
            remove_photo: false,
            current_password: '',
            password: '',
            password_confirmation: '',
        },
        clearedOnSuccess: {
            photo: null,
            remove_photo: false,
            current_password: '',
            password: '',
            password_confirmation: '',
        },
    });
}

export type AccountProfileFormState = ReturnType<typeof useAccountProfileForm>;

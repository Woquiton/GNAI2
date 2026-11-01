import type { PersonPhotoType } from '@/components/Forms/PersonPhotoUpload/PersonPhotoUpload.types';
import type { GuardianFilters } from './Guardians.types';

export const emptyGuardianFilters: GuardianFilters = {
    name: '',
    email: '',
    relationship: '',
};

/** Formatos de foto aceitos pelo cadastro de responsáveis (`CreateGuardianData`). */
export const guardianPhotoTypes: readonly PersonPhotoType[] = [
    'image/jpeg',
    'image/png',
    'image/webp',
];

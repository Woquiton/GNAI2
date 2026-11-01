import type { SpeakerRow } from './PublicationForm.types';

export function newSpeakerRow(values: Partial<Omit<SpeakerRow, 'key'>> = {}): SpeakerRow {
    return {
        key: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        id: '',
        name: '',
        guest: false,
        participation: '',
        ...values,
    };
}

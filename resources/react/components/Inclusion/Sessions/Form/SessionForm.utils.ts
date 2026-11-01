import { optionsFromRecord } from '@/components/Forms/FormFields/fieldOptions';
import type { FieldOption } from '@/components/Forms/FormFields/FormFields';

import type { SessionOptionMap, SessionPersonOption } from '../Sessions.types';

export function personName(item?: SessionPersonOption | null): string {
    return item?.person?.name ?? 'Sem Nome';
}

export function personOptions(people: readonly SessionPersonOption[]): FieldOption[] {
    return people.map((person) => ({ value: String(person.id), label: personName(person) }));
}

/**
 * Mesma regra do legado: início pela manhã termina até 12:00; início à tarde
 * termina a partir de 14:00. O fim sempre é posterior ao início.
 */
export function endTimeOptions(endTimes: SessionOptionMap, startTime: string): FieldOption[] {
    const options = optionsFromRecord(endTimes);

    if (!startTime) return options;

    const isMorning = Number(startTime.split(':')[0]) < 12;

    return options.filter(({ value }) => {
        const [hour, minutes] = value.split(':').map(Number);

        if (value <= startTime) return false;

        return isMorning ? hour < 12 || (hour === 12 && minutes === 0) : hour >= 14;
    });
}

export function adjustEndTime(
    endTimes: SessionOptionMap,
    startTime: string,
    endTime: string,
): string {
    if (!startTime || !endTime) return endTime;

    const visible = endTimeOptions(endTimes, startTime);

    if (visible.some((option) => option.value === endTime)) return endTime;

    return visible[0]?.value ?? endTime;
}

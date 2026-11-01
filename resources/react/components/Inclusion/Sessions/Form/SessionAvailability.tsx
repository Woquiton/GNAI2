import { useEffect, useState } from 'react';
import { joinClassNames } from '@/utils/joinClassNames';
import { sessionUrls } from '../Sessions.routes';
import type { SessionAvailabilitySlot } from '../Sessions.types';
import './SessionAvailability.css';

type AvailabilityState =
    | { status: 'idle' }
    | { status: 'loading' }
    | { status: 'error' }
    | { status: 'ready'; slots: SessionAvailabilitySlot[] };

function busyTone(slot: SessionAvailabilitySlot): 'students' | 'professional' | 'other' {
    const occupants = slot.busy_type
        .split(',')
        .map((name) => name.trim())
        .filter(Boolean);

    if (occupants.some((name) => !name.includes('Profissional'))) return 'students';
    if (slot.busy_type.includes('Profissional')) return 'professional';

    return 'other';
}

interface SessionAvailabilityProps {
    date: string;
    professionalId: string;
    studentIds: string[];
    selectedTime: string;
    disabled?: boolean;
    onSelect: (time: string) => void;
}

interface SessionAvailabilitySlotsProps {
    slots: SessionAvailabilitySlot[];
    selectedTime: string;
    disabled: boolean;
    onSelect: (time: string) => void;
}

/** Grade de horários do dia: ocupados (com o motivo) e livres, selecionáveis como início. */
function SessionAvailabilitySlots({
    slots,
    selectedTime,
    disabled,
    onSelect,
}: SessionAvailabilitySlotsProps): React.JSX.Element {
    return (
        <ul className="sessionAvailability__grid" aria-label="Horários do dia">
            {slots.map((slot) => {
                if (slot.busy) {
                    return (
                        <li key={slot.time}>
                            <div
                                className={joinClassNames(
                                    'sessionAvailability__slot',
                                    `sessionAvailability__slot--${busyTone(slot)}`,
                                )}
                                title={slot.busy_type}
                            >
                                <span className="sessionAvailability__time">{slot.time}</span>
                                <small className="sessionAvailability__detail">
                                    <span className="sessionAvailability__srOnly">Ocupado: </span>
                                    {slot.busy_type}
                                </small>
                            </div>
                        </li>
                    );
                }

                const selected = slot.time === selectedTime;

                return (
                    <li key={slot.time}>
                        <button
                            type="button"
                            className={joinClassNames(
                                'sessionAvailability__slot',
                                'sessionAvailability__slot--free',
                                selected && 'sessionAvailability__slot--selected',
                            )}
                            aria-pressed={selected}
                            title={`Selecionar início às ${slot.time}`}
                            disabled={disabled}
                            onClick={() => onSelect(slot.time)}
                        >
                            <span className="sessionAvailability__time">{slot.time}</span>
                            <small className="sessionAvailability__detail">Livre</small>
                        </button>
                    </li>
                );
            })}
        </ul>
    );
}

function availabilityContent(
    state: AvailabilityState,
    slotsProps: Omit<SessionAvailabilitySlotsProps, 'slots'>,
): React.JSX.Element {
    if (state.status === 'loading') {
        return (
            <p className="sessionAvailability__message" role="status">
                <i className="fa fa-spinner fa-spin" aria-hidden="true" /> Verificando
                disponibilidade...
            </p>
        );
    }

    if (state.status === 'error') {
        return (
            <p
                className="sessionAvailability__message sessionAvailability__message--error"
                role="alert"
            >
                Erro ao carregar horários.
            </p>
        );
    }

    if (state.status === 'idle' || state.slots.length === 0) {
        return (
            <p className="sessionAvailability__message">
                Selecione aluno(s), profissional e data para ver a disponibilidade.
            </p>
        );
    }

    return <SessionAvailabilitySlots slots={state.slots} {...slotsProps} />;
}

/** Disponibilidade do profissional e dos alunos na data escolhida (`GET disponibilidade`). */
export default function SessionAvailability({
    date,
    professionalId,
    studentIds,
    selectedTime,
    disabled = false,
    onSelect,
}: SessionAvailabilityProps): React.JSX.Element {
    const [state, setState] = useState<AvailabilityState>({ status: 'idle' });
    const ids = studentIds.filter(Boolean);
    const idsKey = ids.join(',');

    useEffect(() => {
        if (!date || !professionalId || ids.length === 0) {
            setState({ status: 'idle' });
            return undefined;
        }

        const controller = new AbortController();
        const params = new URLSearchParams();
        params.append('date', date);
        params.append('professional', professionalId);
        ids.forEach((id) => params.append('student_ids[]', id));
        setState({ status: 'loading' });

        fetch(`${sessionUrls.availability}?${params.toString()}`, {
            credentials: 'same-origin',
            headers: {
                Accept: 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
            },
            signal: controller.signal,
        })
            .then((response) => {
                if (!response.ok) throw new Error(String(response.status));

                return response.json() as Promise<{ slots?: SessionAvailabilitySlot[] }>;
            })
            .then((data) => setState({ status: 'ready', slots: data.slots ?? [] }))
            .catch(() => {
                if (!controller.signal.aborted) setState({ status: 'error' });
            });

        return () => controller.abort();
        // idsKey representa a lista de alunos selecionados.
    }, [date, professionalId, idsKey]);

    return (
        <div className="sessionAvailability">
            {availabilityContent(state, { selectedTime, disabled, onSelect })}
        </div>
    );
}

import type { BarrierRecord } from '../Barriers.types';

/** Estudante e profissional vinculados, separados por ponto e vírgula. */
function registeredPeople(barrier: BarrierRecord): string {
    const people = [
        barrier.affected_student?.person?.name
            ? `${barrier.affected_student.person.name} (Estudante)`
            : null,
        barrier.affected_professional?.person?.name
            ? `${barrier.affected_professional.person.name} (Profissional)`
            : null,
    ].filter(Boolean);

    return people.length ? people.join('; ') : 'Não informado';
}

/** Pessoas impactadas conforme o modo do relato: anônimo, geral (manual) ou cadastrado. */
export default function BarrierAffectedPeople({
    barrier,
}: {
    barrier: BarrierRecord;
}): React.JSX.Element {
    if (barrier.is_anonymous) {
        return <strong>Relato Anônimo</strong>;
    }

    if (!barrier.not_applicable) {
        return <>{registeredPeople(barrier)}</>;
    }

    const manual = barrier.affected_person_name || barrier.affected_person_role;
    const role = barrier.affected_person_role ? `(${barrier.affected_person_role})` : '';

    return (
        <span>
            Relato Geral
            {manual ? (
                <>
                    <br />
                    <small>Identificação Manual</small>
                    <br />
                    {barrier.affected_person_name} {role}
                </>
            ) : null}
        </span>
    );
}

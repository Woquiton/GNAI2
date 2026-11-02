import './SessionStudentNames.css';

interface SessionStudentNamesProps {
    names: readonly string[];
}

/** Alunos participantes em lista vertical (visualização e edição do agendamento). */
export default function SessionStudentNames({
    names,
}: SessionStudentNamesProps): React.JSX.Element {
    return (
        <ul className="sessionStudentNames">
            {names.map((name, index) => (
                // A lista não é editável; nomes iguais são diferenciados pela posição.
                <li key={`${name}-${index}`}>{name}</li>
            ))}
        </ul>
    );
}

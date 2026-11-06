import '@styles/components/People/PersonIdentity.css';

interface PersonIdentityProps {
    name: string;
    /** Foto da pessoa; sem foto, mostra apenas o nome. */
    photoUrl?: string | null;
}

/** Avatar circular e nome de uma pessoa nas células das listagens (alunos, responsáveis). */
export default function PersonIdentity({ name, photoUrl }: PersonIdentityProps): React.JSX.Element {
    return (
        <div className="personIdentity">
            {photoUrl ? (
                <img src={photoUrl} alt={`Foto de ${name}`} className="personIdentity__avatar" />
            ) : null}
            <strong>{name}</strong>
        </div>
    );
}

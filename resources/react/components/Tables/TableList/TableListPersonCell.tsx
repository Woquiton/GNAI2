/** Foto e nome na primeira coluna das listagens de pessoas; o nome encolhe com reticências. */
export default function TableListPersonCell({
    name,
    photoUrl,
}: {
    name: string;
    photoUrl?: string | null;
}): React.JSX.Element {
    return (
        <span className="tableListPersonCell">
            {photoUrl ? (
                <img
                    src={photoUrl}
                    alt={`Foto de ${name}`}
                    className="tableListPersonCell__photo"
                />
            ) : null}
            <span className="tableListPersonCell__name">{name}</span>
        </span>
    );
}

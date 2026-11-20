import TagName from './TagName';
import '@styles/components/Tags/TagBadgeList.css';

export default function TagBadgeList({
    tags,
    emptyMessage,
}: {
    tags: { id: number; name: string; color: string }[];
    emptyMessage: string;
}): React.JSX.Element {
    if (!tags.length) return <>{emptyMessage}</>;

    return (
        <span className="tagBadgeList">
            {tags.map((tag) => (
                <TagName key={tag.id} name={tag.name} color={tag.color} />
            ))}
        </span>
    );
}

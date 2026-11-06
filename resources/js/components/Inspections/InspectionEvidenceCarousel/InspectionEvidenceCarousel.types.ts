export type InspectionEvidence = {
    id: number;
    name: string;
    url: string;
    isImage: boolean;
    iconClass: string;
};

export interface InspectionFavoriteOptions {
    selectedId: number | null;
    disabled?: boolean;
    onSelect?: (evidence: InspectionEvidence) => void;
}

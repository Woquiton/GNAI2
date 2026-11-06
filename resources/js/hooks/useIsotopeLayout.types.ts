export interface GalleryLayoutItem {
    element: HTMLElement;
    sortData: Record<string, unknown>;
    isHidden?: boolean;
    isLayoutInstant?: boolean;
    destroy: () => void;
}

export interface GalleryLayout {
    items: GalleryLayoutItem[];
    filteredItems: GalleryLayoutItem[];
    addItems: (elements: HTMLElement[]) => GalleryLayoutItem[];
    layout: () => void;
    arrange: (options: { filter: string; transitionDuration?: string }) => void;
    destroy: () => void;
}
export interface GalleryLayoutConstructor {
    new (element: HTMLElement, options: Record<string, unknown>): GalleryLayout;
}

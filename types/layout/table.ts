export interface filterItemOptionObject {
    value: string;
    text: string;
}

export interface filterItem {
    title: string;  // display title the filter item
    key: string; // column being filtered
    items: filterItemOptionObject[] | string[];
    width?: string; //e.g. '150px'
}
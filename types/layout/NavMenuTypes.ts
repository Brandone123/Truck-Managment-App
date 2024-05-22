export type navMenu = {
    header?: string;
    title?: string;
    icon?: any;
    to?: string;
    chip?: string;
    chipColor?: string;
    chipVariant?: string;
    chipIcon?: string;
    children?: navMenu[];
    disabled?: boolean;
    type?: string;
    subCaption?: string;
    show?: boolean;
}
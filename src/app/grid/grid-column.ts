export interface GridColumn {
    name: string;
    title: string;
    type: string;
    options: string[];
    sort: string;
    filter?: boolean;
}

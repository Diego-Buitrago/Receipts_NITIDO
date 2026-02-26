import { SortOrder } from "primereact/datatable";

export interface Pagination {
    limit: number;
    offset: number;
    sortField: string;
    sortOrder: SortOrder;
}

export type TableCenter = 'left' | 'right' | 'center' | undefined | null;
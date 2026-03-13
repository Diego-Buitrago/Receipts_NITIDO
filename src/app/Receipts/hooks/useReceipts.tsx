import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
// UTILS
import { DataTableStateEvent } from "primereact/datatable";
// SERVICES
import { countReceiptsByStatus, getReceiptDetails, getReceiptStates, getTypePayments, listReceipts } from "../services";
// INTERFACES
import { Pagination } from "../../../interfaces/ui"
import { BasicList } from "../../../interfaces/general";
import { CountReceiptsByStatus, DataReceipt, ReceiptDetail, ReceiptFilters } from "../Interfaces/receipt";

export interface ResultsList {
    results: DataReceipt[];
    total: number;
}

export const useListReceipts = (filters: ReceiptFilters) => {

    const [pagination, setPagination] = useState<Pagination>({
        limit: 20,
        offset: 0,
        sortField: "date",
        sortOrder: -1,
    });

    const onCustomPage = (e: DataTableStateEvent) => setPagination(prev => ({ ...prev, limit: e.rows, offset: e.first }));
    const onSort = (e: DataTableStateEvent) => setPagination((prev) => ({ ...prev, sortField: e.sortField, sortOrder: e.sortOrder }));

    const listReceiptsQuery = useQuery<ResultsList>({
        queryKey: ['listReceipts', pagination, filters],
        queryFn: () => listReceipts(pagination, filters),
        staleTime: 1000 * 60 * 1, // 1 minuto
    })

    return {
        listReceiptsQuery,
        pagination,
        onCustomPage,
        onSort
    }
}

export const useGetTypePayments = () => {

    const getTypePaymentsQuery = useQuery<BasicList[]>({
        queryKey: ['typePayments'],
        queryFn: () => getTypePayments(),
        staleTime: 1000 * 60 * 5, // 5 minutos
    })

    return {
        getTypePaymentsQuery,
    }
}

export const useGetReceiptStates = () => {

    const getReceiptStatesQuery = useQuery<BasicList[]>({
        queryKey: ['receiptStates'],
        queryFn: () => getReceiptStates(),
        staleTime: 1000 * 60 * 5, // 5 minutos
    })

    return {
        getReceiptStatesQuery,
    }
}

export const useCountReceiptsByStatus = () => {

    const countReceiptsByStatusQuery = useQuery<CountReceiptsByStatus[]>({
        queryKey: ['countReceiptsByStatus'],
        queryFn: () => countReceiptsByStatus(),
        staleTime: 1000 * 60 * 1, // 1 minuto
    })

    return {
        countReceiptsByStatusQuery,
    }
}

export const useGetReceiptDetails = (receiptId: number | null) => {

    const getReceiptDetailsQuery = useQuery<ReceiptDetail[]>({
        queryKey: ['receiptDetails', receiptId],
        queryFn: () => getReceiptDetails(receiptId as number),
        enabled: !!receiptId,
        staleTime: 1000 * 60 * 1, // 1 minuto
    })

    return {
        getReceiptDetailsQuery,
    }
}

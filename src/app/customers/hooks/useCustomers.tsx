
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
// UTILS
import { DataTableStateEvent } from "primereact/datatable";
// SERVICES
import { getCustomers, listCustomers } from "../services";
// INTERFACES
import { Pagination } from "../../../interfaces/ui"
import { BasicList } from "../../../interfaces/general";
import { CustomerFilters, DataCustomer } from "../interfaces/customers";

export interface ResultsList {
    results: DataCustomer[];
    total: number;
}

export const useListCustomers = (filters: CustomerFilters) => {

    const [pagination, setPagination] = useState<Pagination>({
        limit: 20,
        offset: 0,
        sortField: "name",
        sortOrder: 1,
    });

    const onCustomPage = (e: DataTableStateEvent) => setPagination(prev => ({ ...prev, limit: e.rows, offset: e.first }));
    const onSort = (e: DataTableStateEvent) => setPagination((prev) => ({ ...prev, sortField: e.sortField, sortOrder: e.sortOrder }));
 
    const listCustomersQuery = useQuery<ResultsList>({
        queryKey: ['listCustomers', pagination, filters], // Guardar en cache
        queryFn: () => listCustomers(pagination, filters),
        staleTime: 1000 * 60 * 0.5, // Data fresca por 30 segundos
    })
 
    return {
        // Properties
        listCustomersQuery,

        // Getter
        pagination,
        // Methods
        onCustomPage,
        onSort
    }
}

export const useGetCustomers = (customerId: number | null = null) => {
 
    const getCustomersQuery = useQuery<BasicList[]>({
        queryKey: ['customers', customerId], // Guardar en cache
        queryFn: () => getCustomers(customerId),
        staleTime: 1000 * 60 * 1, // Data fresca por 1 minuto
    })
 
    return {
        // Properties
        getCustomersQuery,
    }
}

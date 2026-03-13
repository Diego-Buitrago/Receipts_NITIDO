
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
// UTILS
import { DataTableStateEvent } from "primereact/datatable";
// SERVICES
import { getProducts, listProducts } from "../services";
// INTERFACES
import { Pagination } from "../../../interfaces/ui"
import { BasicList } from "../../../interfaces/general";
import { DataProduct, ProductFilters } from "../interfaces/products";

export interface ResultsList {
    results: DataProduct[];
    total: number;
}

export const useListProducts = (filters: ProductFilters) => {

    const [pagination, setPagination] = useState<Pagination>({
        limit: 20,
        offset: 0,
        sortField: "name",
        sortOrder: 1,
    });

    const onCustomPage = (e: DataTableStateEvent) => setPagination(prev => ({ ...prev, limit: e.rows, offset: e.first }));
    const onSort = (e: DataTableStateEvent) => setPagination((prev) => ({ ...prev, sortField: e.sortField, sortOrder: e.sortOrder }));
 
    const listProductsQuery = useQuery<ResultsList>({
        queryKey: ['listProducts', pagination, filters], // Guardar en cache
        queryFn: () => listProducts(pagination, filters),
        staleTime: 1000 * 60 * 0.5, // Data fresca por 30 segundos
    })
 
    return {
        // Properties
        listProductsQuery,

        // Getter
        pagination,
        // Methods
        onCustomPage,
        onSort
    }
}

export const useGetProducts = (productId: number | null = null) => {
 
    const getProductsQuery = useQuery<(BasicList & { price: number })[]>({
        queryKey: ['products', productId], // Guardar en cache
        queryFn: () => getProducts(productId),
        staleTime: 1000 * 60 * 1, // Data fresca por 1 minuto
    })
 
    return {
        // Properties
        getProductsQuery,
    }
}

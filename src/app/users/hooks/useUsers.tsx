
import { useQuery } from "@tanstack/react-query";
// UTILS
import { useState } from "react";
import { DataTableStateEvent } from "primereact/datatable";
// INTERFACES
import { Pagination } from "../../../interfaces/ui"
import { DataUser, UsersFilters } from "../interfaces/users";
import { BasicList } from "../../../interfaces/general";
// SERVICES
import { getProfiles, getUsers } from "../services/usersServices";

export interface ResultsList {
    results: DataUser[];
    total: number;
}

export const useListUsers = (filters: UsersFilters) => {

    const [pagination, setPagination] = useState<Pagination>({
        limit: 20,
        offset: 0,
        sortField: "name",
        sortOrder: 1,
    });

    const onCustomPage = (e: DataTableStateEvent) => setPagination(prev => ({ ...prev, limit: e.rows, offset: e.first }));
    const onSort = (e: DataTableStateEvent) => setPagination((prev) => ({ ...prev, sortField: e.sortField, sortOrder: e.sortOrder }));
 
    const listUsersQuery = useQuery<ResultsList>({
        queryKey: ['users', pagination, filters], // Guardar en cache
        queryFn: () => getUsers(pagination, filters),
        staleTime: 1000 * 60 * 0.5, // Data fresca por 30 segundos
    })
 
    return {
        // Properties
        listUsersQuery,

        // Getter
        pagination,
        // Methods
        onCustomPage,
        onSort
    }
}

export const useGetProfiles = () => {
 
    const getProfilesQuery = useQuery<BasicList[]>({
        queryKey: ['profiles'], // Guardar en cache
        queryFn: () => getProfiles(),
        staleTime: 1000 * 60 * 1, // Data fresca por 1 minuto
    })
 
    return {
        // Properties
        getProfilesQuery,
    }
}


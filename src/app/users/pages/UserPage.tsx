import { FC, lazy, Suspense, useCallback, useMemo, useRef, useState } from "react";
// UI
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
// COMPONENTS
import { HeaderTemplate, statusBodyTemplate, FiltersComponent, ActionTemplate } from "../../../components";
import { OverlayPanel } from "primereact/overlaypanel";
const DialogUser = lazy(() => import("../components/DialogUser"));
// HOOKS
import { useDeleteUser, useGetProfiles, useListUsers } from "../hooks";
// UTILS
import { propsDataTable } from "../../../utils/defaultProps";
import { optionStates } from "../../../utils/fixedLists";
// INTERFACES
import { DataUser, UsersFilters } from "../interfaces/users";
import { TableCenter } from "../../../interfaces/ui";
import { BasicList } from "../../../interfaces/general";

const columnsConfig =  [
    {
        field: "name",
        header: "Nombres",
        sortable: true,
        style: { flexGrow: 1, flexBasis: "13rem", minWidth: "13rem" },
    },
    {
        field: "lastName",
        header: "Apellidos",
        sortable: true,
        style: { flexGrow: 1, flexBasis: "13rem", minWidth: "13rem" },
    },
    {
        field: "email",
        header: "Correo",
        sortable: true,
        style: { flexGrow: 1, flexBasis: "10rem", minWidth: "10rem" },
    },
    {
        field: "profile",
        header: "Perfil",
        sortable: true,
        style: { flexGrow: 1, flexBasis: "7rem", minWidth: "7rem" },
    },   
    {
        field: "state",
        header: "Estado",
        sortable: true,
        style: { flexGrow: 1, flexBasis: "5rem", minWidth: "5rem" },
        align: "center" as TableCenter,
        body: statusBodyTemplate
    },   
];

const getFilterConfig = (filters: UsersFilters, profiles: BasicList[]) => [
    { key: "name", type: "input", label: "Nombre", props: { defaultValue: filters.name } },
    { key: "lastName", type: "input", label: "Apellido", props: { defaultValue: filters.lastName } },
    { key: "email", type: "input", label: "Correo", props: { defaultValue: filters.email } },
    {
        key: "profile",
        type: "dropdown",
        label: "Perfil",
        props: {
            options: profiles,
            value: filters.profile,
        },
    },
    {
        key: "state",
        type: "dropdown",
        label: "Estado",
        props: {
            options: optionStates,
            value: filters.state,
        },
    },
]

const initialFilters: UsersFilters = { name: '', lastName: '', email: '', profile: null, state: null };

const UserPage: FC = () => {
    const { mutate } = useDeleteUser();
    const { getProfilesQuery } = useGetProfiles();
    const [filters, setFilters] = useState<UsersFilters>(initialFilters);
    const [visible, setVisible] = useState<boolean>(false);
    const [currUser, setCurrUser] = useState<DataUser | null>(null);

    const refFilters = useRef<OverlayPanel | null>(null);

    const { listUsersQuery, pagination, onCustomPage, onSort } = useListUsers(filters);

    const onDeleteUser = useCallback((user: DataUser) => {
        mutate(user);
    }, [mutate]);

    const headerTemplate = useMemo(() => {

        return (
            <HeaderTemplate
                title="Usuarios" 
                onAdd={() => setVisible(true)}
                onFilters={(e) => refFilters.current?.toggle(e)}
            />
        )
    }, []);

    const renderActions = useCallback((user: DataUser) => {
        const { name } = user;
        return (
            <ActionTemplate
               onClick={() => {
                    setCurrUser(user);
                    setVisible(true);
                }}
                onConfirm={() => onDeleteUser(user)}
                titleEdit={`Editar usuario ${name}`}
                titleDelete={`Eliminar usuario ${name}`}
                titleConfirm={`Realmente desea eliminar el usuario ${name}`}
            />
        )        
    }, [ onDeleteUser ]);

    const filterConfig = useMemo(() => getFilterConfig(filters, getProfilesQuery.data || []), [filters, getProfilesQuery.data])

    return (
        <Suspense fallback={<div>Cargando módulo ...</div>}>
            <FiltersComponent refFilters={refFilters} filters={filterConfig} setFilters={setFilters} />
            <DataTable
                {...propsDataTable}
                dataKey="userId"                
                size="small"
                header={headerTemplate}
                value={listUsersQuery?.data?.results}
                loading={listUsersQuery.isFetching}
                scrollHeight={`${window.innerHeight - 0.90}`}
                totalRecords={listUsersQuery?.data?.total || 0}
                rows={pagination.limit}
                first={pagination.offset}
                sortOrder={pagination.sortOrder}
                sortField={pagination.sortField}
                onPage={onCustomPage}
                onSort={onSort}
            >
                {
                    columnsConfig.map(props => <Column key={props.field} {...props} />)
                }
                <Column frozen alignFrozen="right" style={{ flexGrow: 1, flexBasis: "6rem", width: "6rem",  maxWidth: "6rem", minWidth: "6rem" }}
                    body={renderActions}
                />
            </DataTable>
            {
                visible && (<DialogUser onClose={() => {setVisible(false); setCurrUser(null);}} currUser={currUser} />)
            }
        </Suspense>
    )
}

export default UserPage
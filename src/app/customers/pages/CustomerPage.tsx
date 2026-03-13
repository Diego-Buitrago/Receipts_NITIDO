import { FC, lazy, Suspense, useCallback, useMemo, useRef, useState } from "react";
// UI
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { OverlayPanel } from "primereact/overlaypanel";
// COMPONENTS
import { HeaderTemplate, statusBodyTemplate, FiltersComponent, ActionTemplate } from "../../../components";
import { TooltipLongText } from "../../../components";
const DialogCustomer = lazy(() => import("../components/DialogCustomer"));
// HOOKS
import { useListCustomers, useDeleteCustomer } from "../hooks/";
// UTILS
import { propsDataTable } from "../../../utils/defaultProps";
import { optionStates } from "../../../utils/fixedLists";
// INTERFACES
import { TableCenter } from "../../../interfaces/ui";
import { CustomerFilters, DataCustomer } from "../interfaces/customers";

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
        field: "documentNumber",
        header: "Documento",
        sortable: true,
        style: { flexGrow: 1, flexBasis: "10rem", minWidth: "10rem" },
    },
    {
        field: "email",
        header: "Correo",
        sortable: true,
        style: { flexGrow: 1, flexBasis: "10rem", minWidth: "10rem" },
    },
    {
        field: "cellPhone",
        header: "Celular",
        sortable: true,
        style: { flexGrow: 1, flexBasis: "7rem", minWidth: "7rem" },
    },   
    {
        field: "phone",
        header: "Teléfono",
        sortable: true,
        style: { flexGrow: 1, flexBasis: "7rem", minWidth: "7rem" },
    },   
    {
        field: "address",
        header: "Dirección",
        sortable: true,
        style: { flexGrow: 1, flexBasis: "15rem", minWidth: "15rem" },
        body: ({ customerId, address }: DataCustomer) => (
            <TooltipLongText text={address || ""} classValue={`address-customer-${customerId}`} maxLength={25} />
        )
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

const getFilterConfig = (filters: CustomerFilters) => [
    { key: "name", type: "input", label: "Nombre", props: { defaultValue: filters.name } },
    { key: "lastName", type: "input", label: "Apellido", props: { defaultValue: filters.lastName } },
    { key: "documentNumber", type: "input", label: "Documento", props: { defaultValue: filters.documentNumber } },
    { key: "email", type: "input", label: "Correo", props: { defaultValue: filters.email } },
    { key: "cellPhone", type: "input", label: "Celular", props: { defaultValue: filters.cellPhone } },
    { key: "phone", type: "input", label: "Teléfono", props: { defaultValue: filters.phone } },
    { key: "address", type: "input", label: "Dirección", props: { defaultValue: filters.address } },
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

const initialFilters: CustomerFilters = { name: '', lastName: '', documentNumber: '', email: '', cellPhone: "", phone: "", address: "", state: null };

const CustomerPage: FC = () => {
    const { mutate } = useDeleteCustomer();
    const [filters, setFilters] = useState<CustomerFilters>(initialFilters);
    const [visible, setVisible] = useState<boolean>(false);
    const [currCustomer, setCurrCustomer] = useState<DataCustomer | null>(null);

    const refFilters = useRef<OverlayPanel | null>(null);

    const { listCustomersQuery, pagination, onCustomPage, onSort } = useListCustomers(filters);

    const onDeleteCustomer = useCallback((customer: DataCustomer) => {
        mutate(customer);
    }, [mutate]);

    const headerTemplate = useMemo(() => {
        return (
            <HeaderTemplate
                title="Clientes" 
                onAdd={() => setVisible(true)}
                onFilters={(e) => refFilters.current?.toggle(e)}
            />
        )
    }, []);

    const renderActions = useCallback((customer: DataCustomer) => {
        const { name } = customer;
        return (
            <ActionTemplate
            onClick={() => {
                    setCurrCustomer(customer);
                    setVisible(true);
                }}
                onConfirm={() => onDeleteCustomer(customer)}
                titleEdit={`Editar cliente ${name}`}
                titleDelete={`Eliminar cliente ${name}`}
                titleConfirm={`Realmente desea eliminar el cliente ${name}`}
            />
        )        
    }, [onDeleteCustomer]);

    const filterConfig = useMemo(() => getFilterConfig(filters), [filters])

    return (
        <Suspense fallback={<div>Cargando módulo ...</div>}>
            <FiltersComponent refFilters={refFilters} filters={filterConfig} setFilters={setFilters} />
            <DataTable
                {...propsDataTable}
                dataKey="customerId"                
                size="small"
                header={headerTemplate}
                value={listCustomersQuery?.data?.results}
                loading={listCustomersQuery.isFetching}
                scrollHeight={`${window.innerHeight - 0.90}`}
                totalRecords={listCustomersQuery?.data?.total || 0}
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
                <Column frozen alignFrozen="right" style={{ flexGrow: 1, flexBasis: "5.5rem", width: "6rem",  maxWidth: "6rem", minWidth: "6rem" }}
                    body={renderActions}
                />
            </DataTable>
            {
                visible && (<DialogCustomer onClose={() => {setVisible(false); setCurrCustomer(null);}} currCustomer={currCustomer} />)
            }
        </Suspense>
    )
}

export default CustomerPage
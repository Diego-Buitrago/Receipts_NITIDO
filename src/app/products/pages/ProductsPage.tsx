import { FC, lazy, Suspense, useCallback, useMemo, useRef, useState } from "react";
// UI
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
// COMPONENTS
import { HeaderTemplate, statusBodyTemplate, FiltersComponent, ActionTemplate } from "../../../components";
import { OverlayPanel } from "primereact/overlaypanel";
const DialogProduct = lazy(() => import("../components/DialogProduct"));
// HOOKS
import { useDeleteProduct, useListProducts } from "../hooks";
// UTILS
import { propsDataTable } from "../../../utils/defaultProps";
import { optionStates } from "../../../utils/fixedLists";
import { fCurrency } from "../../../utils/formatNumber";
// INTERFACES
import { TableCenter } from "../../../interfaces/ui";
import { DataProduct, ProductFilters } from "../interfaces/products";

const columnsConfig =  [
    {
        field: "name",
        header: "Nombre",
        sortable: true,
        style: { flexGrow: 1, flexBasis: "15rem", minWidth: "15rem" },
    },
    {
        field: "description",
        header: "Descripción",
        sortable: true,
        style: { flexGrow: 1, flexBasis: "15rem", minWidth: "15rem" },
    },
    {
        field: "price",
        header: "Precio",
        sortable: true,
        style: { flexGrow: 1, flexBasis: "10rem", minWidth: "10rem" },
        body: ({ price }: DataProduct) => fCurrency(price),
    },  
    // {
    //     field: "stock",
    //     header: "Stock",
    //     sortable: true,
    //     style: { flexGrow: 1, flexBasis: "6rem", minWidth: "6rem" },
    // },  
    {
        field: "state",
        header: "Estado",
        sortable: true,
        style: { flexGrow: 1, flexBasis: "5rem", minWidth: "5rem" },
        align: "center" as TableCenter,
        body: statusBodyTemplate
    },   
];

const getFilterConfig = (filters: ProductFilters) => [
    { key: "name", type: "input", label: "Nombre", props: { defaultValue: filters.name } },
    { key: "description", type: "input", label: "Descripción", props: { defaultValue: filters.description } },
    { key: "price", type: "input", label: "Precio", props: { keyfilter: 'int', defaultValue: filters.price || '' } },
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

const initialFilters: ProductFilters = { name: '', description: '', price: null, state: null };

const ProductsPage: FC = () => {
    const { mutate } = useDeleteProduct();
   
    const [filters, setFilters] = useState<ProductFilters>(initialFilters);
    const [visible, setVisible] = useState<boolean>(false);
    const [currProduct, setCurrProduct] = useState<DataProduct | null>(null);

    const refFilters = useRef<OverlayPanel | null>(null);

    const { listProductsQuery, pagination, onCustomPage, onSort } = useListProducts(filters);

    const onDeleteProduct = useCallback((product: DataProduct) => {
        mutate(product);
    }, [mutate]);

    const headerTemplate = useMemo(() => {
        return (
            <HeaderTemplate
                title="Productos" 
                onAdd={() => setVisible(true)}
                onFilters={(e) => refFilters.current?.toggle(e)}
            />
        )
    }, []);

    const renderActions = useCallback((product: DataProduct) => {
        const { name } = product;
        return (
            <ActionTemplate
            onClick={() => {
                    setCurrProduct(product);
                    setVisible(true);
                }}
                onConfirm={() => onDeleteProduct(product)}
                titleEdit={`Editar producto ${name}`}
                titleDelete={`Eliminar producto ${name}`}
                titleConfirm={`Realmente desea eliminar el producto ${name}`}
            />
        )        
    }, []);

    const filterConfig = useMemo(() => getFilterConfig(filters), [filters]);

    return (
        <Suspense fallback={<div>Cargando módulo ...</div>}>
            <FiltersComponent refFilters={refFilters} filters={filterConfig} setFilters={setFilters} />
            <DataTable
                {...propsDataTable}
                dataKey="productId"                
                size="small"
                header={headerTemplate}
                value={listProductsQuery?.data?.results}
                loading={listProductsQuery.isFetching}
                scrollHeight={`${window.innerHeight - 0.90}`}
                totalRecords={listProductsQuery?.data?.total || 0}
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
                visible && (<DialogProduct onClose={() => {setVisible(false); setCurrProduct(null);}} currProduct={currProduct} />)
            }
        </Suspense>
    )
}

export default ProductsPage
import { FC, lazy, Suspense, useCallback, useMemo, useRef, useState } from "react";
// UI
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { OverlayPanel } from "primereact/overlaypanel";
import { Badge } from "primereact/badge";
import { MenuItem } from "primereact/menuitem";
import { Menubar } from "primereact/menubar";
import { Button } from "primereact/button";
// COMPONENTS
import { HeaderTemplate, FiltersComponent, DeletePopup, DataFile } from "../../../components";
const DialogReceipt = lazy(() => import("../components/DialogReceipt"))
const SeeFile = lazy(() => import("../../../components/SeeFile"));
// HOOKS
import { useCountReceiptsByStatus, useCancelReceipt, useGetTypePayments, useListReceipts, useGenerateReceiptPDF } from "../hooks";
import { useGetCustomers } from "../../customers/hooks";
// UTILS
import { propsDataTable } from "../../../utils/defaultProps";
import { fCurrency } from "../../../utils/formatNumber";
import { formatDate } from "../../../utils/formatTime";
// INTERFACES
import { DataReceipt, ReceiptFilters } from "../Interfaces/receipt";
import { BasicList } from "../../../interfaces/general";
// ICONS
import { GiCancel } from "react-icons/gi";
import { MdEdit } from "react-icons/md";
import { FaFilePdf } from "react-icons/fa";

const columnsConfig = [
    {
        field: "receiptNumber",
        header: "N. Recibo",
        sortable: true,
        style: { flexGrow: 1, flexBasis: "8rem", minWidth: "8rem" },
        body: ({ prefix, receiptNumber }: DataReceipt) => <div>{prefix}-{receiptNumber}</div>
    },
    {
        field: "date",
        header: "Fecha",
        sortable: true,
        style: { flexGrow: 1, flexBasis: "8rem", minWidth: "8rem" },
        body: ({ date }: DataReceipt) => formatDate(new Date(date)),
    },
    {
        field: "customer",
        header: "Cliente",
        sortable: true,
        style: { flexGrow: 1, flexBasis: "12rem", minWidth: "12rem" },
    },
    {
        field: "typePayment",
        header: "Tipo Pago",
        sortable: true,
        style: { flexGrow: 1, flexBasis: "8rem", minWidth: "8rem" },
    },
    {
        field: "subtotal",
        header: "Subtotal",
        sortable: true,
        style: { flexGrow: 1, flexBasis: "8rem", minWidth: "8rem" },
        body: ({ subtotal }: DataReceipt) => fCurrency(subtotal),
    },
    {
        field: "discount",
        header: "Descuento",
        sortable: true,
        style: { flexGrow: 1, flexBasis: "8rem", minWidth: "8rem" },
        body: ({ discount }: DataReceipt) => fCurrency(discount),
    },
    {
        field: "tax",
        header: "Iva 19%",
        sortable: true,
        style: { flexGrow: 1, flexBasis: "8rem", minWidth: "8rem" },
        body: ({ tax }: DataReceipt) => fCurrency(tax),
    },
    {
        field: "total",
        header: "Total",
        sortable: true,
        style: { flexGrow: 1, flexBasis: "8rem", minWidth: "8rem" },
        body: ({ total }: DataReceipt) => fCurrency(total),
    },
];

const getFilterConfig = (filters: ReceiptFilters, customers: BasicList[], typePayments: BasicList[]) => [
    { key: "receiptNumber", type: "input", label: "N. Recibo", props: { defaultValue: filters.receiptNumber } },
    {
        key: "customerId",
        type: "dropdown",
        label: "Cliente",
        props: {
            options: customers,
            value: filters.customerId,
        },
    },
    {
        key: "typePaymentId",
        type: "dropdown",
        label: "Tipo Pago",
        props: {
            options: typePayments,
            value: filters.typePaymentId,
        },
    },
    {
        key: "date",
        type: "calendar",
        label: "Rango Fecha",
        props: {
            value: filters.date,
            selectionMode: "range",
        },
    },
];

const initialFilters: ReceiptFilters = {
    receiptNumber: '',
    customerId: null,
    typePaymentId: null,
    stateId: 1,
    date: null
};

const itemRenderer = (item: MenuItem & { badge?: number, active?: boolean }) => (
    <a className="flex align-items-center p-menuitem-link menubar-active">
        <span className="mx-2" style={{ fontWeight: item.active ? 'bold' : 'normal', color: item.active ? 'black' : 'gray' }}>{item.label}</span>
        {item.badge && <Badge className="ml-auto" value={item.badge} />}
    </a>
);

const ReceiptPage: FC = () => {
    const { mutate } = useCancelReceipt();
    const generateReceiptPDFMutation = useGenerateReceiptPDF();
    const { getCustomersQuery } = useGetCustomers();
    const { getTypePaymentsQuery } = useGetTypePayments();
    const { countReceiptsByStatusQuery } = useCountReceiptsByStatus();

    const [filters, setFilters] = useState<ReceiptFilters>(initialFilters);
    const [visible, setVisible] = useState<boolean>(false);
    const [currReceipt, setCurrReceipt] = useState<DataReceipt | null>(null);
    const [fileData, setFileData] = useState<DataFile | null>(null);

    const refFilters = useRef<OverlayPanel | null>(null);

    const { listReceiptsQuery, pagination, onCustomPage, onSort } = useListReceipts(filters);

    const onCancelReceipt = useCallback((receipt: DataReceipt) => {
        mutate(receipt);
    }, [mutate]);

    const headerTemplate = useMemo(() => {
        return (
            <HeaderTemplate
                title="Recibos"
                onAdd={() => setVisible(true)}
                onFilters={(e) => refFilters.current?.toggle(e)}
            />
        )
    }, []);

      const menuItems: MenuItem[] = useMemo(() => {
        const counts = countReceiptsByStatusQuery.data || [];

        return counts.map((status) => ({
            label: status.name,
            className: filters.stateId === status.id ? 'menubar-active' : '',
            badge: status.quantity,
            active: filters.stateId === status.id,
            template: itemRenderer,
            command: () => {
                setFilters(prev => ({ ...prev, stateId: status.id }));
            },
        }));
    }, [countReceiptsByStatusQuery.data, filters.stateId]);

    const onDownloadPDF = async (receipt: DataReceipt) => {
        const url = await generateReceiptPDFMutation.mutateAsync(receipt.receiptId);
        setFileData({
            name: `${receipt.prefix}-${receipt.receiptNumber}`,
            url: url
        });
    };

    const renderActions = useCallback((receipt: DataReceipt) => {
        const { receiptId, receiptNumber } = receipt;
        const isDownloading = generateReceiptPDFMutation.isPending && generateReceiptPDFMutation.variables === receiptId;

        return (
            <div className="flex gap-1 justify-center">             
                <Button
                    rounded
                    severity="info"
                    onClick={() => onDownloadPDF(receipt)}
                    title={`Descargar PDF recibo ${receiptNumber}`}
                    icon={<FaFilePdf size={18} />}
                    loading={isDownloading}
                />
                {filters.stateId !== 3 && (
                    <>
                        <Button
                            rounded
                            severity="warning"
                            onClick={() => {
                                setCurrReceipt(receipt);
                                setVisible(true);
                            }}
                            title={`Editar recibo ${receiptNumber}`}
                            icon={<MdEdit size={24} />}
                        />
                        <DeletePopup
                            title={`Realmente desea cancelar el recibo ${receiptNumber}`}
                            onConfirm={() => onCancelReceipt(receipt)}
                        >
                            <Button
                                rounded 
                                severity="danger"
                                icon={<GiCancel size={24} />}
                                title={`Cancelar recibo ${receiptNumber}`}
                            />
                        </DeletePopup>
                    </>
                )}
            </div>
        )
    }, [onCancelReceipt, filters.stateId, generateReceiptPDFMutation.isPending, generateReceiptPDFMutation.variables]);

    const filterConfig = useMemo(() => getFilterConfig(
        filters,
        getCustomersQuery.data || [],
        getTypePaymentsQuery.data || []
    ), [filters, getCustomersQuery.data, getTypePaymentsQuery.data]);

    return (
        <Suspense fallback={<div>Cargando modulo ...</div>}>
            {fileData && <SeeFile onClose={() => setFileData(null)} fileData={fileData} />}
            <FiltersComponent refFilters={refFilters} filters={filterConfig} setFilters={setFilters} />
            <Menubar model={menuItems} className="mb-3" />
            <DataTable
                {...propsDataTable}
                dataKey="receiptId"
                size="small"
                header={headerTemplate}
                value={listReceiptsQuery?.data?.results}
                loading={listReceiptsQuery.isFetching}
                scrollHeight={`${window.innerHeight - 0.90}`}
                totalRecords={listReceiptsQuery?.data?.total || 0}
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
                
                <Column frozen alignFrozen="right" 
                    style={{ flexGrow: 1, flexBasis: "7.5rem", width: "7.5rem", maxWidth: "7.5rem", minWidth: "7.5rem" }}
                    body={renderActions}
                />
            </DataTable>
            {
                visible && (<DialogReceipt onClose={() => { setVisible(false); setCurrReceipt(null); }} currReceipt={currReceipt} />)
            }
        </Suspense>
    )
}

export default ReceiptPage;

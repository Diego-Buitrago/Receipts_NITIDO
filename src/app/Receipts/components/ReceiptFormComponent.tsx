import { FC } from "react";
// UI
import { FloatLabel } from "primereact/floatlabel";
import { classNames } from "primereact/utils";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { InputNumber } from "primereact/inputnumber";
import { InputTextarea } from "primereact/inputtextarea";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
// FORM
import { useFormContext, useFieldArray } from "react-hook-form";
// HOOKS
import { useGetTypePayments } from "../hooks";
import { useGetCustomers } from "../../customers/hooks";
import { useGetProducts } from "../../products/hooks";
// UTILS
import { propsCalendar, propsCurrency, propsSelect } from "../../../utils/defaultProps";
import { fCurrency } from "../../../utils/formatNumber";
// INTERFACES
import { ReceiptDetailForm, ReceiptForm } from "../Interfaces/receipt";
// ICONS
import { FaPlus, FaTrash } from "react-icons/fa";

interface Props {
    isEditing?: boolean;
    detailsLoading?: boolean;
}

export const ReceiptFormComponent: FC<Props> = ({ isEditing, detailsLoading }) => {
    const { register, watch, setValue, control, formState: { errors } } = useFormContext<ReceiptForm>();
    const { getTypePaymentsQuery } = useGetTypePayments();
    const { getCustomersQuery } = useGetCustomers();
    const { getProductsQuery } = useGetProducts(null);

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'details',
    });

    const watchedDetails = watch('details');

    const tableData = fields.map((field, index) => ({
        ...field,
        ...watchedDetails?.[index],
        index,
    }));

    const calculateTotals = () => {
        const details = watch('details') || [];
        const discount = watch('discount') || 0;
        const subtotal = details.reduce((acc, item) => acc + ((item.quantity || 0) * (item.price || 0)), 0);
        const tax = subtotal * 0.19;
        const total = subtotal + tax - discount;

        setValue('subtotal', subtotal);
        setValue('tax', tax);
        setValue('total', total);
    };

    const addDetail = () => {
        const newDetail: ReceiptDetailForm = {
            productId: 0,
            quantity: 1,
            price: 0,
        };
        append(newDetail);
    };

    const productTemplate = (rowData: ReceiptDetailForm & { index: number }) => {
        const fieldName = `details.${rowData.index}.productId` as const;
        return (
            <Dropdown
                {...propsSelect}
                value={rowData.productId}
                onChange={(e) => {
                    setValue(fieldName, e.value);
                    const selectedProduct = getProductsQuery.data?.find((p: any) => p.id === e.value);
                    setValue(`details.${rowData.index}.price`, selectedProduct?.price || 0);
                    setTimeout(calculateTotals, 0);
                }}
                options={getProductsQuery.data || []}
                placeholder="Seleccione producto"
                className={classNames('w-full', { 'p-invalid': errors.details?.[rowData.index]?.productId })}
            />
        );
    };

    const quantityTemplate = (rowData: ReceiptDetailForm & { index: number }) => {
        const fieldName = `details.${rowData.index}.quantity` as const;
        return (
            <InputNumber
                value={rowData.quantity}
                onValueChange={(e) => {
                    setValue(fieldName, e.value || 1);
                    setTimeout(calculateTotals, 0);
                }}
                min={1}
                showButtons
                className={classNames('w-full h-[46px] [&_.p-inputnumber-button]:h-[44.5px] [&_.p-inputnumber-button]:w-8 [&_.p-icon]:w-2.5 [&_.p-icon]:h-2.5', { 'p-invalid': errors.details?.[rowData.index]?.quantity })}
                inputClassName="p-inputtext-sm w-full h-full"
            />
        );
    };

    const priceTemplate = (rowData: ReceiptDetailForm & { index: number }) => {
        const fieldName = `details.${rowData.index}.price` as const;
        return (
            <InputNumber
                value={rowData.price}
                onValueChange={(e) => {
                    setValue(fieldName, e.value || 0);
                    setTimeout(calculateTotals, 0);
                }}
                {...propsCurrency}
                className={classNames('w-full', { 'p-invalid': errors.details?.[rowData.index]?.price })}
                inputClassName="p-inputtext-sm w-full"
            />
        );
    };

    const subtotalTemplate = (rowData: ReceiptDetailForm) => {
        const subtotal = (rowData.quantity || 0) * (rowData.price || 0);
        return <span className="font-semibold">{fCurrency(subtotal)}</span>;
    };

    const actionsTemplate = (rowData: ReceiptDetailForm & { index: number }) => {
        return (
            <Button
                type="button"
                icon={<FaTrash />}
                rounded
                severity="danger"
                size="small"
                onClick={() => {
                    remove(rowData.index);
                    setTimeout(calculateTotals, 0);
                }}
            />
        );
    };

    return (
        <form>
            <div className="grid grid-cols-2 gap-6 mt-6">
                <div className="col-span-2 md:col-span-1">
                    <FloatLabel>
                        <Calendar
                            {...register("date", { required: "El campo fecha es requerido" })}
                            {...propsCalendar}
                            value={watch("date")}
                            onChange={(e) => setValue("date", e.value as Date)}
                            invalid={!!errors.date}
                            disabled={isEditing}
                        />
                        <label htmlFor="date">Fecha</label>
                    </FloatLabel>
                    <div className={classNames({ "p-error": errors.date })}>{errors.date?.message}</div>
                </div>

                <div className="col-span-2 md:col-span-1">
                    <FloatLabel>
                        <Dropdown
                            {...register("customerId", { required: "El cliente es requerido" })}
                            {...propsSelect}
                            value={watch("customerId")}
                            className="p-inputtext-sm w-full"
                            options={getCustomersQuery.data || []}
                            invalid={!!errors.customerId}
                            showClear
                        />
                        <label htmlFor="customerId">Cliente</label>
                    </FloatLabel>
                    <div className={classNames({ "p-error": errors.customerId })}>{errors.customerId?.message}</div>
                </div>

                <div className="col-span-2 md:col-span-1">
                    <FloatLabel>
                        <Dropdown
                            {...register("typePaymentId", { required: "El tipo de pago es requerido" })}
                            {...propsSelect}
                            value={watch("typePaymentId")}
                            className="p-inputtext-sm w-full"
                            options={getTypePaymentsQuery.data || []}
                            invalid={!!errors.typePaymentId}
                            showClear
                        />
                        <label htmlFor="typePaymentId">Tipo de Pago</label>
                    </FloatLabel>
                    <div className={classNames({ "p-error": errors.typePaymentId })}>{errors.typePaymentId?.message}</div>
                </div>

                <div className="col-span-2 md:col-span-1">
                    <FloatLabel>
                        <InputNumber
                            className="p-inputtext-sm w-full"
                            inputClassName="p-inputtext-sm w-full"
                            {...propsCurrency}
                            value={watch("discount")}
                            onChange={({ value }) => {
                                setValue("discount", value || 0);
                                setTimeout(calculateTotals, 0);
                            }}
                        />
                        <label htmlFor="discount">Descuento</label>
                    </FloatLabel>
                </div>

                <div className="col-span-2">
                    <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold text-gray-600">Detalle de Productos</span>
                        <Button
                            type="button"
                            label="Agregar"
                            icon={<FaPlus className="mr-2" />}
                            onClick={addDetail}
                            size="small"
                        />
                    </div>
                    <DataTable
                        value={tableData}
                        emptyMessage="No hay productos agregados"
                        size="small"
                        stripedRows
                        showGridlines
                        loading={detailsLoading}
                    >
                        <Column header="Producto" body={productTemplate} style={{ flexGrow: 1, flexBasis: "15rem", width: "15rem", maxWidth: "15rem", minWidth: "15rem" }} />
                        <Column header="Cantidad" body={quantityTemplate} style={{ flexGrow: 1, flexBasis: "6rem", width: "6rem", maxWidth: "6rem", minWidth: "6rem" }} />
                        <Column header="Precio" body={priceTemplate} style={{ flexGrow: 1, flexBasis: "10rem", width: "10rem", maxWidth: "10rem", minWidth: "10rem" }} />
                        <Column header="Subtotal" body={subtotalTemplate} style={{ flexGrow: 1, flexBasis: "10rem", width: "10rem", maxWidth: "10rem", minWidth: "10rem" }} />
                        <Column frozen alignFrozen="right" align="center"
                            style={{ flexGrow: 1, flexBasis: "3rem", width: "3rem", maxWidth: "3rem", minWidth: "3rem" }}
                            body={actionsTemplate}
                        />
                    </DataTable>
                </div>

                <div className="col-span-2 md:col-span-1">
                    <FloatLabel>
                        <InputTextarea
                            rows={5}
                            autoResize
                            className="p-inputtext-sm w-full"
                            {...register("observation")}
                            value={watch("observation")}
                        />
                        <label htmlFor="observation">Observaciones</label>
                    </FloatLabel>
                </div>

                <div className="col-span-2 md:col-span-1">
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex justify-between mb-2">
                            <span>Subtotal:</span>
                            <span className="font-semibold">{fCurrency(watch('subtotal'))}</span>
                        </div>
                        <div className="flex justify-between mb-2">
                            <span>Descuento:</span>
                            <span className="font-semibold text-red-500">-{fCurrency(watch('discount'))}</span>
                        </div>
                        <div className="flex justify-between mb-2">
                            <span>IVA (19%):</span>
                            <span className="font-semibold">{fCurrency(watch('tax'))}</span>
                        </div>
                        <div className="flex justify-between text-lg border-t pt-2">
                            <span className="font-bold">TOTAL:</span>
                            <span className="font-bold text-green-600">{fCurrency(watch('total'))}</span>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
};

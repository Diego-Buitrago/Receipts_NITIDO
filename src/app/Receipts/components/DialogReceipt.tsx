import { FC, useEffect } from "react";
// UI
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { SelectButton } from "primereact/selectbutton";
// INTERFACES
import { DataReceipt, ReceiptForm } from "../Interfaces/receipt";
// HOOKS
import { useCreateReceipt, useGetReceiptStates, useUpdateReceipt, useGetReceiptDetails } from "../hooks";
// OTROS
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
// UTILS
import { propsDialog, propsSelectButton } from "../../../utils/defaultProps";
import ToastService from "../../../plugins/ToastService";
// COMPONENTS
import { ReceiptFormComponent } from "./ReceiptFormComponent";

interface Props {
    onClose: () => void;
    currReceipt?: DataReceipt | null,
}

const DialogReceipt: FC<Props> = ({ onClose, currReceipt }) => {
    const { mutate: createReceipt, isPending } = useCreateReceipt();
    const { mutate: updateReceipt, isPending: isPending2 } = useUpdateReceipt(currReceipt?.receiptId || 0);
    const { getReceiptStatesQuery } = useGetReceiptStates();
    const { getReceiptDetailsQuery } = useGetReceiptDetails(currReceipt?.receiptId || null);

    const methods = useForm<ReceiptForm>({ defaultValues: {
        date: currReceipt?.date ? new Date(currReceipt.date) : new Date(),
        customerId: currReceipt?.customerId || null,
        typePaymentId: currReceipt?.typePaymentId || null,
        subtotal: currReceipt?.subtotal || 0,
        discount: currReceipt?.discount || 0,
        tax: currReceipt?.tax || 19,
        total: currReceipt?.total || 0,
        observation: currReceipt?.observation || "",
        stateId: currReceipt?.stateId || 1,
        details: currReceipt?.details?.map(d => ({
            productId: d.productId,
            quantity: d.quantity,
            price: d.price,
        })) || []
    } });

    useEffect(() => {
        if (currReceipt && getReceiptDetailsQuery.data) {
            methods.setValue('details', getReceiptDetailsQuery.data.map((d: any) => ({
                productId: d.productId,
                quantity: d.quantity,
                price: d.price,
            })));
        }
    }, [currReceipt, getReceiptDetailsQuery.data, methods]);

    const onSubmit: SubmitHandler<ReceiptForm> = (values: ReceiptForm) => {
        if (values.details.length === 0) {
            return ToastService.error("Debe agregar al menos un producto");
        }

        if (!currReceipt) {
           createReceipt({...values});
        } else {
            updateReceipt({...values});
        }
        onClose();
    }

    return (
        <Dialog
            {...propsDialog}
            style={{ width: '60vw' }}
            header={currReceipt ? "Editar Recibo" : "Nuevo Recibo"}
            onHide={onClose}
            footer={
                <div className="flex justify-between">
                    <SelectButton
                        {...propsSelectButton}
                        value={methods.watch('stateId')}
                        options={getReceiptStatesQuery.data}
                    {...methods.register('stateId')}
                    />
                    <Button
                        rounded
                        onClick={methods.handleSubmit(onSubmit)}
                        label={currReceipt ? "Guardar Cambios" : "Guardar"}
                        loading={isPending || isPending2 || getReceiptDetailsQuery.isFetching}
                        size="small"
                    />
                </div>
            }
        >
            <FormProvider {...methods}>
                <ReceiptFormComponent isEditing={!!currReceipt} detailsLoading={getReceiptDetailsQuery.isFetching} />
            </FormProvider>
        </Dialog>
    )
}

export default DialogReceipt;

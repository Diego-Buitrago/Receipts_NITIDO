import { FC } from "react";
// UI
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
// INTERFACES
import { CustomerForm, DataCustomer } from "../interfaces/customers";
// HOOKS
import { useCreateCustomer, useUpdateCustomer } from "../hooks";
// COMPONENTS
import { CustomerFormComponent } from "./CustomerForm";
// OTROS
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
// UTILS
import { propsDialog } from "../../../utils/defaultProps";
import ToastService from "../../../plugins/ToastService";

interface Props {
    onClose: () => void;
    currCustomer?: DataCustomer | null,
}

const DialogCustomer: FC<Props> = ({ onClose, currCustomer }) => {
    const { mutate: createCustomer, isPending } = useCreateCustomer();
    const { mutate: updateCustomer, isPending: isPending2 } = useUpdateCustomer(currCustomer?.customerId || 0);

    const methods = useForm<CustomerForm>({ defaultValues: {    
        name: currCustomer?.name || "",
        lastName: currCustomer?.lastName || "",
        documentNumber: currCustomer?.documentNumber || "",
        email: currCustomer?.email || "",
        phone: currCustomer?.phone || "",
        cellPhone: currCustomer?.cellPhone || "",
        stateId: currCustomer?.stateId || 1
    } });
        
    const onSubmit: SubmitHandler<CustomerForm> = (values: CustomerForm) => {
        if (!currCustomer) {
           createCustomer({...values});
        } else {
            const isUpdate = Array.from(Object.keys(values)).some(key => values[key as keyof CustomerForm] !== currCustomer[key as keyof CustomerForm]);
            
            if (!isUpdate) {
                return ToastService.error(`No has realizado ninguna modificación`);
            }

            updateCustomer({...values});
        }
        onClose();
    }

    return (
        <Dialog
            {...propsDialog}
            header={currCustomer ? "Edición Cliente" : "Nuevo Cliente"}           
            onHide={onClose}
            footer={
                <Button
                    rounded
                    onClick={methods.handleSubmit(onSubmit)}
                    label={currCustomer ? "Guardar Cambios" : "Guardar"}
                    loading={isPending || isPending2}
                    size="small"
                />
            }
        >
            <FormProvider {...methods}>
                <CustomerFormComponent />
            </FormProvider>
        </Dialog>
    )
}

export default DialogCustomer
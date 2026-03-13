import { FC } from "react";
// UI
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
// INTERFACES
import { DataProduct, ProductForm } from "../interfaces/products";
// HOOKS
import { useCreateProduct, useUpdateProduct } from "../hooks";
// COMPONENTS
// OTROS
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
// UTILS
import { propsDialog } from "../../../utils/defaultProps";
import ToastService from "../../../plugins/ToastService";
import { ProductFormComponent } from "./ProductFormComponent";

interface Props {
    onClose: () => void;
    currProduct?: DataProduct | null,
}

const DialogProduct: FC<Props> = ({ onClose, currProduct }) => {
    const { mutate: createProduct, isPending } = useCreateProduct();
    const { mutate: updateProduct, isPending: isPending2 } = useUpdateProduct(currProduct?.productId || 0);

    const methods = useForm<ProductForm>({ defaultValues: {
        name: currProduct?.name || "",
        description: currProduct?.description || "",
        price: currProduct?.price || 0,
        stateId: currProduct?.stateId || 1
    } });
        
    const onSubmit: SubmitHandler<ProductForm> = (values: ProductForm) => {
        if (!currProduct) {
           createProduct({...values});
        } else {
            const isUpdate = Array.from(Object.keys(values)).some(key => values[key as keyof ProductForm] !== currProduct[key as keyof ProductForm]);
            
            if (!isUpdate) {
                return ToastService.error(`No has realizado ninguna modificación`);
            }

            updateProduct({...values});
        }
        onClose();
    }

    return (
        <Dialog
            {...propsDialog}
            header={currProduct ? "Edición Producto" : "Nuevo Producto"}           
            onHide={onClose}
            footer={
                <Button
                    rounded
                    onClick={methods.handleSubmit(onSubmit)}
                    label={currProduct ? "Guardar Cambios" : "Guardar"}
                    loading={isPending || isPending2}
                    size="small"
                />
            }
        >
            <FormProvider {...methods}>
                <ProductFormComponent />
            </FormProvider>
        </Dialog>
    )
}

export default DialogProduct
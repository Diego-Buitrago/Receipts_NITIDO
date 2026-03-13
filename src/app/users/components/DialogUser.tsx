import { FC } from "react";
// UI
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
// INTERFACES
import { DataUser, UserForm } from "../interfaces/users";
// HOOKS
import { useCreateUser, useUpdateUser } from "../hooks";
// OTROS
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
// UTILS
import { propsDialog } from "../../../utils/defaultProps";
import { UserFormComponent } from "./UserForm";
import ToastService from "../../../plugins/ToastService";

interface Props {
    onClose: () => void;
    currUser?: DataUser | null,
}

const DialogUser: FC<Props> = ({ onClose, currUser }) => { 
    const { mutate: createUser, isPending } = useCreateUser();
    const { mutate: updateUser, isPending: isPending2 } = useUpdateUser(currUser?.userId || 0);

    const methods = useForm<UserForm>({ defaultValues: {
        profileId: currUser?.profileId || 1,
        name: currUser?.name || "",
        lastName: currUser?.lastName || "",
        email: currUser?.email || "",
        username: currUser?.username || "",
        password: "",
        confirmPassword: "",
        stateId: currUser?.stateId || 1
    } });
        
    const onSubmit: SubmitHandler<UserForm> = (values: UserForm) => {
        if (!currUser) {
           createUser({...values});
        } else {
            const isUpdate = Array.from(Object.keys(values)).some(key => values[key as keyof UserForm] !== currUser[key as keyof DataUser]);
            
            if (!isUpdate && !values.password) {
                return ToastService.error(`No has realizado ninguna modificación`);
            }

            updateUser({...values});
        }
        onClose();
    }

    return (
        <Dialog
            {...propsDialog}
            header={currUser ? "Edición Usuario" : "Nuevo Usuario"}           
            onHide={onClose}
            footer={
                <Button
                    rounded
                    onClick={methods.handleSubmit(onSubmit)}
                    label={currUser ? "Guardar Cambios" : "Guardar"}
                    loading={isPending || isPending2}
                    size="small"
                />
            }
        >
            <FormProvider {...methods}>
                <UserFormComponent currUser={currUser} />
            </FormProvider>
        </Dialog>
    )
}

export default DialogUser
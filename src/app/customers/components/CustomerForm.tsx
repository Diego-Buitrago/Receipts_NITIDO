import { FC } from "react";
// UI
import { FloatLabel } from "primereact/floatlabel";
import { classNames } from "primereact/utils";
import { InputText } from "primereact/inputtext";
import { SelectButton } from "primereact/selectbutton";
import { InputMask } from "primereact/inputmask";
// FORM
import { useFormContext } from "react-hook-form";
// UTILS
import { propsSelectButton } from "../../../utils/defaultProps";
import { optionStates } from "../../../utils/fixedLists";
import { optionalIsEmail } from "../../../utils/validations";
// INTERFACES
import { CustomerForm } from "../interfaces/customers";

export const CustomerFormComponent: FC = () => {
    const { register, watch, formState: { errors } } = useFormContext<CustomerForm>();

    return (
        <form>
            <div className="grid grid-cols-2 gap-6 mt-6">
                
                <div className="col-span-2 md:col-span-1">
                    <FloatLabel>
                        <InputText
                            className="p-inputtext-sm w-full"
                            invalid={!!errors.name}
                            {...register("name", { required: "El campo nombre es requerido" })}
                        />
                        <label htmlFor="name">Nombre</label>
                    </FloatLabel>
                    <div className={classNames({ "p-error": errors.name })}> {errors.name?.message}</div>
                </div>
                <div className="col-span-2 md:col-span-1">
                    <FloatLabel>
                        <InputText
                            className="p-inputtext-sm w-full"
                            invalid={!!errors.lastName}
                            {...register("lastName", { required: "El campo apellido es requerido" })}
                        />
                        <label htmlFor="lastName">Apellido</label>  
                        </FloatLabel>
                    <div className={classNames({ "p-error": errors.lastName })}> {errors.lastName?.message}</div>
                </div> 
                <div className="col-span-2 md:col-span-1">
                    <FloatLabel>
                        <InputText
                            className="p-inputtext-sm w-full"
                            invalid={!!errors.documentNumber}
                            {...register("documentNumber", { required: "El campo documento es requerido" })}
                        />
                        <label htmlFor="documentNumber">Documento</label>  
                        </FloatLabel>
                    <div className={classNames({ "p-error": errors.documentNumber })}> {errors.documentNumber?.message}</div>
                </div>    
                 <div className="col-span-2 md:col-span-1">
                    <FloatLabel>
                        <InputText
                            className="p-inputtext-sm w-full"
                            invalid={!!errors.email}
                            {...register("email", { validate: optionalIsEmail, })}
                        />
                        <label htmlFor="email">Correo</label>  
                        </FloatLabel>
                    <div className={classNames({ "p-error": errors.email })}> {errors.email?.message}</div>
                </div>                        
                <div className="col-span-2 md:col-span-1">
                    <FloatLabel>
                        <InputMask
                            className="p-inputtext-sm w-full"
                            invalid={!!errors.cellPhone}
                            mask="999-9999999"
                            value={watch('cellPhone')}
                            {...register("cellPhone")}
                        />
                        <label htmlFor="cellPhone">Celular</label>  
                        </FloatLabel>
                    <div className={classNames({ "p-error": errors.cellPhone })}> {errors.cellPhone?.message}</div>
                </div>                
                <div className="col-span-2 md:col-span-1">
                    <FloatLabel>
                        <InputMask
                            className="p-inputtext-sm w-full"
                            invalid={!!errors.phone}
                            mask="999-9999"
                            value={watch('phone')}
                            {...register("phone")}
                        />
                        <label htmlFor="phone">Teléfono</label>  
                        </FloatLabel>
                </div>                               
                <div className="col-span-2">
                    <FloatLabel>
                        <InputText
                            className="p-inputtext-sm w-full"
                            invalid={!!errors.address}
                            {...register("address")}
                        />
                        <label htmlFor="address">Dirección</label>
                    </FloatLabel>
                    <div className={classNames({ "p-error": errors.address })}> {errors.address?.message}</div>
                </div>
                <div className="col-span-2">
                    <SelectButton
                        {...propsSelectButton}
                        value={watch('stateId')}
                        className={classNames({'p-invalid': errors.stateId })}
                        options={optionStates}
                        {...register('stateId', { required: 'El campo estado es requerido' })}
                    />
                </div>
            </div>  
        </form>
    )
}

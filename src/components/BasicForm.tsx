import { FC } from "react";
// UI
import { FloatLabel } from "primereact/floatlabel";
import { classNames } from "primereact/utils";
import { InputText } from "primereact/inputtext";
import { SelectButton } from "primereact/selectbutton";
// OTHERS
import { useFormContext } from "react-hook-form";
// INTERFACES
import { BasicForm } from "../interfaces/general";
// UTILS
import { propsSelectButton } from "../utils/defaultProps";
import { optionStates } from "../utils/fixedLists";

export const BasicFormComponent: FC = () => {
    const { register, watch, formState: { errors } } = useFormContext<BasicForm>();
    return (
        <form >
            <div className="grid grid-cols-6 gap-6 mt-6">   
                <div className="col-span-6 sm:col-span-4">
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
                <div className="col-span-6 sm:col-span-2">
                    <SelectButton
                        {...propsSelectButton}
                        value={watch('stateId')}
                        className={` className="p-button-sm" ${classNames({'p-invalid': errors.stateId })}`}
                        options={optionStates}
                        {...register('stateId', { required: 'El campo estado es requerido' })}
                        optionLabel="name"
                    />
                </div>
            </div>  
        </form>
    )
}

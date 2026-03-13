import { FC } from "react";
// UI
import { FloatLabel } from "primereact/floatlabel";
import { classNames } from "primereact/utils";
import { InputText } from "primereact/inputtext";
import { SelectButton } from "primereact/selectbutton";
import { InputNumber } from "primereact/inputnumber";
import { InputTextarea } from "primereact/inputtextarea";
// FORM
import { useFormContext } from "react-hook-form";
// UTILS
import { propsCurrency, propsSelectButton } from "../../../utils/defaultProps";
import { optionStates } from "../../../utils/fixedLists";
// INTERFACES
import { ProductForm } from "../interfaces/products";

export const ProductFormComponent: FC = () => {

  const { register, watch, setValue, formState: { errors } } = useFormContext<ProductForm>();

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
        {/* <div className="col-span-2 md:col-span-1">
          <FloatLabel>
            <InputText
              keyfilter="int"
              className="p-inputtext-sm w-full"
              invalid={!!errors.stock}
              {...register("stock", { required: "El campo stock es requerido" })}
            />
            <label htmlFor="stock">Stock</label>
          </FloatLabel>
          <div className={classNames({ "p-error": errors.stock })}> {errors.stock?.message}</div>
        </div>               */}
        <div className="col-span-2 md:col-span-1">
          <FloatLabel>
            <InputNumber 
              className="p-inputtext-sm w-full"
              inputClassName="p-inputtext-sm w-full"
              {...register("price", {
                required: "El campo precio es requerido",
                min: { message: "El valor mínimo es 100", value: 100 }
              })} 
              {...propsCurrency}
              value={watch("price")}
              onChange={({ value }) => setValue("price", value || 0)}
              />
              <label htmlFor="price">Precio</label>  
          </FloatLabel>
          <div className={classNames({ "p-error": errors.price })}> {errors.price?.message}</div>
        </div>    
        <div className="col-span-2">
          <FloatLabel>
            <InputTextarea
              rows={1}
              autoResize
              className="p-inputtext-sm w-full"
              invalid={!!errors.description}
              {...register("description")}
              value={watch("description")}
            />
            <label htmlFor="description">Descripción</label>  
          </FloatLabel>
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

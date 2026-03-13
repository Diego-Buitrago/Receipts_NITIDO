import { FC, useState } from "react";
// UI
import { Dropdown } from "primereact/dropdown";
import { FloatLabel } from "primereact/floatlabel";
import { classNames } from "primereact/utils";
import { InputText } from "primereact/inputtext";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { SelectButton } from "primereact/selectbutton";
// FORM
import { useFormContext } from "react-hook-form";
// HOOKS
import { useGetProfiles } from "../hooks";
// UTILS
import { propsSelect, propsSelectButton } from "../../../utils/defaultProps";
import { optionStates } from "../../../utils/fixedLists";
import { isRequired, optionalIsEmail, validatePasswordConfirmation } from "../../../utils/validations";
import { FaEye, FaEyeSlash } from "react-icons/fa";
// INTERFACES
import { DataUser, UserForm } from "../interfaces/users";

interface IsVisible {
    password: boolean;
    confirmPassword: boolean;
}

interface Props {
    currUser?: DataUser | null,
}

export const UserFormComponent: FC<Props> = ({ currUser }) => {
    const { register, watch, formState: { errors } } = useFormContext<UserForm>();
    const { getProfilesQuery } = useGetProfiles();
    const [isVisible, setIsVisible] = useState<IsVisible>({ password: false, confirmPassword: false }); 

    return (
        <form >
            <div className="grid grid-cols-2 gap-6 mt-6">    
                <div className="col-span-2">
                    <FloatLabel>
                    <Dropdown
                        {...register("profileId", { required: "El campo perfil es requerido" })}                    
                        {...propsSelect}
                        value={watch("profileId")}
                        className="p-inputtext-sm w-full"
                        options={getProfilesQuery.data || []}
                        invalid={!!errors.profileId}  
                        showClear={false}                          
                    />
                    <label htmlFor="profileId">Perfil</label>    
                    </FloatLabel>
                    <div className={classNames({ "p-error": errors.profileId })}> {errors.profileId?.message}</div>
                </div>
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
                            invalid={!!errors.email}
                            {...register("email", { validate: optionalIsEmail, })}
                        />
                        <label htmlFor="email">Correo</label>  
                        </FloatLabel>
                    <div className={classNames({ "p-error": errors.email })}> {errors.email?.message}</div>
                </div>
                <div className="col-span-2 md:col-span-1">
                    <FloatLabel>
                        <InputText
                            className="p-inputtext-sm w-full"
                            invalid={!!errors.username}
                            {...register("username", { required: "El campo usuario es requerido" })}
                        />
                        <label htmlFor="username">Usuario</label>  
                        </FloatLabel>
                    <div className={classNames({ "p-error": errors.username })}> {errors.username?.message}</div>
                </div>
                <div className="col-span-2 md:col-span-1">
                    <FloatLabel>
                        <IconField>
                        <InputIcon onClick={() => setIsVisible({ ...isVisible, password: !isVisible.password })}>
                            {isVisible.password
                                ? (<FaEyeSlash />)                                    
                                : (<FaEye />)
                            }
                        </InputIcon> 
                        <InputText
                           type={isVisible.password ? "text" : "password"}
                            className="p-inputtext-sm w-full"         
                            invalid={!!errors.password}
                            {...register('password', { 
                                validate: isRequired(!currUser, 'contraseña'),
                                minLength: { value: 8, message: "El campo contraseña debe tener al menos 8 caracteres" }, 
                            } )}
                        />
                        </IconField>
                        <label htmlFor="password">Contraseña</label>
                    </FloatLabel>
                    <div className={classNames({ "p-error": errors.password })}> {errors.password?.message}</div>
                </div>
                <div className="col-span-2 md:col-span-1">
                    <FloatLabel>
                        <IconField>
                            <InputIcon onClick={() => setIsVisible({ ...isVisible, confirmPassword: !isVisible.confirmPassword })}>
                                {isVisible.confirmPassword
                                    ? (<FaEyeSlash />)                                    
                                    : (<FaEye />)
                                }
                            </InputIcon> 
                        <InputText
                           type={isVisible.confirmPassword ? "text" : "password"}
                            className="p-inputtext-sm w-full"         
                            invalid={!!errors.confirmPassword}                              
                            {...register('confirmPassword', { 
                                validate: validatePasswordConfirmation(watch('password')),
                                minLength: { value: 8, message: "El campo contraseña debe tener al menos 8 caracteres" }, 
                                // onChange: (e) => setValue('clave', e.target.value)
                            } )}
                        />
                        </IconField>
                        <label htmlFor="confirmPassword">Confirmar Contraseña</label>
                    </FloatLabel>
                    <div className={classNames({ "p-error": errors.confirmPassword })}> {errors.confirmPassword?.message}</div>
                </div>
                <div className="col-span-2">
                    <SelectButton
                        {...propsSelectButton}
                        value={watch('stateId')}
                        className={classNames({'p-invalid': errors.stateId })}
                        options={optionStates}
                        {...register('stateId', { required: 'El campo estado es requerido' })}
                        optionLabel="name"
                    />
                </div>
            </div>  
        </form>
    )
}

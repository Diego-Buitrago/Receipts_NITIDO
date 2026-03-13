import { useContext, useState } from "react";
// UI
import { InputText } from "primereact/inputtext";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { classNames } from "primereact/utils";
// OTROS
import { SubmitHandler, useForm } from "react-hook-form";
import { Navigate } from "react-router-dom";
import { FaEye, FaEyeSlash  } from "react-icons/fa";

import "./login.css";
import { AuthContext } from "../context";
import { Button } from "primereact/button";
import { LoginForm } from "../interfaces/login";

const Login = () => {

    const { loginUser } = useContext(AuthContext);
    const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
        defaultValues: {
            user: "",
            password: ""
        }
    });

    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = () => setIsVisible(!isVisible);
    
    const onSubmit: SubmitHandler<LoginForm> = async({ user, password }) => {
        const isAuth = await loginUser(user, password);
        if (isAuth) return (<Navigate to="/auth" />)
    }
    
    return (
        <div className="flex h-screen w-full items-center justify-center bg-gray-900 bg-cover bg-no-repeat login-context">
            <div className="rounded-xl bg-gray-800 bg-opacity-50 px-16 py-10 shadow-lg backdrop-blur-md max-sm:px-8 min-w-96">
                <div className="text-white">
                <div className="mb-8 flex flex-col items-center">
                    <img src="/src/assets/logo.jpeg" width="100" alt=""/>
                    <strong className="text-2xl">Nítido</strong>
                    {/* <h4 className="mb-2">Restaurante</h4> */}
                </div>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid gap-4">
                        <div>
                            <InputText
                                className="p-inputtext-sm w-full"
                                placeholder="Nombre"
                                size="small"
                                invalid={!!errors.user}
                                {...register("user", { required: "El campo usuario es requerido" })}
                            />
                            <div className={classNames({ "p-error": errors.user })}> {errors.user?.message}</div>
                        </div>
                        <div>
                            <IconField>
                                <InputIcon onClick={toggleVisibility}>
                                {isVisible 
                                    ? (<FaEyeSlash />)                                    
                                    : (<FaEye />)
                                }</InputIcon>                               
                                <InputText
                                    type={isVisible ? "text" : "password"}
                                    className="p-inputtext-sm w-full"
                                    placeholder="Contraseña"
                                    invalid={!!errors.password}
                                    {...register("password", { required: "El campo contraseña es requerido" })}
                                />
                            </IconField>
                            <div className={classNames({ "p-error": errors.password })}> {errors.password?.message}</div>
                        </div>
                    </div>                    
                    <div className="mt-8 flex justify-center text-lg text-black">
                        <Button 
                            label="Iniciar Sesión" type="submit" 
                            className="w-full p-button-sm h-8"
                            size="small"
                        />
                    </div>
                </form>
                </div>
            </div>  
        </div>
    )
}

export default Login;

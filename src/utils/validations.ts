export const isValidEmail = (email: string) => {
    const match = String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );

    return !!match;
};

export const isEmail = (email: string) => {
    return isValidEmail(email) ? undefined : "Correo invalido. E.j. example@email.com";
};

export const optionalIsEmail = (email: string) => {
    if (!email) return true;

    return isValidEmail(email) ? undefined : "Correo invalido. E.j. example@email.com";
};

export const validatePasswordConfirmation = (clave: string) => (value: string) => {
    if (!clave) return true;
    return clave === value || "Las contraseñas no coinciden";
};

export const isStrongPassword = (password: string) => {
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#]).{8,}$/;
    return strongPasswordRegex.test(password)
        ? undefined
        : "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial.";
};

export const isRequired = (required: boolean, campo: string) => (value: string) => {
    if (required) {
        return value !== "" || `El campo ${campo} es requerido`;
    }

    return true;
};

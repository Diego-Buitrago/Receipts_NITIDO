import { Fragment, MouseEvent, ReactElement } from "react";
import { Divider } from "primereact/divider";
import { Button } from "primereact/button";
import { FaFilter, FaPlus } from "react-icons/fa";

interface PropsHeaderTemplate {
    title: string;
    label?: string;
    onAdd: () => void;
    onFilters: (e: MouseEvent<HTMLElement>) => void;
}

export const HeaderPassword = () => {
    return <h6>Elige una contraseña</h6>;
};

export const FooterPassword = () => {
    return (
        <Fragment>
            <Divider />
            <p className="mt-2">Sugerencias</p>
            <ul className="pl-2 ml-2 mt-0" style={{ lineHeight: "1.5" }}>
                <li>Al menos una minúscula</li>
                <li>Al menos una mayúscula</li>
                <li>Al menos un número</li>
                <li>Al menos un carácter especial</li>
                <li>Mínimo 8 caracteres</li>
            </ul>
        </Fragment>
    );
};

export const HeaderTemplate = ({ title, onAdd, onFilters  }: PropsHeaderTemplate): ReactElement => {
    return (
        <div className="flex justify-between">
            <div />
            <div className="text-center">{title}</div>
            <div className="grid grid-cols-2 gap-1">
                <Button
                    rounded
                    icon={<FaPlus />}
                    // label={label}
                    onClick={onAdd}
                    // disabled={disabled}
                />
                <Button
                    rounded
                    onClick={onFilters}
                    icon={<FaFilter />}
                    severity="secondary"
                />
            </div>
        </div>
    )
}


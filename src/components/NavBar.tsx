// UI

import { Button } from "primereact/button";
import { useContext } from "react";
import { FaAlignJustify } from "react-icons/fa";
import { AuthContext } from "../context";

interface Props {
    onCollapsed: () => void
}

export const NavBar = ({ onCollapsed }: Props) => {

    const { logout } = useContext(AuthContext);

    return (
        <div className="flex justify-between h-13.5 pl-5 py-2 bg-indigo-500" >
            <div>
                <Button 
                    severity="contrast"
                    // className="h-7" 
                     className="p-button-sm"
                    // icon={<FaAlignJustify size={18} />}
                    onClick={onCollapsed} 
                    size="small"
                >  
                <FaAlignJustify size={16} />
                </Button>
            </div>       
            <div className="mr-5">                
                <Button 
                    className="p-button-sm"
                    severity="contrast"
                    label="Cerrar Sesión"
                    onClick={logout} 
                    rounded 
                    size="small"
                    // outlined
                /> 
            </div>
        </div>
    )
}

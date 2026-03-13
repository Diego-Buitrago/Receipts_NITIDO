import { FC, useContext, useMemo, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
// UI
import { Sidebar } from 'primereact/sidebar';
import { Menu } from 'primereact/menu';     
import { Button } from 'primereact/button';
import { ScrollPanel } from 'primereact/scrollpanel';        
// ICONS
import { FaUser, FaTimes, FaUsers } from "react-icons/fa";
import { FaHandHoldingDollar } from 'react-icons/fa6';
import { GiToolbox } from 'react-icons/gi';
// CONTEXT
import { AuthContext } from '../context';
// COMPONENTS
import { NavBar } from './NavBar';
import logo from '../assets/logo.jpeg';

type MenuItem = {
    label: string;
    icon?: React.ReactNode;
    command?: () => void;
    classNames?: string;
    items?: MenuItem[];
    visible?: boolean
};


const getMenu = (navigate: (path: string) => void, profile: number | null): MenuItem[] => {
    return [
        { 
            label: 'Home', 
            items: [
                {
                    id: "",
                    label: 'Recibos',
                    icon: <FaHandHoldingDollar className='ml-3 mr-2' />,
                    command: () => navigate('/app/receipts'),
                    classNames: "bg-blue-500 text-white",
                },           
            ].filter(Boolean)
        },
        { 
            label: 'Administración', 
            items: [
                {
                    label: 'Usuarios',
                    icon: <FaUser className='ml-3 mr-2' />,
                    command: () => navigate('/app/users'),
                    visible: profile === 1,
                },
                {
                    label: 'Clientes',
                    icon: <FaUsers className='ml-3 mr-2' />,
                    command: () => navigate('/app/customers'),
                    visible: profile === 1,
                },
                {
                    label: 'Productos',
                    icon: <GiToolbox className='ml-3 mr-2' />,
                    command: () => navigate('/app/products'),
                    visible: profile === 1
                },
            ]
        }
    ]
}

const Layout: FC = () => {
    const { profile } = useContext(AuthContext);
    const [visible, setVisible] = useState(false);

    const navigate = useNavigate();
    const items = useMemo(() => getMenu(navigate, profile || null), [navigate]);

    const onCollapsed = () => {
        setVisible(prev => !prev);
    }

    return (
        <div className="layout">
            {/* Sidebar */}
            <NavBar onCollapsed={onCollapsed} />
            <Sidebar 
                visible={visible} 
                onHide={() => setVisible(false)} 
                style={{ width: '15rem' }} 
                dismissable={false}  // Evita que se cierre al hacer clic fuera
                modal={false}        // Elimina el fondo oscuro
                closeOnEscape={false} // Opcional: evita cerrar con ESC
                content={({ hide }) => (
                    <div>
                        <div className='flex flex-column py-2 px-3'>                           
                            <div className='flex justify-content-center align-items-center'>
                                <img className='rounded-md' src={logo} alt="Image" width="50" />
                                <p className='font-sans text-xl font-semibold text-indigo-600 my-2 mx-3'>NITIDO</p>
                                <Button
                                    onClick={(e) => hide(e)}
                                    icon={<FaTimes />}
                                    rounded
                                    outlined
                                    severity="secondary"
                                    // className=""
                                    style={{ position: "absolute", right: "0.5rem", top: "0.7rem" }}
                                />
                            </div>
                        </div>
                        <div className="card flex justify-content-center">
                            <ScrollPanel style={{ width: '100%', height: window.innerHeight * 0.88 }}>
                            {/* <PanelMenu model={items} className="w-full md:w-20rem" /> */}
                            <Menu className='min-w-56 mx-2' model={items} />
                            </ScrollPanel>
                        </div>
                    </div>               
                )}
            />

            {/* Contenido de la página */}
            <div className='mt-2' style={{ marginLeft: visible ? '16.5rem' : '1.5rem' }}>
                <Outlet />
            </div>
        </div>
    );
};

export default Layout;

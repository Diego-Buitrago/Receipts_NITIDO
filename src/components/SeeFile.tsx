import { FC } from "react";
// UI
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { propsDialog } from "../utils/defaultProps";

export interface DataFile {
    name: string;
    url: string;
}

interface Props {
    onClose: () => void;
    fileData: DataFile;
}

const SeeFile: FC<Props> = ({ onClose, fileData }) => { 
    
    const onDownload = () => {
        const link = document.createElement('a');
        link.href = fileData.url;
        link.download = `${fileData.name}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    return (
        <Dialog
            {...propsDialog}
            maximizable={true}
            visible={true}
            onHide={onClose}
            style={{ width: "70vw" }}
            header={fileData.name}
            footer={
                <div>
                    <Button 
                        label="Cerrar" 
                        icon="pi pi-times" 
                        onClick={onClose} 
                        className="p-button-text p-button-secondary" 
                    />
                    <Button 
                        label="Descargar" 
                        icon="pi pi-download" 
                        onClick={onDownload} 
                        className="p-button-success" 
                    />
                </div>
            }
        >
            <iframe
                title="pdf"
                src={fileData.url}
                style={{ width: "100%", height: "80vh" }}
            />
        </Dialog>
    )
}

export default SeeFile;

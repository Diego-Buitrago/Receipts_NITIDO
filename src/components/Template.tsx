import { Fragment, MouseEvent, ReactElement, useMemo } from "react";
import { Divider } from "primereact/divider";
import { Button } from "primereact/button";
import { Skeleton } from "primereact/skeleton";
import { FaFilter, FaPlus } from "react-icons/fa";
import { Tag } from "primereact/tag";
import { MdDelete, MdEdit } from "react-icons/md";
import { DeletePopup } from "./DeletePopup";

interface PropsHeaderTemplate {
    title: string;
    label?: string;
    onAdd: () => void;
    onFilters: (e: MouseEvent<HTMLElement>) => void;
}

interface PropsActionTemplate {
   onClick:  () => void;
   onConfirm:  () => void;
   titleEdit: string;
   titleDelete: string;
   titleConfirm: string;
   editIcon?: ReactElement;
   deleteIcon?: ReactElement;
   isEdit?: boolean;
   isDelete?: boolean;
}

const getSeverity = (status: number) => {
    switch (status) {
        case 1:
            return 'success';

        case 2:
            return 'warning';

        case 3:
            return 'danger';

        default:
            return null;
    }
};

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
                    severity="success"
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

export const ActionTemplate = ({ onClick, onConfirm, titleEdit, titleDelete, titleConfirm, editIcon, deleteIcon, isEdit = true, isDelete = true }: PropsActionTemplate): ReactElement => {

    const EditIcon = useMemo<ReactElement>(() => {
        return editIcon || <MdEdit size={24} />;
    }, [editIcon]);

    const DeleteIcon = useMemo<ReactElement>(() => {
        return deleteIcon || <MdDelete size={24} />;
    }, [deleteIcon]);

    return (
        <div className="flex gap-1 justify-center">
            {isEdit && (
                <Button
                    rounded
                    severity="warning"
                    onClick={onClick}
                    title={titleEdit}
                    icon={EditIcon}
                />
            )}
            {isDelete && (
                <DeletePopup
                    title={titleConfirm}
                    onConfirm={onConfirm}
                >
                <Button
                    rounded 
                    severity="danger"
                    icon={DeleteIcon}
                    title={titleDelete}
                />
                </DeletePopup>
            )}
        </div>
    )
}

export const SpanLoading = <span style={{ color: "#2196f3" }}>{"Cargando..."}</span>;

export const SkeletonForm = (
    <div className="field col-12">
        <Skeleton className="mb-2"></Skeleton>
        <Skeleton width="20rem" className="mb-2"></Skeleton>
        <Skeleton width="25rem" className="mb-2"></Skeleton>
        <Skeleton height="2rem" className="mb-2"></Skeleton>

        <Skeleton className="mb-2"></Skeleton>
        <Skeleton width="20rem" className="mb-2"></Skeleton>
        <Skeleton width="25rem" className="mb-2"></Skeleton>
        <Skeleton height="2rem" className="mb-2"></Skeleton>
    </div>
);

export const statusBodyTemplate = (item: any) => {
    return <Tag value={item.state} severity={getSeverity(item.stateId)}></Tag>;
};

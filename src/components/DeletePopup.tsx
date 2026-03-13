import React, { FC, MouseEvent, ReactElement } from 'react';
import { ConfirmPopup, confirmPopup } from 'primereact/confirmpopup';

interface DeletePopupProps {
  children: ReactElement<{ onClick?: (e: MouseEvent<HTMLElement>) => void }>;
  title: string;
  onConfirm: () => void
}

export const DeletePopup: FC<DeletePopupProps> = ({ children, title, onConfirm }) => {

  const confirm = (event: MouseEvent<HTMLElement>) => {
    confirmPopup({
      target: event.currentTarget,
      message: title,
      // icon: 'pi pi-info-circle',
      defaultFocus: 'reject',
      acceptClassName: 'p-button-danger',
      accept: onConfirm,
      // reject: () => console.log(""),
      acceptLabel: "SI",
      rejectLabel: "NO"
    });
  };

   const childrenWithProps = React.Children.map(children, child => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, { 
        onClick: (e: React.MouseEvent<HTMLElement>) => {
          confirm(e);
          // Si el child original tenía un onClick, lo ejecutamos también
          // child.props.onClick?.(e);
        }
      });
    }
    return child;
  });

  return (
    <div>
     <ConfirmPopup />
      {childrenWithProps}
    </div>
  )
}

import React, { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';

const DeleteDialog = (props) => {
 

  const handleDelete = () => {
    props.onDelete();
    props.onHide();
  };

  const footer = (
    <>
        <Button label="No" icon="pi pi-times" className="p-button-text" onClick={props.onHide} />
        <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={handleDelete} />
    </>
  );

  return (  
    <Dialog visible={props.visible} style={{ width: '450px' }} header="Confirm" modal footer={footer} onHide={props.onHide}>
        <div className="flex align-items-center justify-content-center">
            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />             
            {props.inputValue && <span>
                Are you sure you want to delete ({props.inputValue})?
            </span> }   

            {props.inputLable && <span>
                {props.inputLable}
            </span> }          
        </div>
    </Dialog>

  );
};

export default DeleteDialog;
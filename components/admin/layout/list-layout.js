import React, { useEffect, useRef, useState } from 'react';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import Loading from '../../../components/admin/Loading';
import { getSession, useSession } from "next-auth/react"; 
import DeleteDialog from '../DeleteDialog';
const ListLayout = (props) => {    
    const toast = useRef(null);
    const {children,item,openNew,selectedItems,dataset,items,setItems,setSelectedItems,setItem,loading} = props;
    
    const [deleteItemsDialog, setDeleteItemsDialog] = useState(false);
    const { data: session, status } = useSession();  
    const openNewForm = () => {
        alert('open')
    };
   
    if (status === "unauthenticated") router.push("/auth/login");
    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="New" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew ? openNew: openNewForm} />
                    <Button label="Delete" icon="pi pi-trash" className="p-button-danger" onClick={confirmDeleteSelected} disabled={!selectedItems || !selectedItems.length} />
                </div>
            </React.Fragment>
        );
    };
    
    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>        
                <Button label="Export" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />
            </React.Fragment>
        );
    };

    const confirmDeleteSelected = () => {
        setDeleteItemsDialog(true);
    };

    const exportCSV = () => {
        dataset.current.exportCSV();
    };

    const deleteSelectedItems = () => {
       /* let _items = items.filter((val) => !selectedItems.includes(val));
        setItems(_items);*/
        props.onDeleteItems();
        setDeleteItemsDialog(false);
        setSelectedItems(null);
       // toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Items Deleted', life: 3000 });
    };
    
    
    const hideDeleteItemsDialog = () => {
        setDeleteItemsDialog(false);
    };
   
    if (status === "authenticated") {
        return <div className="grid crud-demo">
               
               <div className="col-12">
                    <div className="card">
                        <Toast ref={toast} />
                        <Loading open={loading} />
                        <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>
                        {React.Children.map(children, child =>
                            React.cloneElement(child, { toast })
                        )}
                    </div>
                </div>             

                <DeleteDialog
                    visible={deleteItemsDialog}
                    onHide={hideDeleteItemsDialog}
                    onDelete={deleteSelectedItems}
                    inputLable = "Are you sure you want to delete the selected items?"
                    />
          </div>
     }
     return <div>Loading ...</div>;      
}

export default ListLayout;
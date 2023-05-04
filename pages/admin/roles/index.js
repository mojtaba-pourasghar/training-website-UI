import getConfig from 'next/config';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { InputSwitch } from 'primereact/inputswitch';
import { RadioButton } from 'primereact/radiobutton';
import { Toast } from 'primereact/toast';
import { classNames } from 'primereact/utils';
import React, { useEffect, useRef, useState } from 'react';

import  RoleService  from '../../../services/RoleService';
import ListLayout from '../../../components/admin/layout/list-layout';
import { getSession, useSession } from "next-auth/react"; 
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import RoleField from "../../../Keys/RoleField";
import { useRouter } from 'next/router';
import DeleteDialog from '../../../components/admin/DeleteDialog';
export async function getStaticProps({locale}){
    return {
        props:{
            ...(await serverSideTranslations(locale,['role','common'])),
        }
    }
}
 
function Roles() {

  let emptyRole = {
    id: null,
    name: '',
  };

const toast = useRef(null);
const [roles, setRoles] = useState(null);
const [loading, setLoading] = useState(true);
const [selectedRoles, setSelectedRoles] = useState(null);
const [role, setRole] = useState(emptyRole);
const [submitted, setSubmitted] = useState(false);
const [globalFilter, setGlobalFilter] = useState(null);
const [deleteRoleDialog, setDeleteRoleDialog] = useState(false);
const dt = useRef(null);
 
const { data: session } = useSession();
const { t } = useTranslation();
const router = useRouter();



useEffect(() => {
    
    getSession().then((session) => {
        RoleService.getAdminRoles(session.jwt)
        .then(data => {setRoles(data);console.log(data);})
        .catch((error)=>{               
            if (error.response) {
              toast.current.show({ severity: t('common:error'), summary: t('common:summaryError'), detail: error.response.data.apierror.message, life: process.env.MESSAGE_TIMEOUT  });
            }             
        });
        setLoading(false);        
      });      
}, []);


const openNew = () => {
   router.push(`/${process.env.ADMIN}/roles/add`)
};
 
const confirmDeleteRole = (role) => {
    setRole(role);
    setDeleteRoleDialog(true);
};

const editRole = (role) => {     
  let _role = { ...role };
  setRole(_role);
  router.push(`/${process.env.ADMIN}/roles/edit/${_role.roleId}`);
};


const codeBodyTemplate = (rowData) => {
    return (
        <>
            <span className="p-column-title">{t('role:id')}</span>
            {rowData[RoleField.id]}
        </>
    );
};

const nameBodyTemplate = (rowData) => {
    return (
        <>
            <span className="p-column-title">{t('role:name')}</span>
            {rowData[RoleField.name]}
        </>
    );
};

const descriptionBodyTemplate = (rowData) => {
    return (
        <>
            <span className="p-column-title">{t('role:description')}</span>
            {rowData[RoleField.description]}
        </>
    );
};

const convertStatus = (status) =>{
  console.log(status);
  switch (status) {
    case 1:
        return t('common:active')
    case 0:
    return t('common:inactive')
    default:
        return t('common:inactive')
    }
}

const statusBodyTemplate = (rowData) => {
    return (
        <>
            <span className="p-column-title">{t('role:state')}</span>            
            {rowData[RoleField.state] == 1 ? <span className={`p-tag p-component p-tag-success`}>{convertStatus(rowData[RoleField.state])}</span> : <span className={`p-tag p-component p-tag-danger p-tag-rounded`}>{convertStatus(rowData[RoleField.state])}</span> }
        </>
    );
};

const actionBodyTemplate = (rowData) => {
    return (
        <>
            <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editRole(rowData)} />
            <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => confirmDeleteRole(rowData)} />
        </>
    );
};

const header = (
    <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
        <h5 className="m-0">Manage Roles</h5>
        <span className="block mt-2 md:mt-0 p-input-icon-left">
            <i className="pi pi-search" />
            <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
        </span>
    </div>
);

const deleteRole = () => {
    setLoading(true); 
   RoleService.deleteAdminRole(session.jwt,role.roleId)
   .then(data => {    
            let _roles = roles.filter((val) => val.roleId !== role.roleId);
            setRoles(_roles);
            setDeleteRoleDialog(false);
            setRole(emptyRole);
            setLoading(false);
            toast.current.show({ severity: t('common:success'), summary: t('common:summarySuccessful'), detail: t('role:role_deleted'), life: process.env.MESSAGE_TIMEOUT });
    })
    .catch((error)=>{               
        if (error.response) {
          setLoading(false);
          toast.current.show({ severity: t('common:error'), summary: t('common:summaryError'), detail: error.response.data.apierror.message, life: process.env.MESSAGE_TIMEOUT });
        }             
    });
   
};

const hideDeleteRoleDialog = () => {
    setDeleteRoleDialog(false);
};

const deleteSelectedRoles = () => {
    console.log(selectedRoles) ;
    let _roles = roles.filter((val) => !selectedRoles.includes(val));
     setRoles(_roles);
 };

return (

            <ListLayout 
            openNew={openNew}             
            dataset={dt} 
            selectedItems={selectedRoles} 
            setSelectedItems={setSelectedRoles}
            loading={loading}
            onDeleteItems={deleteSelectedRoles}
            >
                
                <Toast ref={toast} />
                <DataTable
                    ref={dt}
                    value={roles}
                    selection={selectedRoles}
                    onSelectionChange={(e) => setSelectedRoles(e.value)}
                    dataKey= {RoleField.id}
                    paginator
                    rows={25}
                    rowsPerPageOptions={[10, 25, 50]}
                    className="datatable-responsive"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} roles"
                    globalFilter={globalFilter}
                    emptyMessage="No roles found."
                    header={header}
                    responsiveLayout="scroll"
                    >
                    <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
                    <Column field={RoleField.id} header={t('role:id')} sortable body={codeBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                    <Column field={RoleField.name} header={t('role:name')} sortable body={nameBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                    <Column field={RoleField.description} header={t('role:description')} sortable body={descriptionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                    <Column field={RoleField.state} header={t('role:state')} body={statusBodyTemplate} sortable headerStyle={{ minWidth: '10rem' }}></Column>
                    <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                </DataTable>
                

                <DeleteDialog
                    visible={deleteRoleDialog}
                    onHide={hideDeleteRoleDialog}
                    onDelete={deleteRole}
                    inputValue = {role.name}
                    />
                          
            </ListLayout>
            
        );
   
}

export default Roles;

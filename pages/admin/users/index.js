import getConfig from 'next/config';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { FileUpload } from 'primereact/fileupload';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { InputTextarea } from 'primereact/inputtextarea';
import { Checkbox } from 'primereact/checkbox';
import { InputSwitch } from 'primereact/inputswitch';
import { RadioButton } from 'primereact/radiobutton';
import { Toast } from 'primereact/toast';


import { classNames } from 'primereact/utils';
import React, { useEffect, useRef, useState } from 'react';
import  UserService  from '../../../services/UserService';
import  RoleService  from '../../../services/RoleService';
import ListLayout from '../../../components/admin/layout/list-layout';

import { getSession, useSession } from "next-auth/react"; 
import { useTranslation } from 'next-i18next';

import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import UserField from '../../../Keys/UserField';
import RoleField from "../../../Keys/RoleField";
import DeleteDialog from '../../../components/admin/DeleteDialog';
export async function getStaticProps({locale}){
    return {
        props:{
            ...(await serverSideTranslations(locale,['user','common'])),
        }
    }
}

function Users() {
  
 let emptyRole={
    roleId : 0
 } 
 let emptyUser = {
    id: null,
    name: '',
    email: '',
    mobile: '',
    role: emptyRole,
    state: 0,
    cstate: false,
    password: '',
    repassword: ''
};
const toast = useRef(null);
const [users, setUsers] = useState(null);
const [roles, setRoles] = useState(null);
const [userDialog, setUserDialog] = useState(false);
const [loading, setLoading] = useState(true);
const [user, setUser] = useState(emptyUser);
const [role, setRole] = useState(emptyRole);
const [selectedUsers, setSelectedUsers] = useState(null);
const [submitted, setSubmitted] = useState(false);
const [globalFilter, setGlobalFilter] = useState(null);
const [deleteUserDialog, setDeleteUserDialog] = useState(false);
const dt = useRef(null);
const contextPath = getConfig().publicRuntimeConfig.contextPath;
const { data: session } = useSession();
const { t } = useTranslation();
useEffect(() => {
    
    getSession().then((session) => {
        UserService.getAdminUsers(session.jwt)
        .then(data => setUsers(data))
        .catch((error)=>{               
            if (error.response) {
              toast.current.show({ severity: t('common:error'), summary: t('common:summaryError'), detail: error.response.data.apierror.message, life: process.env.MESSAGE_TIMEOUT  });
            }             
        });
        RoleService.getAdminRoles(session.jwt)
        .then(data => setRoles(data))
        .catch((error)=>{               
            if (error.response) {
              toast.current.show({ severity: t('common:error'), summary: t('common:summaryError'), detail: error.response.data.apierror.message, life: process.env.MESSAGE_TIMEOUT });
            }             
        });
        setLoading(false);        
      });      
}, []);


const openNew = () => {
    setUser(emptyUser);
    setSubmitted(false);
    setUserDialog(true);
};
 
const hideDialog = () => {
    setSubmitted(false);
    setUserDialog(false);
};



const saveUser = () => {

    setSubmitted(true);
    //console.log(user);
    if (user.name.trim()) {
        let _users = [...users];
        let _user = { ...user };
        if (user.userId) {
            UserService.updateAdminUser(session.jwt,user)
            .then((data)=>{
                const index = findIndexById(user.userId);
                _users[index] = _user;
                setUsers(_users);
                setLoading(false);
                toast.current.show({ severity: t('common:success'), summary: t('common:summarySuccessful'), detail: t('user:user_updated'), life: process.env.MESSAGE_TIMEOUT });
            })
            .catch((error)=>{               
                if (error.response) {
                    setLoading(false);  
                  toast.current.show({ severity: t('common:error'), summary: t('common:summaryError'), detail: error.response.data.apierror.message, life: process.env.MESSAGE_TIMEOUT });
                }             
            });
            
        } else {
            setLoading(true);
            UserService.saveAdminUser(session.jwt,user)
            .then((newUser)=>{
                //console.log(u)
                _users.push({...newUser});
                setUsers(_users);
                setLoading(false);
                toast.current.show({ severity: t('common:success'), summary: t('common:summarySuccessful'), detail: t('user:user_created'), life: process.env.MESSAGE_TIMEOUT });
                }
            )
            .catch((error)=>{               
              if (error.response) {
               /* console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);*/
                setLoading(false);
                toast.current.show({ severity: t('common:error'), summary: t('common:summaryError'), detail: error.response.data.apierror.message, life: process.env.MESSAGE_TIMEOUT });
              }             
            });            
        }
       // setTimeout(() => {  console.log("World!");UserService.getAdminUsers(session.jwt).then(data => setUsers(data)); }, 10000);
        
        
        
        setUserDialog(false);
        setUser(emptyUser);
    }
};

const editUser = (user) => {
     
    let _user = { ...user };
    let _val = _user.state ? true : false;    
    _user['cstate'] = _val;
    setUser(_user);
    //setUser({ ...user });
    setUserDialog(true);
};

const confirmDeleteUser = (user) => {
    setUser(user);
    setDeleteUserDialog(true);
};


const findIndexById = (id) => {
    let index = -1;
    for (let i = 0; i < users.length; i++) {
        if (users[i].userId === id) {
            index = i;
            break;
        }
    }
    return index;
};

const onChangeRole = (e) => {    
    let _role = { ...role}
    _role['roleId'] = e.value;
    let _user = { ...user };
    _user['role'] = _role;
    setUser(_user);
};

const onInputChange = (e, name) => {
    const val = (e.target && e.target.value) || '';
    let _user = { ...user };
    _user[`${name}`] = val;
    setUser(_user);
};

const onStateChange = (e, name) => {
    const val = (e.target && e.target.value) || false;
    let _val = val ? 1 : 0;
    let _user = { ...user };
    _user[`${name}`] = _val;
    _user['cstate'] = val;
    setUser(_user);
};


const codeBodyTemplate = (rowData) => {
    return (
        <>
            <span className="p-column-title">{t('user:id')}</span>
            {rowData[UserField.id]}
        </>
    );
};

const nameBodyTemplate = (rowData) => {
    return (
        <>
            <span className="p-column-title">{t('user:name')}</span>
            {rowData[UserField.name]}
        </>
    );
};
const roleBodyTemplate = (rowData) => {
    return (
        <>
            <span className="p-column-title">{t('user:role')}</span>
            {/*rowData.role.name*/}
            {rowData[UserField.role][RoleField.name]}
        </>
    );
};

const emailBodyTemplate = (rowData) => {
    return (
        <>
            <span className="p-column-title">{t('user:email')}</span>
            {rowData[UserField.email]}
        </>
    );
};

const mobileBodyTemplate = (rowData) => {
    return (
        <>
            <span className="p-column-title">{t('user:mobile')}</span>
            {rowData[UserField.mobile]}
        </>
    );
};

const convertStatus = (status) =>{
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
            <span className="p-column-title">{t('user:state')}</span>
            
            {rowData[UserField.state] == 1 ? <span className={`p-tag p-component p-tag-success`}>{convertStatus(rowData[UserField.state])}</span> : <span className={`p-tag p-component p-tag-danger p-tag-rounded`}>{convertStatus(rowData[UserField.state])}</span> }
        </>
    );
};

const actionBodyTemplate = (rowData) => {
    return (
        <>
            <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editUser(rowData)} />
            <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => confirmDeleteUser(rowData)} />
        </>
    );
};

const header = (
    <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
        <h5 className="m-0">Manage Users</h5>
        <span className="block mt-2 md:mt-0 p-input-icon-left">
            <i className="pi pi-search" />
            <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
        </span>
    </div>
);

const userDialogFooter = (
    <>
        <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
        <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={saveUser} />
    </>
);


const deleteUser = () => {
    setLoading(true); 
   UserService.deleteAdminUser(session.jwt,user.userId)
   .then(data => {    
            let _users = users.filter((val) => val.userId !== user.userId);
            setUsers(_users);
            setDeleteUserDialog(false);
            setUser(emptyUser);
            setLoading(false);
            toast.current.show({ severity: t('common:success'), summary: t('common:summarySuccessful'), detail: t('user:user_deleted'), life: process.env.MESSAGE_TIMEOUT });
    })
    .catch((error)=>{               
        if (error.response) {
          setLoading(false);
          toast.current.show({ severity: t('common:error'), summary: t('common:summaryError'), detail: error.response.data.apierror.message, life: process.env.MESSAGE_TIMEOUT });
        }             
    });
   

};

const hideDeleteUserDialog = () => {
    setDeleteUserDialog(false);
};

const deleteSelectedUsers = () => {
    console.log(selectedUsers) ;
    let _users = users.filter((val) => !selectedUsers.includes(val));
     setUsers(_users);

    // toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Items Deleted', life: 3000 });
 };

return (

            <ListLayout 
            openNew={openNew}             
            dataset={dt} 
            selectedItems={selectedUsers} 
            items={users} 
            item={user} 
            setItems={setUsers} 
            setSelectedItems={setSelectedUsers}
            loading={loading}
            onDeleteItems={deleteSelectedUsers}
            >
                
                <Toast ref={toast} />
                <DataTable
                    ref={dt}
                    value={users}
                    selection={selectedUsers}
                    onSelectionChange={(e) => setSelectedUsers(e.value)}
                    dataKey= {UserField.id}
                    paginator
                    rows={25}
                    rowsPerPageOptions={[10, 25, 50]}
                    className="datatable-responsive"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} users"
                    globalFilter={globalFilter}
                    emptyMessage="No users found."
                    header={header}
                    responsiveLayout="scroll"
                    >
                    <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
                    <Column field={UserField.id} header={t('user:id')} sortable body={codeBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                    <Column field={UserField.name} header={t('user:name')} sortable body={nameBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                    <Column field={UserField.role} header={t('user:role')} sortable body={roleBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                    <Column field={UserField.email} header={t('user:email')} sortable body={emailBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                    <Column field={UserField.mobile} header={t('user:mobile')} sortable body={mobileBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                    <Column field={UserField.state} header={t('user:state')} body={statusBodyTemplate} sortable headerStyle={{ minWidth: '10rem' }}></Column>
                    <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                </DataTable>

                <Dialog visible={userDialog} style={{ width: '450px' }} header="User Details" modal className="p-fluid" footer={userDialogFooter} onHide={hideDialog}>
                    {user.image && <img src={`${contextPath}/demo/images/user/${user.image}`} alt={user.image} width="150" className="mt-0 mx-auto mb-5 block shadow-2" />}
                    <div className="field">
                        <label htmlFor="name">{t('user:name')}</label>
                        <InputText id="name" value={user.name} onChange={(e) => onInputChange(e, 'name')} required autoFocus className={classNames({ 'p-invalid': submitted && !user.name })} />
                        {submitted && !user.name && <small className="p-invalid">{t('user:name_required')}</small>}
                    </div>
                    <div className="field">
                        <label htmlFor="email">{t('user:email')}</label>
                        <InputText id="email" value={user.email} onChange={(e) => onInputChange(e, 'email')} required  className={classNames({ 'p-invalid': submitted && !user.email })} />
                        {submitted && !user.email && <small className="p-invalid">{t('user:email_required')}</small>}
                    </div>
                    <div className="field">
                        <label htmlFor="mobile">{t('user:mobile')}</label>
                        <InputText id="mobile" value={user.mobile} onChange={(e) => onInputChange(e, 'mobile')} required  className={classNames({ 'p-invalid': submitted && !user.mobile })} />
                        {submitted && !user.mobile && <small className="p-invalid">{t('user:mobile_required')}</small>}
                    </div>

                    <div className="field">
                        <label className="mb-3">{t('user:roles')}</label>
                        <div className="formgrid grid">

                            {roles && roles.map((role) => (                                 
                                <div className="field-radiobutton col-6">
                                    <RadioButton inputId = {`role${role.roleId}`} name="role" value={role.roleId} onChange={onChangeRole} 
                                     checked={user.role.roleId === role.roleId}/>
                                    <label htmlFor= {`role${role.roleId}`}>{role.name}</label>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="field">
                        <label htmlFor="state">{t('user:state')}</label>
                        <div className="formgrid grid">
                            <InputSwitch id="state" checked={user.cstate} onChange={(e) => onStateChange(e, 'state')}  />
                        </div> 
                    </div>

                    <div className="formgrid grid">
                        <div className="field col">
                            <label htmlFor="password">{t('user:password')}</label>
                            <Password id="password" onChange={(e) => onInputChange(e, 'password')} className={classNames({ 'p-invalid': submitted && !user.password })} />
                            {submitted && !user.password && <small className="p-invalid">Password is required.</small>}
                        </div>
                        <div className="field col">
                            <label htmlFor="repassword">{t('user:re-password')}</label>
                            <Password id="repassword" onChange={(e) => onInputChange(e, 'repassword')} className={classNames({ 'p-invalid': submitted && !user.password })} />
                            {submitted && !user.password && <small className="p-invalid">Password is required.</small>}
                        </div>
                    </div>
                </Dialog>

                <DeleteDialog
                    visible={deleteUserDialog}
                    onHide={hideDeleteUserDialog}
                    onDelete={deleteUser}
                    inputValue = {user.name}
                    />
                          
            </ListLayout>
            
        );
   
}

export default Users;

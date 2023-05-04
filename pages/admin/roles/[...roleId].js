
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import { InputSwitch } from 'primereact/inputswitch';
import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { getSession, useSession } from "next-auth/react"; 
import { useTranslation } from 'next-i18next';
import PermissionField from '../../../Keys/PermissionField';
import  RoleService  from '../../../services/RoleService';
import { classNames } from 'primereact/utils';
import { Toast } from 'primereact/toast';
import  PermissionService  from '../../../services/PermissionService';
 

function AddEditRole( ) {

    
    let emptyPermission={
        roleId : 0
     } 
     let emptyRole = {
        roleId: null,
        name: '',
        cstate: false,
        state: 0,
        description:'',
        permissions:[],
        setPermissions: function(perms) {
            this.permissions = perms;
        }
    };
    
    const router = useRouter();
    const toast = useRef(null);
    const { t } = useTranslation();
    const { data: session } = useSession();
    const [permissions, setPermissions] = useState(null);
    const [selectedPermissions, setSelectedPermissions] = useState([]);
    const [permissionIds, setPermissionIds] = useState([]);
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(true);
    const [role, setRole] = useState(emptyRole);

    const filterData = router.query.roleId;
    const action = filterData[0];
    const roleId = filterData[1];

  
   
    useEffect(() => {
    
        getSession().then((session) => {
            

            if(roleId){

                PermissionService.getAdminPermissions(session.jwt)
                .then(data => {
                    //setPermissions(data);
                    const updatedPermissions = data.map(permission => ({
                        ...permission,
                        checked: false
                    })) ;
                    
                    


                    RoleService.getAdminRole(session.jwt,roleId)
                    .then(data => {
                    
                        role.roleId = data.roleId;
                        role.name = data.name;
                        role.state = data.state;
                        role.description = data.description;
                        role.setPermissions(data.permissions); 

                        let _val = data.state ==1 ? true : false;
                        role.cstate = _val;

                        setSelectedPermissions(data.permissions); 

                         
                        for (let i = 0; i < updatedPermissions.length; i++) {
                            for (let j = 0; j < data.permissions.length; j++) {
                            if (updatedPermissions[i].permissionId === data.permissions[j].permissionId) {
                                updatedPermissions[i].checked = true;
                                break;
                            }
                            }
                        }
                        const sortedPermissions = [...updatedPermissions].sort((a, b) => a.permissionId - b.permissionId);
                        setPermissions(sortedPermissions);    
                        
                    })
                    .catch((error)=>{               
                        if (error.response) {
                        toast.current.show({ severity: t('common:error'), summary: t('common:summaryError'), detail: error.response.data.apierror.message, life: process.env.MESSAGE_TIMEOUT  });
                        }             
                    });    

                        
                    })
                    .catch((error)=>{               
                        if (error.response) {
                        toast.current.show({ severity: t('common:error'), summary: t('common:summaryError'), detail: error.response.data.apierror.message, life: process.env.MESSAGE_TIMEOUT });
                        }             
                    });  

                
            }  
            
            else{

                PermissionService.getAdminPermissions(session.jwt)
                .then(data => {
                    //setPermissions(data);
                    const updatedPermissions = data.map(permission => ({
                        ...permission,
                        checked: false
                    })) ;
                    
                    setPermissions(updatedPermissions);
                    
                })
                .catch((error)=>{               
                    if (error.response) {
                      toast.current.show({ severity: t('common:error'), summary: t('common:summaryError'), detail: error.response.data.apierror.message, life: process.env.MESSAGE_TIMEOUT });
                    }             
                });     


            }
            
            setLoading(false);        
          });      



    }, []);
    


const handleCheckboxChange = (event) => {
    const permissionId = parseInt(event.target.value);
    const isChecked = event.target.checked;

    if (isChecked) {
      const permissionToUpdate = permissions.find(p => p.permissionId === permissionId);
      permissionToUpdate.checked = true;
      setSelectedPermissions([...selectedPermissions, permissionToUpdate]);
      
      permissions = [...permissions.filter(permission => permission.permissionId !== permissionToUpdate.permissionId), permissionToUpdate]
      const sortedPermissions = [...permissions].sort((a, b) => a.permissionId - b.permissionId);
      setPermissions(sortedPermissions);

    } else {
      const updatedPermissions = selectedPermissions.filter(p => p.permissionId !== permissionId);
      setSelectedPermissions(updatedPermissions);

      const permissionToUpdate = permissions.find(p => p.permissionId === permissionId);
      permissionToUpdate.checked = false;
      permissions = [...permissions.filter(permission => permission.permissionId !== permissionToUpdate.permissionId), permissionToUpdate]
      const sortedPermissions = [...permissions].sort((a, b) => a.permissionId - b.permissionId);
      setPermissions(sortedPermissions);
    }

     

};

const handleSubmit = (event) => {
    event.preventDefault();

    
    role.setPermissions(selectedPermissions);
    
    setLoading(true);
    console.log(role);
    if(roleId){
        RoleService.updateAdminRole(session.jwt,role)
        .then((newRole)=>{
            setLoading(false);
            toast.current.show({ severity: t('common:success'), summary: t('common:summarySuccessful'), detail: t('role:role_created'), life: process.env.MESSAGE_TIMEOUT });
            router.push(`/${process.env.ADMIN}/roles`); 
        }
        )
        .catch((error)=>{               
            if (error.response) {
            setLoading(false);
            toast.current.show({ severity: t('common:error'), summary: t('common:summaryError'), detail: error.response.data.apierror.message, life: process.env.MESSAGE_TIMEOUT });
            }             
        });
    }else{
        RoleService.saveAdminRole(session.jwt,role)
        .then((newRole)=>{
            setLoading(false);
            toast.current.show({ severity: t('common:success'), summary: t('common:summarySuccessful'), detail: t('role:role_created'), life: process.env.MESSAGE_TIMEOUT });
            router.push(`/${process.env.ADMIN}/roles`); 
        }
        )
        .catch((error)=>{               
            if (error.response) {
            setLoading(false);
            toast.current.show({ severity: t('common:error'), summary: t('common:summaryError'), detail: error.response.data.apierror.message, life: process.env.MESSAGE_TIMEOUT });
            }             
        });
    }
    
 };  

const onInputChange = (e, name) => {
    const val = (e.target && e.target.value) || '';
    let _role = { ...role };
    _role[`${name}`] = val;
    setRole(_role);
};

const onStateChange = (e, name) => {
    const val = (e.target && e.target.value) || false;
    let _val = val ? 1 : 0;
    let _role = { ...role };
    _role[`${name}`] = _val;
    _role['cstate'] = val;
    setRole(_role);
};



const cancel =()=>{
    router.push(`/${process.env.ADMIN}/roles`);
} 

    return(
        <form onSubmit={handleSubmit}>
            <div className="grid">
                <Toast ref={toast} />
                <div className="col-12">
                    <div className="card">
                        <h5>New Role</h5>
                        <div className="p-fluid formgrid grid">
                            <div className="field col-12 md:col-6">
                                <label htmlFor="name">{t('role:name')}</label>
                                <InputText id="name" type="text"  value={role.name} onChange={(e) => onInputChange(e, 'name')} required autoFocus className={classNames({ 'p-invalid': submitted && !role.name })} />
                                {submitted && !role.name && <small className="p-invalid">{t('role:name_required')}</small>}
                            </div>
                            <div className="field col-12 md:col-6">
                                <label htmlFor="description">{t('role:description')}</label>
                                <InputText id="description" type="text" value={role.description} onChange={(e) => onInputChange(e, 'description')} className={classNames({ 'p-invalid': submitted && !role.description })} />
                                {submitted && !role.description && <small className="p-invalid">{t('role:description_required')}</small>}
                            </div>
                        </div>

                        <h5>Permissions</h5>
                        <div className="grid">
                        {console.log(permissions)}
                        {permissions && permissions.map(permission => (
                            <div className="col-2 md:col-2">
                                <div className="field-checkbox">
                                    <label>
                                        <input type="checkbox" name="permission" value={permission.permissionId} onChange={handleCheckboxChange}
                                            checked={permission.checked}
                                        />
                                        {permission.name}
                                    </label>
                                </div>
                            </div>
                        ))}

                        </div>

                        <h5>Active</h5>
                        <InputSwitch checked={role.cstate} onChange={(e) => onStateChange(e, 'state')} />
                    

                        <div className="col-12">
                            <div className="my-2">
                                <Button label="Save" type='submit' icon="pi pi-check" className="p-button-success mr-2"  />
                                <Button label="Cancel" type='button' icon="pi pi-times" onClick={()=>cancel()} className="p-button-danger"  />
                            </div>
                        </div>
                    </div>
                </div>
                
            </div>   
        </form> 
    );
}
export default AddEditRole;
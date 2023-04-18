import getConfig from 'next/config';
import { useRouter } from 'next/router';
import React, { useContext, useState } from 'react';
import AppConfig from '../../../../components/admin/layout/AppConfig';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { LayoutContext } from '../../../../components/admin/layout/context/layoutcontext';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { useTranslation } from 'next-i18next';
import { signIn } from "next-auth/react";

import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

export async function getStaticProps({locale}){
    return {
        props:{
            ...(await serverSideTranslations(locale,['user'/*,'common'*/])),
        }
    }
}

const LoginPage = (props) => {
    const [password, setPassword] = useState('');
    const [checked, setChecked] = useState(false);
    const { layoutConfig } = useContext(LayoutContext);
    const contextPath = getConfig().publicRuntimeConfig.contextPath;
    const router = useRouter();
    const containerClassName = classNames('surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden', {'p-input-filled': layoutConfig.inputStyle === 'filled'});
    const { t } = useTranslation()


    const [state, setState] = useState({
        email: "",
        password: "",
      });
    
      function handleChange(e) {
        const copy = { ...state };
        copy[e.target.name] = e.target.value;
        setState(copy);
      }
    
      const handleSubmit = async (e) => {
        e.preventDefault();        
        const res = signIn("credentials", {
          redirect: false,
          email: state.email,
          password: state.password,
          callbackUrl: "",
        });

        if (!res.error) {
          router.push(`/${process.env.ADMIN}`);
        }
      };


    return (
        <div className={containerClassName}>
            <div className="flex flex-column align-items-center justify-content-center">
                
                <div style={{ borderRadius: '56px', padding: '0.3rem', background: 'linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)' }}>
                    <div className="w-full surface-card py-8 px-5 sm:px-8" style={{ borderRadius: '53px' }}>
                        <div className="text-center mb-5">
                            
                            <div className="text-900 text-3xl font-medium mb-3">{t('user:welcome')}</div>
                            
                        </div>

                        <div>
                            <label htmlFor="email1" className="block text-900 text-xl font-medium mb-2">
                                Email
                            </label>
                            <InputText inputid="email1" type="text"
                            value={state.email}
                            onChange={handleChange}
                            name="email"
                             placeholder="Email address" className="w-full md:w-30rem mb-5" style={{ padding: '1rem' }} />

                            <label htmlFor="password1" className="block text-900 font-medium text-xl mb-2">
                                Password
                            </label>
                            <Password inputid="password1" 
                            value={state.password}
                            onChange={handleChange}
                            name="password"
                            placeholder="Password" toggleMask className="w-full mb-5" inputClassName='w-full p-3 md:w-30rem'></Password>

                            <div className="flex align-items-center justify-content-between mb-5 gap-5">
                                 
                            </div>
                            <Button label="Sign In" className="w-full p-3 text-xl" onClick={handleSubmit}></Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

LoginPage.getLayout = function getLayout(page) {
    return (
        <React.Fragment>
            {page}
            <AppConfig simple />
        </React.Fragment>
    );
};
export default LoginPage;

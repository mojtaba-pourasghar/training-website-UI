import React from 'react';
import { LayoutProvider } from '../components/admin/layout/context/layoutcontext';
import Layout from '../components/admin/layout/layout';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import '../styles/admin/layout/layout.scss';
import '../styles/admin/demo/Demos.scss';
import { useRouter } from 'next/router';
import UserLayout from '../components/user-layout';
import AuthLayout from '../components/admin/layout/auth-layout';
import { SessionProvider } from "next-auth/react";
import { appWithTranslation } from 'next-i18next';
function MyApp({ Component, pageProps }) {

    const { asPath, pathname } = useRouter();
  //console.log(asPath); // '/blog/xyz'
  //console.log(pathname);

  const pos = asPath.indexOf(process.env.ADMIN);

  if (pos !== -1) {
 
    if (Component.getLayout) {
    
        return (
            <LayoutProvider>
                <AuthLayout>
                    {Component.getLayout(<Component {...pageProps} />)}
                </AuthLayout>
            </LayoutProvider>
        )
    } else {
       
        return (
            <LayoutProvider>
                <SessionProvider session={pageProps.session}>
                    <Layout>
                        <Component {...pageProps} />
                    </Layout>
                </SessionProvider>
            </LayoutProvider>
        );
    }
  } else {
    return(<UserLayout>
        <Component {...pageProps} />
    </UserLayout>)
  }
   
}

export default appWithTranslation(MyApp)

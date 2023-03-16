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

export default function MyApp({ Component, pageProps }) {

    const { asPath, pathname } = useRouter();
  //console.log(asPath); // '/blog/xyz'
  //console.log(pathname);

  const pos = asPath.indexOf(process.env.ADMIN);

  if (pos !== -1) {
    if (Component.getLayout) {
        return (
            <LayoutProvider>
                {Component.getLayout(<Component {...pageProps} />)}
            </LayoutProvider>
        )
    } else {
        return (
            <LayoutProvider>
                <Layout>
                    <Component {...pageProps} />
                </Layout>
            </LayoutProvider>
        );
    }
  } else {
    return(<UserLayout>
        <Component {...pageProps} />
    </UserLayout>)
  }

    
}

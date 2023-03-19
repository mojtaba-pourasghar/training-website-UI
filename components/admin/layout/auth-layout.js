import getConfig from 'next/config';
import React, { useContext, useEffect, useRef } from 'react';
import Head from 'next/head';
function AuthLayout(probs){
    const contextPath = getConfig().publicRuntimeConfig.contextPath;
    return( 
        <React.Fragment>
            <Head>
            <link id="theme-css" href={`${contextPath}/admin/themes/lara-light-indigo/theme.css`} rel="stylesheet"></link>
            </Head>
            <body>
            {probs.children}
            </body>
        </React.Fragment>
    );
    

}

export default AuthLayout;
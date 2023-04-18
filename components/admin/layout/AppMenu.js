import getConfig from 'next/config';
import React, { useContext } from 'react';
import AppMenuitem from './AppMenuitem';
import { LayoutContext } from './context/layoutcontext';
import { MenuProvider } from './context/menucontext';
import Link from 'next/link';

const AppMenu = () => {
    const { layoutConfig } = useContext(LayoutContext);
    const contextPath = getConfig().publicRuntimeConfig.contextPath;
    const model = [
        {
            label: 'Home',
            items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/' }]
        },    
        {
            label: 'User Managment',
            items: [
                {
                    label: 'Users',
                    icon: 'pi pi-fw pi-user',
                    items: [
                        {
                            label: 'Roles',
                            icon: 'pi pi-fw pi-bookmark',
                            to: `/${process.env.ADMIN}/roles`
                        },
                        {
                            label: 'Users',
                            icon: 'pi pi-fw pi-user',
                            to: `/${process.env.ADMIN}/users`
                        }
                    ]
                } 
            ]
        } 
    ];

    return (
        <MenuProvider>
            <ul className="layout-menu">
                {model.map((item, i) => {
                    return !item.seperator ? <AppMenuitem item={item} root={true} index={i} key={item.label} /> : <li className="menu-separator"></li>;
                })}

                 
            </ul>
        </MenuProvider>
    );
};

export default AppMenu;

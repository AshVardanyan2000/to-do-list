import React, {FC, useEffect} from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Navigate from './Navigate/Navigate';
import classes from './layout.module.scss'
import Header from "../Header/Header";


const Layout:FC =()=> {
    const navigate = useNavigate();
    const { pathname } = useLocation();

    useEffect(() => {
        if (pathname !== '/404' && pathname === '/') {
            navigate('/all_task')
        }
    }, []);

    return (
        <div className={classes.layout}>
            <div className={classes.menu_wrapper}>
                <Navigate />

                <div/>
            </div>

            <main className={classes.layout_main}>
                {pathname !== '/404' && <Header/>}

                <Outlet />
            </main>
        </div>
    );
}

export default Layout;
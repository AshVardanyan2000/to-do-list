import React, {FC} from 'react';
import {ReactComponent as AllTaskIcon} from "../../../assets/icons/all_task.svg";
import {ReactComponent as ImportantIcon} from "../../../assets/icons/important.svg";
import {ReactComponent as DoneIcon} from "../../../assets/icons/done.svg";
import classes from '../layout.module.scss';
import { NavLink } from 'react-router-dom';

export interface IMenu {
    icon: React.ReactNode;
    path: string;
    name: string;
    requestPath: string;
}


export const menu:IMenu[]=[
    {
        icon:<AllTaskIcon />,
        path:'/all_task',
        name:'All tasks',
        requestPath:'all'
    },
    {
        icon:<ImportantIcon />,
        path:'/important',
        name:'Important',
        requestPath:'important'
    },
    {
        icon:<DoneIcon />,
        path:'/done',
        name:'Done',
        requestPath:'done'
    },
]

const Navigate:FC =()=> {

    return (
        <aside className={classes.navigate_wrapper}>
            <nav>
                <ul className={classes.nav_block}>
                    {menu.map((m) => (
                        <li key={m.path}>
                            <NavLink
                                to={m.path}
                                className={({ isActive }) => (isActive ? classes.active : '')}
                            >
                                {m.icon}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
            );
}

export default Navigate;
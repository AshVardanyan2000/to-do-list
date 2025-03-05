import React, {FC} from 'react';
import NotFoundImg from '../../assets/images/not_found.png'
import classes from './not_fount.module.scss'

const NotFound:FC = () => (
    <div className={classes.wrapper}>
        <img src={NotFoundImg} alt="Not Found" />
        <h1>Page not found</h1>
    </div>
);

export default NotFound;
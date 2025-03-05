import React, { FC } from 'react';
import classes from './styles.module.scss';

interface ILoader {
  size?: number;
  color?: string;
  className?: string ;
  borderWidth?: number;
}

const Loader: FC<ILoader> = ({
  size = 40, color = '#08416A', className = '', borderWidth = 3,
}) => (
  <div className={`${classes.loader_wrapper} ${className}`}>
    <span style={{
      width: size,
      height: size,
      borderColor: color,
      borderWidth,
    }}
    />
  </div>
);

export default Loader;

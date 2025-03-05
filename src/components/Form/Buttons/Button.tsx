import React, {ElementType, FC, JSX} from 'react';
import {NavLink} from 'react-router-dom';
import classes from './styles.module.scss';
import Loader from '../../Loader/Loader';

interface IButton {
    title: string | JSX.Element,
    type?: 'button' | 'submit',
    className?: string,
    btnClassName?: string,
    loading?: boolean,
    disabled?: boolean,
    cancelButton?: boolean,
    deleteButton?: boolean,
    reverseColor?: boolean,
    onClick?: () => void,
    buttonColor?: string,
    href?: string,
    buttonTextColor?: string,
    ref?: React.Ref<HTMLButtonElement>,
}

const Button: FC<IButton> = ({
                                 title = '', onClick = () => {
    }, className = '', btnClassName = '', buttonTextColor = '#FFFFFF',
                                 loading = false, disabled = false, type = 'button', cancelButton = false,
                                 deleteButton = false, buttonColor = '#08416A', reverseColor = false, href = '', ref
                             }) => {
    const btnWrapperCls = [classes.btn_wrapper, className];
    const btnCls = [classes.btn, btnClassName];

    if (cancelButton) btnCls.push(classes.cancel_button);
    if (deleteButton) btnCls.push(classes.delete_button);
    if (reverseColor) btnCls.push(classes.reverse_color);
    if (disabled) btnWrapperCls.push(classes.disabled);

    const Component = href ? (NavLink as ElementType) : 'button';

    const labelStyles: Record<string, string> = {
        '--button-color': `${buttonColor}`,
        '--button-test-color': `${buttonTextColor}`,
    };

    return (
        <div className={btnWrapperCls.join(' ')}>
            <Component
                type={type}
                to={href}
                ref={ref}
                onClick={onClick}
                className={btnCls.join(' ')}
                disabled={loading || disabled}
                style={labelStyles}
            >
        <span className={classes.title_wrapper}>
          {loading
              ? (
                  <Loader
                      className={classes.btn_loading}
                      size={24}
                      color="#fff"
                  />
              )
              : (
                  <span>
                {title}
              </span>
              )}
        </span>
            </Component>
        </div>
    );
};

export default Button;

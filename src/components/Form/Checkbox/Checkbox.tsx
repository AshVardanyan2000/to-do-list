import React, { FC, useId } from 'react';
import classes from './checkbox.module.scss';

interface ICheckbox {
  checked?: boolean,
  label?: string,
  onChange: (value: boolean) => void,
  disabled?: boolean ;
  className?: string ;
  labelMarginLeft?: number;
}

const Checkbox: FC <ICheckbox> = ({
  checked = false, label = '', onChange,
  disabled = false, className = '', labelMarginLeft = 5,
}) => {
  const uniqId = useId();

  return (
    <div className={`${classes.checkbox_wrapper} ${className}`}>
      <input
        id={`checkbox_id_${uniqId}`}
        type="checkbox"
        className={classes.checkbox_input}
        checked={checked}
        onChange={({ target }) => onChange(target.checked)}
        disabled={disabled}
      />

      <label className={classes.checkbox_label} htmlFor={`checkbox_id_${uniqId}`}>
        <span className={classes.checkbox_box} />

        {label && <span style={{ marginLeft: labelMarginLeft }} className={classes.checkbox_text}>{label}</span>}
      </label>
    </div>
  );
};

export default Checkbox;

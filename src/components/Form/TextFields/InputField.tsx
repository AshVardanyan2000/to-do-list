import React, { FC, useEffect, useRef } from 'react';
import classes from './styles.module.scss';
import {ReactComponent as ClearIcon} from "../../../assets/icons/close.svg";
import {ReactComponent as SearchIcon} from "../../../assets/icons/search.svg";


interface IInputField {
  value: string | number;
  wrapperClassName?: string,
  label?: string,
  placeholder?: string,
  height?: number,
  clearValue?: boolean,
  textareaField?: boolean,
  search?: boolean,
  disabled?: boolean,
  labelDefaultPosition?: number,
  onChange: (value: string) => void,
  type?: string,
  error?: any,
  labelBG?: string,
  clearDefaultValue?: string,
  errorClassName?: string,
  rest?: any;
  onFocus?: () => void;
}

const InputField: FC<IInputField> = ({
  value = '', onChange = () => {}, label = '', wrapperClassName = '', height = 40,
  labelDefaultPosition = 12, clearValue = false, search = false, type = 'text',
  placeholder = '', rest = '', textareaField = false, labelBG = '#FFFFFF', disabled = false,
  error = '', errorClassName = '',
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaField ) {
      textareaRef?.current?.setSelectionRange(value.toString().length, value.toString().length);
    }
  }, []);

  const wrapperCls = [classes.text_field_wrapper, wrapperClassName];
  if (textareaField) wrapperCls.push(classes.textarea_field);

  if (error) wrapperCls.push(classes.error);

  const inputCls = [];
  if (value?.toString() || placeholder) inputCls.push(classes.with_value);
  if (clearValue) inputCls.push(classes.with_clear_btn);
  if (search) inputCls.push(classes.with_search_icon);

  const labelStyles: Record<string, string | number> = {
    '--default-position': `${labelDefaultPosition}px`,
    '--label-bg': `${labelBG}`,
  };

  return (
    <div style={{ height }} className={wrapperCls.join(' ')}>
      {textareaField
        ? (
          <>
            <textarea
              className={inputCls.join(' ')}
              value={value}
              ref={textareaRef}
              placeholder={placeholder}
              onChange={({ target }) => onChange(target.value)}
              disabled={disabled}
            />

            <div className={classes.border} />
          </>
        )

        : (
          <input
            className={inputCls.join(' ')}
            value={value}
            placeholder={placeholder}
            autoComplete={'off'}
            type={type}
            disabled={disabled}
            onChange={({ target }) => onChange(target.value)}
            {...rest}
          />
        )}

      {label
        && (
        <label
          style={labelStyles}
        >
          {label}
        </label>
        )}

        {search && value && <ClearIcon className={classes.clear_svg} onClick={()=>onChange('')}/>}

        {search && !value && (<SearchIcon className={classes.search_svg}/>)}


      {!!error && typeof error === 'string' && <p className={`${classes.error_text} ${errorClassName}`}>{error}</p>}
    </div>
  );
};

export default InputField;

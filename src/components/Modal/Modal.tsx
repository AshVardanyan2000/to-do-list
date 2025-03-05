import React, {
  FC, ReactNode, useEffect, useState,
} from 'react';
import { createPortal } from 'react-dom';
import classes from './style.module.scss';
import { ReactComponent as ClearSvg } from '../../assets/icons/close.svg';

interface ModalProps {
  children: ReactNode ;
  open: boolean,
  onClose: () => void,
  className?: string,
  zIndex?: number,
}

const Modal: FC<ModalProps> = ({
  open = false, onClose = () => {}, children, className = '', zIndex = 30,
}) => {
  const [showModal, modalShowToggle] = useState<boolean>(false);

  useEffect(() => {
    setTimeout(() => modalShowToggle(open));

    if (open) {
      document.body.style.width = `${document.body.getBoundingClientRect().width}px`;
      document.body.style.overflowY = 'hidden';
      document.body.ontouchmove = () => false;
    } else {
      document.body.style.removeProperty('overflow');
      document.body.style.removeProperty('width');
      document.body.ontouchmove = () => true;
    }
  }, [open]);

  const modalCls = [classes.modal_wrapper, className];

  if (showModal) modalCls.push(classes.show_modal);

  return (
    <>
      { open && createPortal(
        <div
          id="modal"
          className={classes.modal_container}
          style={{ zIndex }}
        >
          <div
            className={classes.backdrop}
            onClick={onClose}
          />

          <div className={modalCls.join(' ')}>
            {onClose && (
            <ClearSvg
              className={classes.close}
              onClick={onClose}
            />
            )}

            {children}
          </div>
        </div>,
        document.getElementById('root') || document.body,
      )}
    </>
  );
};

export default Modal;

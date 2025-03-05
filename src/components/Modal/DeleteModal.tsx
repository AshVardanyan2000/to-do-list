import React, {FC} from 'react';
import Modal from './Modal';
import Button from '../Form/Buttons/Button';
import classes from './style.module.scss';
import {ReactComponent as DeleteIcon} from "../../assets/icons/delete_modal.svg";

interface IDeleteModal {
    open: boolean,
    close: () => void,
    onClick: () => void;
    text: string;
}

const DeleteModal: FC<IDeleteModal> = ({open, close, onClick,text}:IDeleteModal) => (
    <Modal
        className={classes.deleteModal}
        open={open}
        onClose={close}
    >
        <div>
            <DeleteIcon/>

            <h2>Delete task</h2>

            <p>{text}</p>

            <div className={classes.btns_wrapper}>
                <Button
                    title="Cancel"
                    onClick={close}
                    className={classes.btn}
                    cancelButton
                />

                <Button
                    title="Delete"
                    deleteButton
                    onClick={onClick}
                    className={classes.btn}
                />
            </div>
        </div>
    </Modal>
);

export default DeleteModal;

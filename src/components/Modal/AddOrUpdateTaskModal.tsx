import React, {FC} from 'react';
import Modal from "./Modal";
import InputField from "../Form/TextFields/InputField";
import Button from "../Form/Buttons/Button";
import classes from "./style.module.scss";

interface IAddOrUpdateTaskModal {
    open: boolean,
    onClose: () => void,
    data: {
        title: string,
        descriptions: string,
        id?: number
    },
    changeInput: (path: string, value: string) => void,
    onSaveClick: () => void,
    errors:{title: string, descriptions: string,}
}

const AddOrUpdateTaskModal: FC<IAddOrUpdateTaskModal> = (
    {errors={title: '', descriptions: ''},
        open = false, onClose = () => {
    }, data = {title: '', descriptions: ''},
        changeInput = (path: string, value: string) => {
        }, onSaveClick = () => {
    }
    }
) => {
    const {title, descriptions} = data;

    return (
        <Modal open={open} onClose={onClose} className={classes.add_or_update_wrapper}>
            <InputField
                value={title}
                onChange={(value) => changeInput('title', value)}
                label='Title'
                placeholder='Title'
                error={errors.title}
                height={50}
            />

            <InputField
                value={descriptions}
                onChange={(value) => changeInput('descriptions', value)}
                textareaField
                label='Descriptions'
                placeholder='Description'
                wrapperClassName={classes.input}
                error={errors.descriptions}
            />

            <div className={classes.buttons_wrapper}>
                <Button title='Cancle' onClick={onClose} cancelButton className={classes.button}/>

                <Button title='Save' onClick={onSaveClick}/>
            </div>
        </Modal>
    )
};

export default AddOrUpdateTaskModal;
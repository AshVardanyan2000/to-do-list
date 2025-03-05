import React, {FC, useEffect, useRef, useState} from 'react';
import classes from './header.module.scss';
import {IMenu, menu} from "../Layout/Navigate/Navigate";
import {useLocation} from "react-router-dom";
import Button from "../Form/Buttons/Button";
import InputField from "../Form/TextFields/InputField";
import Checkbox from "../Form/Checkbox/Checkbox";
import {ReactComponent as AddIcon} from "../../assets/icons/add.svg";
import {ReactComponent as DoneModalIcon} from "../../assets/icons/done_modal.svg";
import {ReactComponent as UnDoneIcon} from "../../assets/icons/un_done.svg";
import {ReactComponent as DeleteIcon} from "../../assets/icons/delete.svg";
import {ReactComponent as ImportantIcon} from "../../assets/icons/important.svg";
import AddOrUpdateTaskModal from "../Modal/AddOrUpdateTaskModal";
import _ from "lodash";
import {useQuery} from '../Hooks/useQuery';

import {useDispatch, useSelector} from "react-redux";
import {
    addTaskRequest,
    bulkUpdateTasksType, deleteTaskRequest,
    getTaskRequest, loadingAction,
    selectAllTasks,
} from "../../store/action/tasks";
import {RootState} from "../../store";
import {ITaskList} from "../Services/Services";
import {IActionItem} from "../../pages/AllTasks/ListItem";
import DeleteModal from "../Modal/DeleteModal";
import {useClickAway} from "react-use";

export interface IAddTask {
    title: string;
    descriptions: string;
}

const actionModalItems: IActionItem[] = [
    {
        icon: <ImportantIcon/>,
        name: 'Important',
        path: 'important',
        hoverColor:'#FFFAED'
    },

    {
        icon: <DoneModalIcon/>,
        name: 'Done',
        path: 'done',
        hoverColor:'#F0FFEE'
    },
    {
        icon: <UnDoneIcon/>,
        name: 'Undone',
        path: 'undone',
        hoverColor:'#FFE3E3'
    },
    {
        icon: <DeleteIcon/>,
        name: 'Delete',
        path: 'delete',
        hoverColor:'#FFEFEF'
    },
]


const Header: FC = () => {
    const {pathname} = useLocation();
    const timeOutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const buttonRef = useRef<HTMLDivElement | null>(null);

    const dispatch = useDispatch();
    const selectedIds: number[] = useSelector((store: RootState) => store.tasks.selectedIds)
    const taskList: ITaskList[] = useSelector((store: RootState) => store.tasks.taskList)
    const {query, setQuery} = useQuery();

    const [menuItem, setMenuItem] = useState<IMenu>();
    const [searchValue, setSearchValue] = useState<string>(query.s || '');
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [addTask, setAddTask] = useState<IAddTask>({title: '', descriptions: ''});
    const [errors, setErrors] = useState<IAddTask>({title: '', descriptions: ''});
    const [openActionModal, setOpenActionModal] = useState<boolean>(false);
    const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);


    useEffect(() => {
        const menuItem = menu.find((m: IMenu) => m.path === pathname)

        setMenuItem(menuItem)

        setQuery({s: query.s})

        dispatch(getTaskRequest({path: pathname.replace(/^\/+/, "") || '', s: query.s}))

        return () => {
            setSearchValue('')
        }
    }, [pathname]);

    useClickAway(buttonRef, () => {
        setOpenActionModal(false)
    });

    const onCloseModal: () => void = () => {
        setOpenModal(false)
        setAddTask({title: '', descriptions: ''});
        setErrors({title: '', descriptions: ''});
    }

    const changeInputs: (path: string, value: string) => void = (path: string, value: string) => {
        setErrors((prev) => ({...prev, [path]: ''}))
        setAddTask(prev => ({...prev, [path]: value}))
    }

    const saveClick: () => void = () => {
        let hasErrors = false;

        _.forEach(addTask, (value: string, path: string) => {
            if (!value.trim()) {
                hasErrors = true;
                setErrors((prev) => ({...prev, [path]: 'This field is required'}))
            }
        })

        if (!hasErrors) {
            dispatch(addTaskRequest(addTask))

            onCloseModal()
        }
    }

    const changeSearchInput: (val: string) => void = (val: string) => {
        setQuery({s: val})
        setSearchValue(val)
        dispatch(loadingAction(true))

        if (timeOutRef.current !== null) {
            clearTimeout(timeOutRef.current);
        }

        timeOutRef.current = setTimeout(() => {
            dispatch(getTaskRequest({path: pathname.replace(/^\/+/, ""), s: val}))
        }, 400);

    }


    const actionClick: (e: React.MouseEvent<HTMLDivElement>, path: string) => void = (e: React.MouseEvent<HTMLDivElement>, path: string) => {
        e.stopPropagation();
        setOpenActionModal(false)

        if (path === 'delete') {
            setOpenDeleteModal(true);
        } else {
            dispatch(bulkUpdateTasksType({path: pathname.replace(/^\/+/, ""), type: path, ids: selectedIds}))

        }
    }

    const deleteTask: () => void = () => {
        dispatch(deleteTaskRequest({path: pathname.replace(/^\/+/, ""), ids: selectedIds}))
        setOpenDeleteModal(false)
    }

    return (
        <div className={classes.header_wrapper}>
            <div className={classes.header_title}>
                <div>{menuItem?.icon}</div>

                <p>{menuItem?.name}</p>
            </div>

            <div className={classes.header_main}>
                <div className={classes.header_checkbox_input_wrapper}>
                    <Checkbox
                        onChange={() => dispatch(selectAllTasks())}
                        label='All selected'
                        checked={selectedIds.length === taskList.length && taskList.length !== 0}
                        className={classes.header_checkbox}
                        disabled={taskList.length === 0}
                    />

                    <div className={classes.header_input}>
                        <InputField
                            value={searchValue}
                            onChange={(val: string) => changeSearchInput(val)}
                            placeholder={'Search for Title'}
                            search
                        />
                    </div>
                </div>


                <div className={classes.header_button_wrapper}>
                    <Button
                        title={<span className={classes.button_title}><AddIcon/> <span>Add a task</span></span>}
                        onClick={() => setOpenModal(true)}
                        className={classes.button}/>

                    {!!selectedIds.length &&
                        <div ref={buttonRef}>
                            <Button
                                title={'Bulk actions'}
                                onClick={() => setOpenActionModal(prev => !prev)}
                            />

                            {openActionModal && (
                                <div className={classes.action_modal_wrapper}>
                                    {actionModalItems.map((a: IActionItem) => (
                                        <div
                                            className={classes.action_modal_item}
                                            key={a.path}
                                            role='button'
                                            tabIndex={0}
                                            style={{'--button_hover_color': `${a.hoverColor}`}  as React.CSSProperties}
                                            onClick={(e: React.MouseEvent<HTMLDivElement>) => actionClick(e, a.path)}>
                                            {a.icon}

                                            <p>{a.name}</p>
                                        </div>
                                    ))}


                                </div>
                            )}
                        </div>}

                </div>
            </div>

            <AddOrUpdateTaskModal
                errors={errors}
                open={openModal}
                data={addTask}
                changeInput={changeInputs}
                onClose={onCloseModal}
                onSaveClick={saveClick}
            />

            <DeleteModal
                open={openDeleteModal}
                close={() => setOpenDeleteModal(false)}
                onClick={deleteTask}
                text={'Are you sure you want to delete this tasks?'}
            />
        </div>
    )
};

export default Header;
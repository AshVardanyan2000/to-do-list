import React, {FC} from 'react';
import notTaskImg from '../../assets/images/not_task.png';
import notImportantImg from '../../assets/images/not_important.png';
import notDoneImg from '../../assets/images/not_done.png';
import classes from "./all_tasks.module.scss";
import {useSelector} from "react-redux";
import {RootState} from "../../store";
import {useLocation} from "react-router-dom";
import {ITaskList} from "../../components/Services/Services";
import Loader from "../../components/Loader/Loader";
import ListItem from "./ListItem";

interface IImages {
    all_task: string,
    important: string,
    done: string
}

const notTaskImages: IImages = {
    all_task: notTaskImg,
    important: notImportantImg,
    done: notDoneImg
}

const AllTasks: FC = () => {
    const {pathname} = useLocation();
    const taskList: ITaskList[] = useSelector((store: RootState) => store.tasks.taskList)
    const loading: boolean = useSelector((store: RootState) => store.tasks.loading)


    return (
        loading
            ? <Loader/>
            : (<div className={classes.wrapper}>
                {!!taskList.length
                    ? (<div className={classes.task_wrapper}>
                        {taskList.map((task)=>(
                            <ListItem key={task.id} task={task} />
                        ))}
                    </div>)
                    : (<div className={classes.noData}>
                        <img src={notTaskImages[pathname.replace(/^\/+/, "") as keyof IImages]} alt="img"/>
                    </div>)
                }
            </div>)

    )
};


export default AllTasks;


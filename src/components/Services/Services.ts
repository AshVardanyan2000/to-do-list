import _ from "lodash";
import {IBulkUpdateTask, IDeleteTask, IGetTasks} from "../../store/action/tasks";

export interface ITask {
    title: string,
    descriptions: string,
}

export interface ITaskList extends ITask {
    id: number;
    type: string;
}

export type UpdateTask = ITaskList & IGetTasks

class services {
    static setTask(task: ITask) {
        const tasks: ITaskList[] | [] = JSON.parse(localStorage.getItem('taskList') || '[]');

        const newTasks: ITaskList[] = [...tasks, {
            ...task,
            id: _.last(tasks) as ITaskList ? (_.last(tasks) as ITaskList).id + 1 : 1,
            type: 'undone'
        }];

        localStorage.setItem('taskList', JSON.stringify(newTasks));

        return newTasks
    }

    static getTasks(filterTask: IGetTasks): ITaskList[] | [] {
        const tasks: ITaskList[] | [] = JSON.parse(localStorage.getItem('taskList') || '[]');

        if (filterTask.path === 'all_task' && !filterTask.s?.trim()) {
            return tasks;
        }

        if (filterTask.s?.trim()) {
            return tasks.filter((task: ITaskList) =>
                task.title.toLowerCase().includes(filterTask.s?.toLowerCase() || '')
                && (filterTask.path === 'all_task' ? true : task.type === filterTask.path)
            );
        }

        return tasks.filter((task: ITaskList) => task.type === filterTask.path);

    }

    static updateTask(task: UpdateTask) {
        const tasks: ITaskList[] | [] = JSON.parse(localStorage.getItem('taskList') || '[]');

        const updateTask: ITaskList[] = this.getTasks(task).map((t: ITaskList) => t.id === task.id ? task : t);

        localStorage.setItem('taskList', JSON.stringify(_.uniqBy([...updateTask, ...tasks], 'id')));

        return this.getTasks(task);
    }

    static bulkUpdateTaskType(task:IBulkUpdateTask) {
        const tasks: ITaskList[] | [] = JSON.parse(localStorage.getItem('taskList') || '[]');

        const updateTasks: ITaskList[] = this.getTasks(task).map((t: ITaskList) => task.ids.includes(t.id) ? {...t,type:task.type} : t);

        localStorage.setItem('taskList', JSON.stringify(_.uniqBy([...updateTasks, ...tasks], 'id')));

        return this.getTasks(task);
    }

    static deleteTask(task: IDeleteTask) {
        const tasks: ITaskList[] | [] = JSON.parse(localStorage.getItem('taskList') || '[]');

        const deletedTasks: ITaskList[] = this.getTasks(task).filter((t: ITaskList) => !task.ids.includes(t.id))

        localStorage.setItem('taskList', JSON.stringify(_.uniqBy([...deletedTasks, ...tasks.filter((t: ITaskList) => !task.ids.includes(t.id))], 'id')));

        return deletedTasks
    }
}

export default services;
import {createAction} from "@reduxjs/toolkit";
import {IAddTask} from "../../components/Header/Header";
import services, {UpdateTask} from "../../components/Services/Services";

export interface IGetTasks{
    path: string;
    s?:string
}

export interface IDeleteTask extends IGetTasks{
    ids:number[]
}

export interface IBulkUpdateTask extends IDeleteTask{
    type:string
}

export const addTaskRequest = createAction('add/task',(payload:IAddTask)=>{
    return {payload:services.setTask(payload)}
});

export const getTaskRequest = createAction('get/task',(payload:IGetTasks)=>{
    return{payload:services.getTasks(payload)}
});

export const updateTaskRequest = createAction('update/task',(payload:UpdateTask)=>{
    return {payload:services.updateTask(payload)}
});
export const bulkUpdateTasksType = createAction('bulk/update/task/type',(payload:IBulkUpdateTask)=>{
    return {payload:services.bulkUpdateTaskType(payload)}
});


export const deleteTaskRequest = createAction('delete/task',(payload:IDeleteTask)=>{
    return {payload:services.deleteTask(payload)}
});

export const selectTaskId = createAction<number>('select/task/id');

export const selectAllTasks = createAction('select/all/tasks');

export const loadingAction = createAction<boolean>('loading');
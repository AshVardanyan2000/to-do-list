import {createReducer, PayloadAction} from '@reduxjs/toolkit';
import {
    addTaskRequest, bulkUpdateTasksType,
    deleteTaskRequest,
    getTaskRequest, loadingAction,
    selectAllTasks,
    selectTaskId,
    updateTaskRequest
} from "../action/tasks";
import {ITaskList} from "../../components/Services/Services";


interface ITasksState {
    taskList: ITaskList[];
    loading: boolean;
    selectedIds: number[];
}

const initialState: ITasksState = {
    taskList: [],
    loading: true,
    selectedIds: []
};

const reducer = createReducer(initialState, (builder) => {
    builder
        .addCase(addTaskRequest, (state, action: PayloadAction<ITaskList[]>) => {
            state.taskList = action.payload.reverse();
        })

        .addCase(selectTaskId, (state, action: PayloadAction<number>) => {
            state.selectedIds = state.selectedIds.includes(action.payload)
                ? state.selectedIds.filter(s => s !== action.payload)
                : [...state.selectedIds, action.payload];
        })

        .addCase(selectAllTasks, (state, action: PayloadAction) => {
            state.selectedIds = state.selectedIds.length === state.taskList.length
                ? []
                : state.taskList.map(task => (task.id))
        })

        .addCase(deleteTaskRequest, (state, action: PayloadAction<ITaskList[]>) => {
            state.taskList = action.payload.reverse();
            state.selectedIds = action.payload.map(task => (task.id))
        })

        .addCase(updateTaskRequest, (state, action: PayloadAction<ITaskList[]>) => {
            state.taskList = action.payload.reverse();
        })

        .addCase(bulkUpdateTasksType, (state, action: PayloadAction<ITaskList[]>) => {
            state.taskList = action.payload.reverse();
        })
        .addCase(loadingAction,(state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        })
        .addCase(getTaskRequest, (state, action: PayloadAction<ITaskList[]>) => {
            state.taskList = action.payload.reverse();
            state.loading = false;
            state.selectedIds = [];
        });
});

export default reducer;

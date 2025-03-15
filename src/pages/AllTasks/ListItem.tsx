import React, { FC, JSX, useLayoutEffect, useRef, useState } from 'react';
import classes from './all_tasks.module.scss';
import Checkbox from '../../components/Form/Checkbox/Checkbox';
import { ReactComponent as DoteIcon } from '../../assets/icons/dote.svg';
import { ReactComponent as ImportantIcon } from '../../assets/icons/important.svg';
import { ReactComponent as DoneModalIcon } from '../../assets/icons/done_modal.svg';
import { ReactComponent as UnDoneIcon } from '../../assets/icons/un_done.svg';
import { ReactComponent as EditIcon } from '../../assets/icons/edit.svg';
import { ReactComponent as DeleteIcon } from '../../assets/icons/delete.svg';
import { ReactComponent as ImportantActiveIcon } from '../../assets/icons/important_active.svg';
import { ITaskList, UpdateTask } from '../../components/Services/Services';
import { useDispatch, useSelector } from 'react-redux';
import { updateTaskRequest, deleteTaskRequest, selectTaskId } from '../../store/action/tasks';
import { RootState } from '../../store';
import { useClickAway } from 'react-use';
import DeleteModal from '../../components/Modal/DeleteModal';
import AddOrUpdateTaskModal from '../../components/Modal/AddOrUpdateTaskModal';
import { IAddTask } from '../../components/Header/Header';
import { useLocation } from 'react-router-dom';
import { useQuery } from '../../components/Hooks/useQuery';

interface IListItemProps {
  task: ITaskList;
}

export interface IActionItem {
  icon: JSX.Element;
  name: string;
  path: string;
  hoverColor: string;
}

const actionModalItems: IActionItem[] = [
  {
    icon: <DoneModalIcon />,
    name: 'Done',
    path: 'done',
    hoverColor: '#F0FFEE',
  },
  {
    icon: <UnDoneIcon />,
    name: 'Undone',
    path: 'undone',
    hoverColor: '#FFE3E3',
  },
  {
    icon: <EditIcon />,
    name: 'Edit',
    path: 'edit',
    hoverColor: '#F3F3F3',
  },
  {
    icon: <DeleteIcon />,
    name: 'Delete',
    path: 'delete',
    hoverColor: '#FFEFEF',
  },
];

const ListItem: FC<IListItemProps> = ({ task }) => {
  const { pathname } = useLocation();
  const { query } = useQuery();

  const textRef = useRef<HTMLDivElement>(null);
  const itemRef = useRef<HTMLDivElement>(null);
  const actionRef = useRef<HTMLDivElement>(null);

  const dispatch = useDispatch();
  const selectedIds: number[] = useSelector((store: RootState) => store.tasks.selectedIds);

  const [isOverflowing, setIsOverflowing] = useState<boolean>(false);
  const [openText, setOpenText] = useState<boolean>(false);
  const [textClassName, setTextClassName] = useState<string[]>([classes.task_info_text_description]);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);

  const [openEditModal, setOpenEditModal] = useState<boolean>(false);
  const [editTask, setEditTask] = useState<UpdateTask>({ ...task, path: pathname.replace(/^\/+/, ''), s: query.s });
  const [errors, setErrors] = useState<IAddTask>({ title: '', descriptions: '' });

  useLayoutEffect(() => {
    if (itemRef.current && textRef.current) {
      if (textRef.current.scrollWidth + 131 > itemRef.current.clientWidth) {
        setIsOverflowing(true);
        setTextClassName((prev) => [...prev, classes.text_width]);
      }
    }
  }, []);

  const onSeeMoreClick: () => void = () => {
    setOpenText(!openText);
    setTextClassName((prev) =>
      !openText ? [...prev, classes.task_show_more] : prev.filter((p) => p !== classes.task_show_more)
    );
  };

  const selectClick: (id: number) => void = (id: number) => {
    dispatch(selectTaskId(id));
  };

  useClickAway(actionRef, () => {
    setOpenModal(false);
  });

  const actionClick: (e: React.MouseEvent<HTMLDivElement>, path: string) => void = (
    e: React.MouseEvent<HTMLDivElement>,
    path: string
  ) => {
    e.stopPropagation();
    setOpenModal(false);

    if (path === 'delete') {
      setOpenDeleteModal(true);
    } else if (path === 'edit') {
      setOpenEditModal(true);
    } else {
      const updatedTask: UpdateTask = { ...task, path: pathname.replace(/^\/+/, ''), s: query.s, type: path };
      setEditTask(updatedTask);
      dispatch(updateTaskRequest(updatedTask));
    }
  };

  const deleteTask: () => void = () => {
    dispatch(deleteTaskRequest({ path: pathname.replace(/^\/+/, ''), s: query.s, ids: [task.id] }));
  };

  const onCloseModal: (type: string) => void = (type: string) => {
    setOpenEditModal(false);
    setEditTask(type === 'save' ? editTask : { ...task, path: pathname.replace(/^\/+/, ''), s: query.s });
    setErrors({ title: '', descriptions: '' });
  };

  const changeInputs: (path: string, value: string) => void = (path: string, value: string) => {
    setErrors((prev) => ({ ...prev, [path]: '' }));
    setEditTask((prev) => ({ ...prev, [path]: value }));
  };

  const saveClick: () => void = () => {
    let hasErrors = false;

    if (!editTask.title.trim()) {
      hasErrors = true;
      setErrors((prev) => ({ ...prev, title: 'This field is required' }));
    }

    if (!editTask.descriptions.trim()) {
      hasErrors = true;
      setErrors((prev) => ({ ...prev, descriptions: 'This field is required' }));
    }

    if (!hasErrors) {
      dispatch(updateTaskRequest(editTask));

      onCloseModal('save');
    }
  };

  return (
    <div className={classes.task} ref={itemRef} style={{ background: task.type === 'done' ? '#AEF5A6' : '#FFEFC2' }}>
      <div className={classes.task_info}>
        <Checkbox onChange={() => selectClick(task.id)} checked={selectedIds.includes(task.id)} />

        <div className={classes.task_info_text}>
          <h2>{task.title}</h2>

          <div className={classes.task_info_text_description_wrapper}>
            <p ref={textRef} className={textClassName.join(' ')}>
              {task.descriptions}
            </p>

            {isOverflowing && (
              <div
                tabIndex={0}
                role="button"
                onClick={onSeeMoreClick}
                className={classes.task_info_text_description_see}
              >
                {openText ? 'See Less' : 'See More'}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className={classes.task_actions}>
        {task.type !== 'done' && (
          <div
            className={classes.important}
            role="button"
            tabIndex={0}
            onClick={(e: React.MouseEvent<HTMLDivElement>) =>
              actionClick(e, task.type !== 'important' ? 'important' : 'undone')
            }
          >
            {task.type === 'important' ? <ImportantActiveIcon /> : <ImportantIcon />}
          </div>
        )}

        <div ref={actionRef} className={classes.dote} onClick={() => setOpenModal((prev) => !prev)}>
          <DoteIcon />

          {openModal && (
            <div className={classes.action_modal_wrapper}>
              {actionModalItems
                .filter((a: IActionItem) => (task.type === 'done' ? a.path !== 'done' : a.path !== 'undone'))
                .map((a: IActionItem) => (
                  <div
                    className={classes.action_modal_item}
                    key={a.path}
                    role="button"
                    style={{ '--button_hover_color': `${a.hoverColor}` } as React.CSSProperties}
                    tabIndex={0}
                    onClick={(e: React.MouseEvent<HTMLDivElement>) => actionClick(e, a.path)}
                  >
                    {a.icon}

                    <p>{a.name}</p>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>

      <DeleteModal
        open={openDeleteModal}
        close={() => setOpenDeleteModal(false)}
        onClick={deleteTask}
        text={'Are you sure you want to delete this task?'}
      />

      <AddOrUpdateTaskModal
        errors={errors}
        open={openEditModal}
        data={editTask}
        changeInput={changeInputs}
        onClose={() => onCloseModal('close')}
        onSaveClick={saveClick}
      />
    </div>
  );
};

export default ListItem;

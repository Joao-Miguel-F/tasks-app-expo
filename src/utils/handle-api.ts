import axios from 'axios';
import React from 'react';

const baseURL = process.env.EXPO_PUBLIC_API_URL;

export interface TaskItem {
  _id: string;
  text: string;
  completed?: boolean;
  dueDate?: string;
}

export const getAllTasks = (
  setTasks: React.Dispatch<React.SetStateAction<TaskItem[]>>,
  onDone?: () => void
) => {
  axios.get<TaskItem[]>(`${baseURL}`).then(({ data }) => {
    setTasks(data);
    onDone?.();
  }).catch((err) => {
    console.log(err);
    onDone?.();
  });
};

export const addTask = (
  task: TaskItem,
  setTasks: React.Dispatch<React.SetStateAction<TaskItem[]>>
) => {
  axios
    .post(`${baseURL}/save`, task)
    .then(() => {
      getAllTasks(setTasks);
    })
    .catch((err) => console.log(err));
};

export const updateTask = (
  task: TaskItem,
  setTasks: React.Dispatch<React.SetStateAction<TaskItem[]>>,
  setText: React.Dispatch<React.SetStateAction<string>>,
  setIsUpdating: React.Dispatch<React.SetStateAction<boolean>>
) => {
  axios
    .post(`${baseURL}/update`, task)
    .then(() => {
      setText('');
      setIsUpdating(false);
      getAllTasks(setTasks);
    })
    .catch((err) => console.log(err));
};

export const deleteTask = (
  task: TaskItem,
  setTasks: React.Dispatch<React.SetStateAction<TaskItem[]>>
) => {
  axios
    .post(`${baseURL}/delete`, task)
    .then(() => {
      getAllTasks(setTasks);
    })
    .catch((err) => console.log(err));
};

export const deleteAllTasks = (
  tasks: TaskItem[],
  setTasks: React.Dispatch<React.SetStateAction<TaskItem[]>>
) => {
  Promise.all(
    tasks.map((task) => axios.post(`${baseURL}/delete`, task))
  )
    .then(() => {
      setTasks([]);
    })
    .catch((err) => console.log(err));
};
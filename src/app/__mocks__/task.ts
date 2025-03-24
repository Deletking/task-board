import { Task } from '../features/tasks/models/task.model';

export const tasks: Task[] = [
  {
    id: '1',
    title: 'Ir na academia.',
    isCompleted: false,
    categoryId: '1',
  },
  {
    id: '2',
    title: 'Correr.',
    isCompleted: false,
    categoryId: '2',
  },
  {
    id: '3',
    title: 'Comprar pão na padaria.',
    isCompleted: false,
    categoryId: '3',
  },
];

export const task: Task = {
  id: '1',
  title: 'Ir na academia.',
  isCompleted: false,
  categoryId: '1',
};

export const TASK_INTERNAL_SERVER_ERROR_RESPONSE: {
  status: number;
  statusText: string;
} = {
  statusText: 'Internal Server Error',
  status: 500,
};

export const TASK_UNPROCESSABLE_ENTITY_RESPONSE: {
  status: number;
  statusText: string;
} = {
  statusText: 'Unprocessable Entity',
  status: 422,
};

export const TASK_NOT_FOUND_RESPONSE: {
  status: number;
  statusText: string;
} = {
  statusText: 'Not Found',
  status: 404,
};

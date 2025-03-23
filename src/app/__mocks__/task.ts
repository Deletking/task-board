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

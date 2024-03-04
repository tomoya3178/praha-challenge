import { Task } from './task';

export const TASK_REPOSITORY_TOKEN = 'TaskRepository';

export interface TaskRepositoryInterface {
  add(task: Task): Promise<void>;
  findByIds(ids: Task['value']['id'][]): Promise<Task[]>;
}

import { Task } from './task';

export interface TaskRepositoryInterface {
  add(task: Task): Promise<void>;
  findByIds(ids: Task['value']['id'][]): Promise<Task[]>;
}

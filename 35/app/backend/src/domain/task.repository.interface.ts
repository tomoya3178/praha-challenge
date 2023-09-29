import { Task } from './task';

export interface TaskRepositoryInterface {
  add(task: Task): Promise<void>;
}

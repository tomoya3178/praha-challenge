import { Task } from 'src/domain/task';
import { TaskRepositoryInterface } from 'src/domain/task.repository.interface';

export class TaskRepository implements TaskRepositoryInterface {
  async add(task: Task) {}
}

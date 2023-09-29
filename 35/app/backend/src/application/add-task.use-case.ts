import { Task } from 'src/domain/task';
import { TaskRepositoryInterface } from 'src/domain/task.repository.interface';

export class AddTaskUseCase {
  constructor(private readonly repository: TaskRepositoryInterface) {}
  async execute(input: Task['value']) {
    const task = new Task(input);
    await this.repository.add(task);
  }
}

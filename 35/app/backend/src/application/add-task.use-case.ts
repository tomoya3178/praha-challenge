import { Inject } from '@nestjs/common';
import { Task } from 'src/domain/task';
import {
  TASK_REPOSITORY_TOKEN,
  TaskRepositoryInterface,
} from 'src/domain/task.repository.interface';

export class AddTaskUseCase {
  constructor(
    @Inject(TASK_REPOSITORY_TOKEN)
    private readonly repository: TaskRepositoryInterface,
  ) {}
  async execute(input: Task['value']) {
    const task = new Task(input);
    await this.repository.add(task);
  }
}

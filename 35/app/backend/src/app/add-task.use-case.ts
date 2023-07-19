import { Task, TaskInterface } from "src/domain/task";
import { TaskRepositoryInterface } from "src/domain/task.repository.interface";

export class AddTaskUseCase {
  constructor (
    private readonly repository: TaskRepositoryInterface
  ) {}
  async execute (input: TaskInterface) {
    const task = new Task(input)
    await this.repository.add(task)
  }
}
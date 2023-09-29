import { Body, Controller, Post } from '@nestjs/common';
import { AddTaskUseCase } from 'src/application/add-task.use-case';
import { Id } from 'src/domain/id';
import { Task } from 'src/domain/task';
import { TaskRepository } from 'src/infrastructure/task.repository';

@Controller('tasks')
export class TaskController {
  constructor(
    private readonly addTaskUseCase = new AddTaskUseCase(new TaskRepository()),
  ) {}
  @Post()
  async add(
    @Body() request: { id: Task['id']['value']; name: Task['name'] },
  ): Promise<void> {
    await this.addTaskUseCase.execute({
      ...request,
      id: new Id(request.id),
    });
  }
}

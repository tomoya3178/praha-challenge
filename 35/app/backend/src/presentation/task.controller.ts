import { Body, Controller, Post } from '@nestjs/common';
import { AddTaskUseCase } from 'src/application/add-task.use-case';
import { Id } from 'src/domain/id';
import { Task } from 'src/domain/task';

@Controller('tasks')
export class TaskController {
  constructor(private readonly addTaskUseCase: AddTaskUseCase) {}
  @Post()
  async add(
    @Body()
    request: {
      id: Task['value']['id']['value'];
      name: Task['value']['name'];
    },
  ): Promise<void> {
    await this.addTaskUseCase.execute({
      ...request,
      id: new Id(request.id),
    });
  }
}

import { Body, Controller, Post } from "@nestjs/common";
import { AddTaskUseCase } from "src/app/add-task.use-case";
import { Id } from "src/domain/id";
import { Task } from "src/domain/task";
import { TaskRepository } from "src/infra/db/repository/task.repository";

@Controller({
  path: '/tasks',
})
export class TaskController {
  @Post()
  async add(
    @Body() request: { id: Task['id']['value'], name: Task['name'] },
  ): Promise<void> {
    const useCase = new AddTaskUseCase(new TaskRepository())
    await useCase.execute({
      ...request,
      id: new Id(request.id)
    })
  }
}

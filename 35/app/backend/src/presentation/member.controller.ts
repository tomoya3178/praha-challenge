import { Body, Controller, Post } from '@nestjs/common';
import { AddMemberUseCase } from 'src/application/add-member.use-case';
import { AssignTasksUseCase } from 'src/application/assign-tasks.use-case';
import { Id } from 'src/domain/id';
import { AssignedTask, Member } from 'src/domain/member';
import { Task } from 'src/domain/task';

@Controller('members')
export class MemberController {
  constructor(
    private readonly addMemberUseCase: AddMemberUseCase,
    private readonly assignTasksUseCase: AssignTasksUseCase,
  ) {}
  @Post()
  async add(
    @Body()
    request: {
      id: Member['value']['id']['value'];
      name: Member['value']['name'];
      email: Member['value']['email'];
      assignedTasks: {
        id: Member['value']['assignedTasks'][number]['value']['id']['value'];
        taskId: Member['value']['assignedTasks'][number]['value']['taskId']['value'];
        status: Member['value']['assignedTasks'][number]['value']['status'];
      }[];
    },
  ): Promise<void> {
    await this.addMemberUseCase.execute({
      ...request,
      id: new Id(request.id),
      assignedTasks: request.assignedTasks.map(
        (assignedTask) =>
          new AssignedTask({
            ...assignedTask,
            id: new Id(assignedTask.id),
            taskId: new Id(assignedTask.taskId),
          }),
      ),
    });
  }
  @Post('assign')
  async assignTasks(
    @Body()
    request: {
      memberId: Member['value']['id']['value'];
      taskIds: Task['value']['id']['value'][];
    },
  ) {
    return await this.assignTasksUseCase.execute({
      memberId: new Id(request.memberId),
      taskIds: request.taskIds.map((taskId) => new Id(taskId)),
    });
  }
}

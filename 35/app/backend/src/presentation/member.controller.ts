import { Body, Controller, Post } from '@nestjs/common';
import { AddMemberUseCase } from 'src/application/add-member.use-case';
import { Id } from 'src/domain/id';
import { AssignedTask, Member } from 'src/domain/member';

@Controller('members')
export class MemberController {
  constructor(private readonly addMemberUseCase: AddMemberUseCase) {}
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
}

import { BadRequestException } from '@nestjs/common';
import { Member } from 'src/domain/member';
import { MemberRepositoryInterface } from 'src/domain/member.repository.interface';
import { Task } from 'src/domain/task';
import { TaskRepositoryInterface } from 'src/domain/task.repository.interface';

export class AssignTasksUseCase {
  constructor(
    private readonly memberRepository: MemberRepositoryInterface,
    private readonly taskRepository: TaskRepositoryInterface,
  ) {}
  async execute(input: {
    memberId: Member['value']['id'];
    taskIds: Task['value']['id'][];
  }) {
    const member = await this.memberRepository.findById(input.memberId);
    if (!member) {
      throw new BadRequestException();
    }
    const tasks = await this.taskRepository.findByIds(input.taskIds);
    await this.memberRepository.update(member.assignTasks(tasks));
  }
}

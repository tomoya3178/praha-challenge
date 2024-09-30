import { BadRequestException, Inject } from '@nestjs/common';
import { Member } from 'src/domain/member';
import {
  MEMBER_REPOSITORY_TOKEN,
  MemberRepositoryInterface,
} from 'src/domain/member.repository.interface';
import { Task } from 'src/domain/task';
import {
  TASK_REPOSITORY_TOKEN,
  TaskRepositoryInterface,
} from 'src/domain/task.repository.interface';

export class AssignTasksUseCase {
  constructor(
    @Inject(MEMBER_REPOSITORY_TOKEN)
    private readonly memberRepository: MemberRepositoryInterface,
    @Inject(TASK_REPOSITORY_TOKEN)
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
    if (tasks.length !== input.taskIds.length) {
      throw new BadRequestException();
    }
    await this.memberRepository.update(member.assignTasks(tasks));
  }
}

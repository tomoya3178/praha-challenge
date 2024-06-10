import { Inject, NotFoundException } from '@nestjs/common';
import { AssignedTask, Member } from 'src/domain/member';
import {
  MEMBER_REPOSITORY_TOKEN,
  MemberRepositoryInterface,
} from 'src/domain/member.repository.interface';

export class ChangeAssignedTaskStatusUseCase {
  @Inject(MEMBER_REPOSITORY_TOKEN)
  private readonly memberRepository: MemberRepositoryInterface;

  async execute(
    memberId: Member['value']['id'],
    taskId: AssignedTask['value']['id'],
    input: AssignedTask['value']['status'],
  ) {
    const member = await this.memberRepository.findById(memberId);
    if (!member) {
      throw new NotFoundException();
    }
    member.changeAssignedTaskStatus(taskId, input);
    await this.memberRepository.update(member);
  }
}

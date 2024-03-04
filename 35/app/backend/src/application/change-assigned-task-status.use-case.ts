import { NotFoundException } from '@nestjs/common';
import { AssignedTask, Member } from 'src/domain/member';
import { MemberRepositoryInterface } from 'src/domain/member.repository.interface';

export class ChangeAssignedTaskStatusUseCase {
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
  }
}

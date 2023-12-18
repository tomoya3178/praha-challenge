import { Inject, InternalServerErrorException } from '@nestjs/common';
import { Member } from 'src/domain/member';
import {
  MEMBER_REPOSITORY_TOKEN,
  MemberRepositoryInterface,
} from 'src/domain/member.repository.interface';
import {
  TEAM_REPOSITORY_TOKEN,
  TeamRepositoryInterface,
} from 'src/domain/team.repository.interface';
import {
  TRANSACTION_MANAGER_TOKEN,
  TransactionManagerInterface,
} from 'src/domain/transaction-manager.interface';

export class ActivateMemberUseCase {
  constructor(
    @Inject(TRANSACTION_MANAGER_TOKEN)
    private readonly transactionManager: TransactionManagerInterface,
    @Inject(MEMBER_REPOSITORY_TOKEN)
    private readonly memberRepository: MemberRepositoryInterface,
    @Inject(TEAM_REPOSITORY_TOKEN)
    private readonly teamRepository: TeamRepositoryInterface,
  ) {}
  async execute(id: Member['value']['id']) {
    const member = await this.memberRepository.findById(id);
    if (!member) {
      throw new InternalServerErrorException();
    }
    const team = await this.teamRepository.findByMemberId(id);
    if (!team) {
      throw new InternalServerErrorException();
    }
    await this.transactionManager.execute(async () => {
      await this.memberRepository.update(member.changeStatus('INACTIVE'));
      await this.teamRepository.update(team.removeMember(id));
    });
  }
}

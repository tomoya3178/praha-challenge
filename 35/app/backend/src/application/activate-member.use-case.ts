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
    private readonly repository: MemberRepositoryInterface,
    @Inject(TEAM_REPOSITORY_TOKEN)
    private readonly teamRepository: TeamRepositoryInterface,
  ) {}
  async execute(id: Member['value']['id']) {
    const member = await this.repository.findById(id);
    if (!member) {
      throw new InternalServerErrorException();
    }
    const updatedMember = member.changeStatus('ACTIVE');
    const teams = await this.teamRepository.getAll();
    const team = teams
      .reduce((a, b) => {
        if (
          b.value.pairs.flatMap(({ value: { memberIds: members } }) => members)
            .length <
          a.value.pairs.flatMap(({ value: { memberIds: members } }) => members)
            .length
        ) {
          return b;
        }
        return a;
      })
      .addMember(updatedMember.value.id);
    await this.transactionManager.execute(async () => {
      await this.repository.update(updatedMember);
      await this.teamRepository.update(team);
    });
  }
}

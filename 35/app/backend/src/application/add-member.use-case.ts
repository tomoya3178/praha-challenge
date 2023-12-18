import {
  BadRequestException,
  Inject,
  InternalServerErrorException,
} from '@nestjs/common';
import { Member } from 'src/domain/member';
import {
  MEMBER_REPOSITORY_TOKEN,
  MemberRepositoryInterface,
} from 'src/domain/member.repository.interface';
import { MemberService } from 'src/domain/member.service';
import { Team } from 'src/domain/team';
import {
  TEAM_REPOSITORY_TOKEN,
  TeamRepositoryInterface,
} from 'src/domain/team.repository.interface';
import {
  TRANSACTION_MANAGER_TOKEN,
  TransactionManagerInterface,
} from 'src/domain/transaction-manager.interface';

export class AddMemberUseCase {
  constructor(
    private readonly service: MemberService,
    @Inject(TRANSACTION_MANAGER_TOKEN)
    private readonly transactionManager: TransactionManagerInterface,
    @Inject(MEMBER_REPOSITORY_TOKEN)
    private readonly memberRepository: MemberRepositoryInterface,
    @Inject(TEAM_REPOSITORY_TOKEN)
    private readonly teamRepository: TeamRepositoryInterface,
  ) {}
  async execute(
    id: Team['value']['id'],
    input: Omit<Member['value'], 'status'>,
  ) {
    if (await this.service.emailExists(input.email)) {
      throw new BadRequestException();
    }
    const member = new Member({
      ...input,
      status: 'ACTIVE',
    });
    const team = await this.teamRepository.findById(id);
    if (!team) {
      throw new InternalServerErrorException();
    }
    await this.transactionManager.execute(async () => {
      await this.memberRepository.add(member);
      await this.teamRepository.update(team.addMember(member.value.id));
    });
  }
}

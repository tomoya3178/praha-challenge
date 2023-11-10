import { BadRequestException, Inject } from '@nestjs/common';
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

export class AddMemberUseCase {
  constructor(
    private readonly service: MemberService,
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
    await this.memberRepository.add(member);
    const team = await this.teamRepository.findById(id);
    const updatedTeam = team.addMember(member.value.id);
    await this.teamRepository.update(updatedTeam);
  }
}

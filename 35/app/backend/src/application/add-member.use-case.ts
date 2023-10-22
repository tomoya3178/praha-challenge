import { BadRequestException, Inject } from '@nestjs/common';
import { Member } from 'src/domain/member';
import { MemberService } from 'src/domain/member.service';
import { Team } from 'src/domain/team';
import {
  TEAM_REPOSITORY_TOKEN,
  TeamRepositoryInterface,
} from 'src/domain/team.repository.interface';

export class AddMemberUseCase {
  constructor(
    private readonly service: MemberService,
    @Inject(TEAM_REPOSITORY_TOKEN)
    private readonly repository: TeamRepositoryInterface,
  ) {}
  async execute(
    id: Team['value']['id'],
    input: Omit<Member['value'], 'status'>,
  ) {
    if (await this.service.emailExists(input.email)) {
      throw new BadRequestException();
    }
    const team = await this.repository.findById(id);
    const updatedTeam = team.addMember(
      new Member({
        ...input,
        status: 'ACTIVE',
      }),
    );
    await this.repository.update(updatedTeam);
  }
}

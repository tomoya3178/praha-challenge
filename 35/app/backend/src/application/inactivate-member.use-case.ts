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

export class ActivateMemberUseCase {
  constructor(
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
    const updatedMember = member.changeStatus('INACTIVE');
    await this.memberRepository.update(updatedMember);
    const team = (await this.teamRepository.getAll())
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
    await this.teamRepository.update(team);
  }
}

import { BadRequestException, Inject } from '@nestjs/common';
import { Member } from 'src/domain/member';
import {
  MEMBER_REPOSITORY_TOKEN,
  MemberRepositoryInterface,
} from 'src/domain/member.repository.interface';
import { MemberService } from 'src/domain/member.service';

export class AddMemberUseCase {
  constructor(
    private readonly service: MemberService,
    @Inject(MEMBER_REPOSITORY_TOKEN)
    private readonly repository: MemberRepositoryInterface,
  ) {}
  async execute(input: Omit<Member['value'], 'status'>) {
    if (await this.service.emailExists(input.email)) {
      throw new BadRequestException();
    }
    const member = new Member({
      ...input,
      status: 'ACTIVE',
    });
    await this.repository.add(member);
  }
}

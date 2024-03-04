import { Inject } from '@nestjs/common';
import { Member } from './member';
import {
  MEMBER_REPOSITORY_TOKEN,
  MemberRepositoryInterface,
} from './member.repository.interface';

export class MemberService {
  constructor(
    @Inject(MEMBER_REPOSITORY_TOKEN)
    private readonly repository: MemberRepositoryInterface,
  ) {}
  async emailExists(email: Member['value']['email']) {
    const member = await this.repository.findByEmail(email);
    return !!member;
  }
}

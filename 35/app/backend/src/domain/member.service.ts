import { Member } from './member';
import { MemberRepositoryInterface } from './member.repository.interface';

export class MemberService {
  private readonly repository: MemberRepositoryInterface;
  async emailExists(email: Member['value']['email']) {
    const member = await this.repository.findByEmail(email);
    return !!member;
  }
}

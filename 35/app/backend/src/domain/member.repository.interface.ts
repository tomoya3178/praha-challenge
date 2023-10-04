import { Member } from './member';

export interface MemberRepositoryInterface {
  add(member: Member): Promise<void>;
  findByEmail(email: Member['value']['email']): Promise<Member>;
}

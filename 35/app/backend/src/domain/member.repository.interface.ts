import { Member } from './member';

export interface MemberRepositoryInterface {
  add(member: Member): Promise<void>;
  findByEmail(email: Member['value']['email']): Promise<Member | undefined>;
  findById(id: Member['value']['id']): Promise<Member | undefined>;
  update(member: Member): Promise<void>;
}

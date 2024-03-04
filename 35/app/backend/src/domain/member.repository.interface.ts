import { Member } from './member';

export const MEMBER_REPOSITORY_TOKEN = 'MemberRepository';

export interface MemberRepositoryInterface {
  add(member: Member): Promise<void>;
  findByEmail(email: Member['value']['email']): Promise<Member | undefined>;
}

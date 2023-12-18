import { Member } from './member';
import { Team } from './team';

export const TEAM_REPOSITORY_TOKEN = 'TeamRepository';

export interface TeamRepositoryInterface {
  findById(id: Team['value']['id']): Promise<Team | undefined>;
  update(team: Team): Promise<void>;
  getAll(): Promise<Team[]>;
  findByMemberId(memberId: Member['value']['id']): Promise<Team | undefined>;
}
